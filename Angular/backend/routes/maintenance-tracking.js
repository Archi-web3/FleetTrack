const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Vehicule = require('../models/vehicule.model');
const ServiceSchedule = require('../models/service-schedule.model');
const MaintenanceConfig = require('../models/maintenance-config.model');

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
            // Si jamais eu de service (véhicule neuf ?), baser sur km initial ou 0
            else {
                const prochainKmTheorique = (vehicule.kilometrageInitial || 0) + intervalle;
                ecartKm = prochainKmTheorique - vehicule.kilometrage;
            }

            if (ecartKm !== null) {
                if (ecartKm < 0) statusCode = 'retard'; // Dépassé
                if (ecartKm < -2000) statusCode = 'critique'; // Très dépassé
                else if (ecartKm < 500 && ecartKm >= 0) statusCode = 'proche'; // Bientôt
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
                    type: prochainService.typeService,
                    kmPrevu: prochainService.kilometragePrevu,
                    statut: prochainService.statut
                } : {
                    // Si pas de service planifié, on renvoie l'estimation
                    type: 'Estimé',
                    kmPrevu: (vehicule.kilometrage + (ecartKm || 0)),
                    statut: 'Planifié (Auto)'
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

module.exports = router;
