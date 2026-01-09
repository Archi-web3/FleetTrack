const express = require('express');
const router = express.Router();
const WeeklyChecklist = require('../models/weekly-checklist.model');
const ServiceSchedule = require('../models/service-schedule.model');
const ChecklistTemplate = require('../models/checklist-template.model');
const MaintenanceConfig = require('../models/maintenance-config.model');
const Vehicule = require('../models/vehicule.model');
const auth = require('../middleware/authMiddleware');

// ============================================
// WEEKLY CHECKLIST ROUTES
// ============================================

// GET /api/maintenance/weekly/current - Checklist de la semaine en cours
router.get('/weekly/current', auth(), async (req, res) => {
    try {
        console.log('📋 [WEEKLY CHECKLIST] Début requête');
        const userId = req.userId;
        const vehiculeId = req.query.vehicule;
        console.log('📋 [WEEKLY CHECKLIST] userId:', userId, 'vehiculeId:', vehiculeId);

        if (!vehiculeId) {
            return res.status(400).json({ message: 'Véhicule requis' });
        }

        // Calculer semaine et année actuelles
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
        const semaine = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        const annee = now.getFullYear();
        console.log('📋 [WEEKLY CHECKLIST] Semaine:', semaine, 'Année:', annee);

        // Chercher checklist existante
        console.log('📋 [WEEKLY CHECKLIST] Recherche checklist existante...');
        let checklist = await WeeklyChecklist.findOne({
            vehicule: vehiculeId,
            semaine: semaine,
            annee: annee
        }).populate('vehicule').populate('chauffeur');
        console.log('📋 [WEEKLY CHECKLIST] Checklist trouvée:', checklist ? 'OUI' : 'NON');

        // Si pas de checklist, en créer une
        if (!checklist) {
            console.log('📋 [WEEKLY CHECKLIST] Création nouvelle checklist...');
            const template = await ChecklistTemplate.findOne({ type: 'Hebdomadaire', actif: true });
            if (!template) {
                console.log('❌ [WEEKLY CHECKLIST] Template non trouvé');
                return res.status(404).json({ message: 'Template checklist non trouvé' });
            }
            console.log('📋 [WEEKLY CHECKLIST] Template trouvé, création...');

            checklist = await WeeklyChecklist.create({
                vehicule: vehiculeId,
                semaine: semaine,
                annee: annee,
                chauffeur: userId,
                taches: template.taches.map(t => ({
                    numero: t.numero,
                    categorie: t.categorie,
                    description: t.description,
                    numeroTacheManuel: t.numeroTacheManuel,
                    validee: false
                })),
                completee: false,
                tauxCompletion: 0
            });
            console.log('📋 [WEEKLY CHECKLIST] Checklist créée, populate...');

            checklist = await checklist.populate('vehicule').populate('chauffeur');
            console.log('📋 [WEEKLY CHECKLIST] Populate terminé');
        }

        console.log('✅ [WEEKLY CHECKLIST] Envoi réponse');
        res.json(checklist);
    } catch (error) {
        console.error('Erreur récupération checklist:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// POST /api/maintenance/weekly/validate-task - Valider une tâche
router.post('/weekly/validate-task', auth(), async (req, res) => {
    try {
        const { checklistId, tacheId, validee, commentaire } = req.body;

        const checklist = await WeeklyChecklist.findById(checklistId);
        if (!checklist) {
            return res.status(404).json({ message: 'Checklist non trouvée' });
        }

        const tache = checklist.taches.id(tacheId);
        if (!tache) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        tache.validee = validee;
        tache.dateValidation = validee ? new Date() : null;
        if (commentaire) tache.commentaire = commentaire;

        // Calculer taux de complétion
        const totalTaches = checklist.taches.length;
        const tachesValidees = checklist.taches.filter(t => t.validee).length;
        checklist.tauxCompletion = Math.round((tachesValidees / totalTaches) * 100);
        checklist.completee = checklist.tauxCompletion === 100;

        if (checklist.completee && !checklist.dateCompletion) {
            checklist.dateCompletion = new Date();
        } else if (!checklist.completee) {
            checklist.dateCompletion = null;
        }

        await checklist.save();
        res.json(checklist);
    } catch (error) {
        console.error('Erreur validation tâche:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// GET /api/maintenance/weekly/history - Historique des checklists
router.get('/weekly/history', auth(), async (req, res) => {
    try {
        const vehiculeId = req.query.vehicule;
        const limit = parseInt(req.query.limit) || 10;

        const query = vehiculeId ? { vehicule: vehiculeId } : {};

        const checklists = await WeeklyChecklist.find(query)
            .populate('vehicule')
            .populate('chauffeur')
            .sort({ annee: -1, semaine: -1 })
            .limit(limit);

        res.json(checklists);
    } catch (error) {
        console.error('Erreur historique checklists:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// GET /api/maintenance/stats - Statistiques globales maintenance
router.get('/stats', auth(), async (req, res) => {
    try {
        // 1. Total Véhicules Actifs
        const totalVehicules = await Vehicule.countDocuments({ enService: true });
        console.log('📊 [STATS] Véhicules Actifs:', totalVehicules);

        // 2. Services Dus (Dû ou En retard)
        const servicesDus = await ServiceSchedule.countDocuments({
            statut: { $in: ['Dû', 'En retard'] }
        });

        // 3. Checklists Incomplètes (Véhicules actifs - Checklists complétées cette semaine)
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
        const semaine = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        const annee = now.getFullYear();

        const checklistsCompletees = await WeeklyChecklist.countDocuments({
            semaine: semaine,
            annee: annee,
            completee: true
        });
        console.log(`📊 [STATS] Semaine ${semaine}/${annee} - Checklists Complétées: ${checklistsCompletees}`);

        // "Incomplètes" = Tout véhicule qui n'a PA encore sa checklist complétée pour la semaine
        const checklistsRetard = Math.max(0, totalVehicules - checklistsCompletees);
        console.log('📊 [STATS] Checklists Incomplètes (Calculé):', checklistsRetard);

        res.json({
            totalVehicules,
            servicesDus,
            checklistsRetard,
            coutMoyen: 0 // TODO: Implémenter logique coûts
        });
    } catch (error) {
        console.error('Erreur stats maintenance:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// ============================================
// SERVICE SCHEDULE ROUTES
// ============================================

// GET /api/maintenance/service/next - Prochain service dû
router.get('/service/next', auth(), async (req, res) => {
    try {
        const vehiculeId = req.query.vehicule;

        if (!vehiculeId) {
            return res.status(400).json({ message: 'Véhicule requis' });
        }

        const vehicule = await Vehicule.findById(vehiculeId);
        if (!vehicule) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }

        // Chercher le prochain service non complété
        let service = await ServiceSchedule.findOne({
            vehicule: vehiculeId,
            statut: { $ne: 'Complété' }
        }).sort({ kilometragePrevu: 1 });

        // Si pas de service, créer le premier
        if (!service) {
            const config = await MaintenanceConfig.findOne({
                typeVehicule: vehicule.type || 'Land Cruiser',
                actif: true
            });

            const intervalleService = config ? config.intervalleService : 5000;

            service = await ServiceSchedule.create({
                vehicule: vehiculeId,
                typeService: 'A',
                kilometragePrevu: intervalleService,
                kilometrageActuel: vehicule.initialMileage || 0,
                statut: 'À venir',
                prochainService: {
                    type: 'B',
                    kilometrage: intervalleService * 2
                }
            });
        }

        // Mettre à jour le statut basé sur le kilométrage actuel
        const kmActuel = vehicule.initialMileage || 0;
        service.kilometrageActuel = kmActuel;

        if (kmActuel >= service.kilometragePrevu + 200) {
            service.statut = 'En retard';
        } else if (kmActuel >= service.kilometragePrevu) {
            service.statut = 'Dû';
        } else if (kmActuel >= service.kilometragePrevu - 500) {
            service.statut = 'À venir';
            if (!service.dateAlerte) {
                service.dateAlerte = new Date();
            }
        }

        await service.save();
        res.json(service);
    } catch (error) {
        console.error('Erreur prochain service:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// POST /api/maintenance/service/complete - Marquer service complété
router.post('/service/complete', auth(), async (req, res) => {
    try {
        const { serviceId, signature } = req.body;
        const userId = req.userId;

        // Vérifier que l'utilisateur est superviseur
        const user = await require('../models/utilisateur.model').findById(userId);
        if (!user || !['Superviseur', 'Admin', 'SuperAdmin'].includes(user.statut)) {
            return res.status(403).json({ message: 'Seuls les superviseurs peuvent valider les services' });
        }

        const service = await ServiceSchedule.findById(serviceId).populate('vehicule');
        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }

        service.statut = 'Complété';
        service.dateCompletion = new Date();
        service.signature = {
            superviseur: userId,
            date: new Date(),
            signatureData: signature
        };

        // Calculer le prochain service selon la séquence A-B-A-C
        const config = await MaintenanceConfig.findOne({
            typeVehicule: service.vehicule.type || 'Land Cruiser',
            actif: true
        });
        const intervalleService = config ? config.intervalleService : 5000;

        let prochainType;
        switch (service.typeService) {
            case 'A':
                // Après A, vérifier si c'est le moment de C
                const lastC = await ServiceSchedule.findOne({
                    vehicule: service.vehicule._id,
                    typeService: 'C',
                    statut: 'Complété'
                }).sort({ dateCompletion: -1 });

                const servicesDepuisC = await ServiceSchedule.countDocuments({
                    vehicule: service.vehicule._id,
                    statut: 'Complété',
                    dateCompletion: { $gt: lastC ? lastC.dateCompletion : new Date(0) }
                });

                prochainType = (servicesDepuisC >= 3) ? 'C' : 'B';
                break;
            case 'B':
                prochainType = 'A';
                break;
            case 'C':
                prochainType = 'A';
                break;
        }

        await service.save();

        // Créer le prochain service
        const prochainKm = service.kilometragePrevu + intervalleService;
        await ServiceSchedule.create({
            vehicule: service.vehicule._id,
            typeService: prochainType,
            kilometragePrevu: prochainKm,
            kilometrageActuel: service.kilometrageActuel,
            statut: 'À venir'
        });

        res.json(service);
    } catch (error) {
        console.error('Erreur complétion service:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// GET /api/maintenance/service/alerts - Alertes services
router.get('/service/alerts', auth(), async (req, res) => {
    try {
        const services = await ServiceSchedule.find({
            statut: { $in: ['Dû', 'En retard'] }
        }).populate('vehicule').sort({ kilometragePrevu: 1 });

        res.json(services);
    } catch (error) {
        console.error('Erreur alertes services:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// ============================================
// CONFIGURATION ROUTES
// ============================================

// GET /api/maintenance/config - Liste des configurations
router.get('/config', auth(), async (req, res) => {
    try {
        const configs = await MaintenanceConfig.find().sort({ typeVehicule: 1 });
        res.json(configs);
    } catch (error) {
        console.error('Erreur récupération configs:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// POST /api/maintenance/config - Créer configuration
router.post('/config', auth(), async (req, res) => {
    try {
        const config = await MaintenanceConfig.create(req.body);
        res.status(201).json(config);
    } catch (error) {
        console.error('Erreur création config:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// PUT /api/maintenance/config/:id - Modifier configuration
router.put('/config/:id', auth(), async (req, res) => {
    try {
        const config = await MaintenanceConfig.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(config);
    } catch (error) {
        console.error('Erreur modification config:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// ============================================
// TEMPLATE ROUTES
// ============================================

// GET /api/maintenance/template - Liste des templates
router.get('/template', auth(), async (req, res) => {
    try {
        const templates = await ChecklistTemplate.find().sort({ type: 1, nom: 1 });
        res.json(templates);
    } catch (error) {
        console.error('Erreur récupération templates:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// POST /api/maintenance/template - Créer template
router.post('/template', auth(), async (req, res) => {
    try {
        const template = await ChecklistTemplate.create(req.body);
        res.status(201).json(template);
    } catch (error) {
        console.error('Erreur création template:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// PUT /api/maintenance/template/:id - Modifier template
router.put('/template/:id', auth(), async (req, res) => {
    try {
        const template = await ChecklistTemplate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(template);
    } catch (error) {
        console.error('Erreur modification template:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// DELETE /api/maintenance/config/:id - Supprimer configuration
router.delete('/config/:id', auth(), async (req, res) => {
    try {
        const config = await MaintenanceConfig.findByIdAndDelete(req.params.id);
        if (!config) {
            return res.status(404).json({ message: 'Configuration non trouvée' });
        }
        res.json({ message: 'Configuration supprimée' });
    } catch (error) {
        console.error('Erreur suppression config:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// DELETE /api/maintenance/template/:id - Supprimer template
router.delete('/template/:id', auth(), async (req, res) => {
    try {
        const template = await ChecklistTemplate.findByIdAndDelete(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Template non trouvé' });
        }
        res.json({ message: 'Template supprimé' });
    } catch (error) {
        console.error('Erreur suppression template:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

module.exports = router;
