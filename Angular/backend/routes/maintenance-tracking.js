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
        let allowedBases = [];
        if (req.selectedCountry) {
            // Si un pays est sélectionné (Admin Pays ou SuperAdmin avec header), on filtre les bases de ce pays
            const basesInCountry = await Base.find({ pays: req.selectedCountry }).select('_id');
            allowedBases = basesInCountry.map(b => b._id.toString());

            if (base) {
                // Si la base demandée fait partie des bases autorisées, on l'utilise
                if (allowedBases.includes(base)) {
                    vehiculeFilter.base = base;
                } else {
                    // Sinon, on renvoie vide (tentative d'accès non autorisé ou incohérence)
                    return res.json([]);
                }
            } else {
                // Si pas de base spécifique demandée, on prend toutes les bases du pays
                vehiculeFilter.base = { $in: allowedBases };
            }
        } else {
            // SuperAdmin sans filtre pays : peut tout voir
            if (base) vehiculeFilter.base = base;
        }

        if (typeVehicule) vehiculeFilter.type = typeVehicule;

        const vehicules = await Vehicule.find(vehiculeFilter)
            .populate('base')
            .sort({ immatriculation: 1 });

        // Pour chaque véhicule, récupérer son prochain service et dernier service complété
        const overview = await Promise.all(vehicules.map(async (vehicule) => {
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
            if (prochainService) {
                ecartKm = prochainService.kilometragePrevu - vehicule.kilometrage;
                if (ecartKm < -2000) statusCode = 'critique';
                else if (ecartKm < 0) statusCode = 'retard';
                else if (ecartKm < 500) statusCode = 'proche';
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
                } : null,
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
