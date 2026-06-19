const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Vehicule = require('../models/vehicule.model');
const ServiceSchedule = require('../models/service-schedule.model');
const MaintenanceConfig = require('../models/maintenance-config.model');
const Mouvement = require('../models/mouvement.model');
const predictiveService = require('../services/predictive-maintenance.service');

const WeeklyChecklist = require('../models/weekly-checklist.model');
const Base = require('../models/base.model');

/**
 * GET /api/maintenance-tracking/overview
 * Vue d'ensemble de tous les véhicules avec leur statut de maintenance
 */
router.get('/overview', auth(['SuperAdmin', 'Admin', 'Superviseur']), async (req, res) => {
    try {
        const { base, statut, typeVehicule } = req.query;
        let vehiculeFilter = { enService: true };

        // 1. Filtrage par Pays/Base (Role-Based)

        // SUPERVISEUR : Restriction stricte à sa base
        if (req.utilisateur.profil === 'Superviseur') {
            if (req.utilisateur.base) {
                vehiculeFilter.base = req.utilisateur.base;
            } else {
                // Si un superviseur n'a pas de base, il ne doit rien voir
                return res.json([]);
            }
        }
        // ADMIN PAYS (Force sa zone) & SUPER ADMIN (si pays sélectionné)
        else if (req.selectedCountry) {
            // Récupérer les bases du pays
            const basesInCountry = await Base.find({ pays: req.selectedCountry }).select('_id');
            const allowedBaseIds = basesInCountry.map(b => b._id.toString());

            if (base) {
                // Si une base spécifique est demandée
                if (allowedBaseIds.includes(base)) {
                    vehiculeFilter.base = base;
                } else {
                    // Base demandée hors du pays autorisé -> Rejet
                    return res.json([]);
                }
            } else {
                // Sinon, toutes les bases du pays
                vehiculeFilter.base = { $in: allowedBaseIds };
            }
        }
        else if (req.utilisateur.profil === 'SuperAdmin') {
            // Peut tout voir, ou filtrer par base s'il le souhaite
            if (base) vehiculeFilter.base = base;
        } else {
            // SÉCURITÉ PAR DÉFAUT: Si aucun critère ne correspond (ex: Admin sans pays), on ne montre rien.
            return res.json([]);
        }

        if (typeVehicule) vehiculeFilter.type = typeVehicule;

        const vehicules = await Vehicule.find(vehiculeFilter)
            .populate('base')
            .sort({ immatriculation: 1 });

        // 2. Récupérer les configurations de maintenance actives
        const maintenanceConfigs = await MaintenanceConfig.find({ actif: true });

        // Pour chaque véhicule, récupérer son prochain service et dernier service complété
        const overview = await Promise.all(vehicules.map(async (vehicule) => {

            // Trouver la config pour ce type de véhicule
            const config = maintenanceConfigs.find(c => c.typeVehicule === vehicule.type);
            const intervalle = config ? config.intervalleService : 5000; // Défaut 5000km

            // Prochain service (non complété, par ordre de km)
            const prochainService = await ServiceSchedule.findOne({
                vehicule: vehicule._id,
                statut: { $ne: 'Complété' }
            }).sort({ kilometragePrevu: 1 });

            // Dernier service complété
            const dernierService = await ServiceSchedule.findOne({
                vehicule: vehicule._id,
                statut: 'Complété'
            }).sort({ dateCompletion: -1 });

            // Checklists Hebdo (Dernière validée)
            const lastChecklist = await WeeklyChecklist.findOne({
                vehicule: vehicule._id,
                status: 'Validated' // On suppose que 'Validated' est le statut final
            }).sort({ submissionDate: -1 });

            let checklistStatus = 'ok';
            if (lastChecklist) {
                const daysSinceLastCheck = (new Date() - new Date(lastChecklist.submissionDate)) / (1000 * 60 * 60 * 24);
                if (daysSinceLastCheck > 7) checklistStatus = 'late';
            } else {
                checklistStatus = 'never'; // Jamais fait
            }

            // Calculer l'écart km
            let ecartKm = null;
            let statusCode = 'ok'; // ok, proche, retard, critique

            // S'il y a un service planifié spécifiquement
            if (prochainService) {
                ecartKm = prochainService.kilometragePrevu - vehicule.kilometrage;
            }
            // Sinon, calculer basé sur le dernier service + intervalle
            else if (dernierService) {
                const prochainKmTheorique = dernierService.kilometragePrevu + intervalle;
                ecartKm = prochainKmTheorique - vehicule.kilometrage;
            }
            // Si jamais eu de service (véhicule neuf ou historique manquant), on calcule le prochain théorique
            else {
                // BUG FIX: Au lieu de partir de 0 + 5000, on part du kilométrage actuel
                // Ex: Si 148,000 km et intervalle 5,000 -> Prochain à 150,000 (30 * 5000)
                const intervalleKm = intervalle || 5000;
                // On arrondit au prochain multiple de 5000
                const prochainKmTheorique = Math.ceil((vehicule.kilometrage + 1) / intervalleKm) * intervalleKm;
                ecartKm = prochainKmTheorique - vehicule.kilometrage;
            }

            if (ecartKm !== null) {
                if (ecartKm < 0) statusCode = 'retard'; // Dépassé
                if (ecartKm < -2000) statusCode = 'critique'; // Très dépassé
                else if (ecartKm < 500 && ecartKm >= 0) statusCode = 'proche'; // Bientôt
            }

            // Calculer la date estimée
            let dateEstimee = null;
            if (ecartKm !== null && ecartKm > 0) {
                const servicesCompletes = await ServiceSchedule.find({
                    vehicule: vehicule._id,
                    statut: 'Complété'
                }).sort({ dateCompletion: 1 });

                let moyenneKmParMois = 1000;
                if (servicesCompletes.length >= 2) {
                    const premier = servicesCompletes[0];
                    const dernier = servicesCompletes[servicesCompletes.length - 1];
                    const kmParcourus = dernier.kilometragePrevu - premier.kilometragePrevu;
                    const tempsMois = (dernier.dateCompletion - premier.dateCompletion) / (1000 * 60 * 60 * 24 * 30);
                    if (tempsMois > 0) {
                        moyenneKmParMois = Math.round(kmParcourus / tempsMois);
                    }
                }
                if (moyenneKmParMois <= 0 || isNaN(moyenneKmParMois)) {
                    moyenneKmParMois = 1000;
                }
                
                const moisEstimes = ecartKm / moyenneKmParMois;
                dateEstimee = new Date();
                if (isFinite(moisEstimes)) {
                    dateEstimee.setDate(dateEstimee.getDate() + Math.round(moisEstimes * 30));
                }
            } else if (ecartKm !== null && ecartKm <= 0) {
                dateEstimee = new Date(); // Déjà dû
            }

            return {
                vehicule: {
                    _id: vehicule._id,
                    immatriculation: vehicule.immatriculation,
                    marque: vehicule.marque,
                    modele: vehicule.modele,
                    type: vehicule.type,
                    kilometrage: vehicule.kilometrage,
                    base: vehicule.base
                },
                dernierService: dernierService ? {
                    type: dernierService.typeService,
                    date: dernierService.dateCompletion,
                    km: dernierService.kilometragePrevu
                } : null,
                prochainService: prochainService ? {
                    _id: prochainService._id,
                    type: prochainService.typeService,
                    kmPrevu: prochainService.kilometragePrevu,
                    statut: prochainService.statut,
                    dateEstimee: dateEstimee
                } : {
                    // Si pas de service planifié, on renvoie l'estimation
                    type: 'Estimé',
                    kmPrevu: (vehicule.kilometrage + (ecartKm || 0)),
                    statut: 'Planifié (Auto)',
                    dateEstimee: dateEstimee
                },
                checklist: {
                    status: checklistStatus,
                    lastDate: lastChecklist ? lastChecklist.submissionDate : null
                },
                ecartKm,
                statusCode
            };
        }));

        // Filtrer par statut si demandé
        let filtered = overview;
        if (statut) {
            filtered = overview.filter(item => item.statusCode === statut);
        }

        res.json(filtered);

    } catch (error) {
        console.error('❌ [MAINTENANCE-TRACKING] Erreur overview:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * GET /api/maintenance-tracking/vehicle/:id
 * Détails complets d'un véhicule (historique + planning)
 */
router.get('/vehicle/:id', auth(['SuperAdmin', 'Admin', 'Superviseur']), async (req, res) => {
    try {
        const vehicule = await Vehicule.findById(req.params.id).populate('base');
        if (!vehicule) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }

        // Récupérer TOUS les services (complétés et à venir)
        const services = await ServiceSchedule.find({ vehicule: req.params.id })
            .sort({ kilometragePrevu: 1 });

        // Séparer complétés vs à venir
        const servicesCompletes = services.filter(s => s.statut === 'Complété');
        const servicesAVenir = services.filter(s => s.statut !== 'Complété');

        // Récupérer la config maintenance
        const config = await MaintenanceConfig.findOne({
            typeVehicule: vehicule.type,
            actif: true
        });

        res.json({
            vehicule,
            config: config ? {
                intervalleService: config.intervalleService,
                conditionsRoute: config.conditionsRoute
            } : null,
            historique: servicesCompletes,
            aVenir: servicesAVenir,
            stats: {
                totalServices: services.length,
                completes: servicesCompletes.length,
                enAttente: servicesAVenir.length
            }
        });

    } catch (error) {
        console.error('❌ [MAINTENANCE-TRACKING] Erreur detail vehicule:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * GET /api/maintenance-tracking/alerts
 * Liste des véhicules nécessitant une intervention urgente
 */
router.get('/alerts', auth(['SuperAdmin', 'Admin', 'Superviseur']), async (req, res) => {
    try {
        // Récupérer tous les services en retard ou critiques
        const servicesUrgents = await ServiceSchedule.find({
            statut: { $in: ['En retard', 'Dû'] }
        }).populate('vehicule');

        // Grouper par véhicule et calculer la criticité
        const alertes = [];
        for (const service of servicesUrgents) {
            if (!service.vehicule) continue;

            const ecartKm = service.kilometragePrevu - service.vehicule.kilometrage;
            const criticite = ecartKm < -2000 ? 'critique' : (ecartKm < 0 ? 'retard' : 'proche');

            alertes.push({
                vehicule: {
                    _id: service.vehicule._id,
                    immatriculation: service.vehicule.immatriculation,
                    marque: service.vehicule.marque,
                    modele: service.vehicule.modele,
                    kilometrage: service.vehicule.kilometrage
                },
                service: {
                    _id: service._id,
                    type: service.typeService,
                    kmPrevu: service.kilometragePrevu,
                    statut: service.statut
                },
                ecartKm,
                criticite
            });
        }

        // Trier par criticité (critique > retard > proche)
        alertes.sort((a, b) => {
            const ordre = { critique: 0, retard: 1, proche: 2 };
            return ordre[a.criticite] - ordre[b.criticite];
        });

        res.json(alertes);

    } catch (error) {
        console.error('❌ [MAINTENANCE-TRACKING] Erreur alertes:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * GET /api/maintenance-tracking/predictive/:id
 * Planning prévisionnel basé sur l'historique des km parcourus
 */
router.get('/predictive/:id', auth(['SuperAdmin', 'Admin', 'Superviseur']), async (req, res) => {
    try {
        const vehicule = await Vehicule.findById(req.params.id);
        if (!vehicule) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }

        // Récupérer les services complétés pour calculer la moyenne km/mois
        const servicesCompletes = await ServiceSchedule.find({
            vehicule: req.params.id,
            statut: 'Complété'
        }).sort({ dateCompletion: 1 });

        let moyenneKmParMois = 1000; // Valeur par défaut si aucun historique

        if (servicesCompletes.length >= 2) {
            // Calculer la différence entre le premier et dernier service
            const premier = servicesCompletes[0];
            const dernier = servicesCompletes[servicesCompletes.length - 1];

            const kmParcourus = dernier.kilometragePrevu - premier.kilometragePrevu;
            const tempsMois = (dernier.dateCompletion - premier.dateCompletion) / (1000 * 60 * 60 * 24 * 30);

            if (tempsMois > 0) {
                moyenneKmParMois = Math.round(kmParcourus / tempsMois);
            }
        }

        // Récupérer les services à venir
        const servicesAVenir = await ServiceSchedule.find({
            vehicule: req.params.id,
            statut: { $ne: 'Complété' }
        }).sort({ kilometragePrevu: 1 });

        // Prédire les dates approximatives
        const predictions = servicesAVenir.map(service => {
            const kmRestants = service.kilometragePrevu - vehicule.kilometrage;
            const moisEstimes = kmRestants / moyenneKmParMois;
            const dateEstimee = new Date();
            dateEstimee.setMonth(dateEstimee.getMonth() + Math.round(moisEstimes));

            return {
                service: {
                    type: service.typeService,
                    kmPrevu: service.kilometragePrevu
                },
                kmRestants,
                dateEstimee,
                moisEstimes: Math.round(moisEstimes)
            };
        });

        res.json({
            moyenneKmParMois,
            historique: servicesCompletes.length,
            predictions
        });

    } catch (error) {
        console.error('❌ [MAINTENANCE-TRACKING] Erreur predictive:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * GET /api/maintenance-tracking/calendar
 * Récupère le planning prévisionnel de tous les véhicules pour le calendrier global
 */
router.get('/calendar', auth(['SuperAdmin', 'Admin', 'Superviseur']), async (req, res) => {
    try {
        const { base, typeVehicule } = req.query;
        let vehiculeFilter = { enService: true };

        // Filtrage Role-Based
        if (req.utilisateur.profil === 'Superviseur') {
            if (req.utilisateur.base) {
                vehiculeFilter.base = req.utilisateur.base;
            } else {
                return res.json([]);
            }
        } else if (req.selectedCountry) {
            const basesInCountry = await Base.find({ pays: req.selectedCountry }).select('_id');
            const allowedBaseIds = basesInCountry.map(b => b._id.toString());
            if (base) {
                if (allowedBaseIds.includes(base)) vehiculeFilter.base = base;
                else return res.json([]);
            } else {
                vehiculeFilter.base = { $in: allowedBaseIds };
            }
        } else if (req.utilisateur.profil === 'SuperAdmin') {
            if (base) vehiculeFilter.base = base;
        } else {
            return res.json([]);
        }

        if (typeVehicule) vehiculeFilter.type = typeVehicule;

        const vehicules = await Vehicule.find(vehiculeFilter).populate('base');
        let calendarEvents = [];

        // Pour chaque véhicule, on trouve son prochain service
        for (const vehicule of vehicules) {
            const prochainService = await ServiceSchedule.findOne({
                vehicule: vehicule._id,
                statut: { $ne: 'Complété' }
            }).sort({ kilometragePrevu: 1 });

            if (!prochainService) continue;

            // Calculer la moyenne km/mois pour ce véhicule
            const servicesCompletes = await ServiceSchedule.find({
                vehicule: vehicule._id,
                statut: 'Complété'
            }).sort({ dateCompletion: 1 });

            let moyenneKmParMois = 1000; // Par défaut 1000km par mois
            if (servicesCompletes.length >= 2) {
                const premier = servicesCompletes[0];
                const dernier = servicesCompletes[servicesCompletes.length - 1];
                const kmParcourus = dernier.kilometragePrevu - premier.kilometragePrevu;
                const tempsMois = (dernier.dateCompletion - premier.dateCompletion) / (1000 * 60 * 60 * 24 * 30);
                if (tempsMois > 0) {
                    moyenneKmParMois = Math.round(kmParcourus / tempsMois);
                }
            }
            if (moyenneKmParMois <= 0 || isNaN(moyenneKmParMois)) {
                moyenneKmParMois = 1000;
            }

            const kmRestants = prochainService.kilometragePrevu - vehicule.kilometrage;
            
            // Si le service est déjà en retard ou dû, on fixe la date à aujourd'hui (ou au passé)
            let dateEstimee = new Date();
            if (kmRestants > 0 && isFinite(moyenneKmParMois)) {
                const moisEstimes = kmRestants / moyenneKmParMois;
                // Calculer les jours estimés
                const joursEstimes = moisEstimes * 30;
                if (isFinite(joursEstimes)) {
                    dateEstimee.setDate(dateEstimee.getDate() + Math.round(joursEstimes));
                }
            }

            calendarEvents.push({
                vehiculeId: vehicule._id,
                immatriculation: vehicule.immatriculation,
                marque: vehicule.marque,
                modele: vehicule.modele,
                typeService: prochainService.typeService,
                statut: prochainService.statut,
                kilometragePrevu: prochainService.kilometragePrevu,
                kmRestants: kmRestants,
                dateEstimee: dateEstimee,
                eventType: 'service'
            });
        }

        // 2. Indisponibilités (Mouvements de type maintenance)
        const vehiculeIds = vehicules.map(v => v._id);
        const mouvementsMaint = await Mouvement.find({
            vehicule: { $in: vehiculeIds },
            type: 'maintenance',
            statut: { $in: ['en attente', 'validé', 'pris en charge', 'en cours'] }
        }).populate('vehicule', 'immatriculation marque modele');

        for (const mouv of mouvementsMaint) {
            if (!mouv.vehicule) continue; // Protection contre les véhicules supprimés
            
            calendarEvents.push({
                vehiculeId: mouv.vehicule._id,
                immatriculation: mouv.vehicule.immatriculation,
                marque: mouv.vehicule.marque,
                modele: mouv.vehicule.modele,
                typeService: mouv.objectif || 'Indisponibilité',
                statut: mouv.statut,
                dateEstimee: mouv.dateDepart || new Date(),
                eventType: 'mouvement'
            });
        }

        // 3. Prédictions IA & Alertes Surconsommation
        const aiData = await predictiveService.getFleetHealthPrediction(req.selectedCountry || 'All');
        
        // Filter alerts for the vehicles in our scope
        const aiAlerts = aiData.alerts.filter(a => vehiculeIds.some(vid => vid.toString() === a.vehicleId.toString()));
        
        for (const alert of aiAlerts) {
            if (alert.type === 'HIGH_CONSUMPTION') {
                calendarEvents.push({
                    vehiculeId: alert.vehicleId,
                    immatriculation: alert.immatriculation,
                    marque: alert.marque,
                    modele: alert.modele,
                    typeService: 'Alerte Surconso',
                    statut: 'Urgent',
                    dateEstimee: alert.estimatedDate || new Date(),
                    message: alert.message,
                    eventType: 'alerte_conso'
                });
            }
        }

        // Trier par date estimée (du plus proche au plus lointain)
        calendarEvents.sort((a, b) => a.dateEstimee - b.dateEstimee);

        res.json(calendarEvents);

    } catch (error) {
        console.error('❌ [MAINTENANCE-TRACKING] Erreur calendar:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
