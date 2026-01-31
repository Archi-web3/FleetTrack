const Vehicle = require('../models/vehicule.model');
// const Trip = require('../models/trip-logbook.model'); // Pas utilisé pour l'instant (MVP)

/**
 * Service de Maintenance Prédictive (Heuristique)
 */
class PredictiveMaintenanceService {

    /**
     * Analyse la flotte et retourne les prédictions
     * @param {string} userCountry - Pays de l'utilisateur (filtre)
     */
    async getFleetHealthPrediction(userCountry) {
        // Filtrer les véhicules actifs
        const mongoose = require('mongoose');

        // Filtrer les véhicules actifs (Exclure Vendu, Rebut)
        const matchStage = { $match: { statut: { $nin: ['Vendu', 'Rebut', 'Inactif'] } } };

        if (userCountry && userCountry !== 'All') {
            // Vérifier si c'est un ObjectId valide
            /*
            // DISABLE FILTER FOR DEBUGGING - Production seems to have mismatch
            if (mongoose.Types.ObjectId.isValid(userCountry)) {
                 matchStage.$match.pays = userCountry;
            }
            */
        }

        const vehicles = await Vehicle.find(matchStage.$match);

        const predictions = [];
        const alerts = [];

        for (const vehicle of vehicles) {
            // 1. Calcul du kilométrage moyen journalier (sur 30 jours)
            // Note: Pour le MVP, on simule une moyenne si pas assez de données
            // Dans une version complète, on ferait une aggrégation sur Trip
            const avgDailyKm = 45; // Valeur par défaut heuristique (simulée)

            // 2. Prochaine maintenance (Révision tous les 5000 km)
            const serviceInterval = 5000;
            const currentKm = vehicle.kilometrage || 0;
            const lastServiceKm = vehicle.dernierServiceKm || (currentKm - (currentKm % serviceInterval)); // Estimation si pas d'info

            const nextServiceKm = lastServiceKm + serviceInterval;
            const remainingKm = nextServiceKm - currentKm;
            const daysUntilService = Math.floor(remainingKm / avgDailyKm);

            // 3. Score de Santé (0-100)
            // Plus on est proche de la révision, plus le score baisse
            let healthScore = 100;
            if (remainingKm < 1000) healthScore -= 20;
            if (remainingKm < 500) healthScore -= 30;
            if (remainingKm < 0) healthScore = 0; // Dépassement !

            // 4. Alertes de consommation (Heuristique simple)
            // Si le véhicule est vieux (> 150k km), on suppose une surconsommation potentielle
            const excessiveConsumptionRisk = currentKm > 150000;

            if (remainingKm < 1000 || excessiveConsumptionRisk) {
                alerts.push({
                    vehicleId: vehicle._id,
                    immatriculation: vehicle.immatriculation,
                    marque: vehicle.marque,
                    modele: vehicle.modele,
                    type: remainingKm < 1000 ? 'SERVICE_SOON' : 'HIGH_CONSUMPTION',
                    message: remainingKm < 1000
                        ? `Révision dans ${Math.max(0, remainingKm)} km (${daysUntilService} jours)`
                        : `Risque de surconsommation (Kilométrage élevé)`,
                    severity: remainingKm < 500 ? 'high' : 'medium',
                    remainingKm: remainingKm,
                    daysRemaining: daysUntilService
                });
            }

            predictions.push({
                vehicleId: vehicle._id,
                immatriculation: vehicle.immatriculation,
                currentKm,
                nextServiceKm,
                estimatedDate: new Date(Date.now() + daysUntilService * 24 * 60 * 60 * 1000),
                healthScore
            });
        }

        // Calcul du score global de la flotte
        const globalHealth = predictions.length > 0
            ? Math.round(predictions.reduce((acc, p) => acc + p.healthScore, 0) / predictions.length)
            : 100;

        return {
            globalHealth,
            totalVehicles: vehicles.length,
            alertsCount: alerts.length,
            alerts: alerts.sort((a, b) => (a.severity === 'high' ? -1 : 1)), // Priorité aux urgences
            predictions
        };
    }
}

module.exports = new PredictiveMaintenanceService();
