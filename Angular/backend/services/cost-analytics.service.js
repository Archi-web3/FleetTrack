const Vehicle = require('../models/vehicule.model');
const Fuel = require('../models/fuel.model');
const Maintenance = require('../models/maintenance.model');
const Incident = require('../models/incident.model');
const mongoose = require('mongoose');

class CostAnalyticsService {

    /**
     * Calcule le TCO (Total Cost of Ownership) pour la flotte ou un véhicule spécifique
     * @param {Object} filters - Filtres (startDate, endDate, vehicleId, country)
     */
    async calculateTCO(filters = {}) {
        const { startDate, endDate, vehicleId, country } = filters;

        const dateQuery = {};
        if (startDate || endDate) {
            dateQuery.date = {};
            if (startDate) dateQuery.date.$gte = new Date(startDate);
            if (endDate) dateQuery.date.$lte = new Date(endDate);
        }

        const matchStage = {};
        if (vehicleId) matchStage.vehicule = new mongoose.Types.ObjectId(vehicleId);
        // Si filtre pays, il faudrait d'abord filtrer les véhicules, mais pour simplifier on suppose que l'appelant gère ça ou on le fera plus tard

        // 1. Coûts Carburant
        const fuelCosts = await Fuel.aggregate([
            { $match: { ...dateQuery, ...matchStage } },
            { $group: { _id: null, total: { $sum: '$price' }, totalLitres: { $sum: '$quantity' } } }
        ]);

        // 2. Coûts Maintenance
        const maintCosts = await Maintenance.aggregate([
            { $match: { ...dateQuery, ...matchStage } },
            { $group: { _id: null, total: { $sum: '$cost' } } }
        ]);

        // 3. Coûts Incidents (Réparations accidentelles, etc.)
        const incidentCosts = await Incident.aggregate([
            { $match: { ...dateQuery, ...matchStage, cost: { $exists: true } } },
            { $group: { _id: null, total: { $sum: '$cost' } } }
        ]);

        // 4. Coûts Fixes (Amortissement + Assurance + Location)
        // C'est plus complexe car c'est proratisé. On va faire une estimation simple pour le MVP.
        // On récupère les véhicules concernés
        const vehicleQuery = {};
        if (vehicleId) vehicleQuery._id = vehicleId;
        if (country) vehicleQuery.pays = country;

        const vehicles = await Vehicle.find(vehicleQuery);
        let fixedCostsTotal = 0;

        // Durée en mois pour le calcul (par défaut 1 mois si pas de dates)
        let durationMonths = 1;
        if (startDate && endDate) {
            const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
            durationMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
        }

        for (const v of vehicles) {
            // Amortissement (Achat / Période depreciation)
            if (v.typePropriete === 'ACF' && v.purchaseValue && v.depreciationMonths) {
                const monthlyDepreciation = v.purchaseValue / v.depreciationMonths;
                fixedCostsTotal += monthlyDepreciation * durationMonths;
            }
            // Assurance
            if (v.insuranceCost) {
                fixedCostsTotal += (v.insuranceCost / 12) * durationMonths;
            }
            // Location
            if (v.typePropriete === 'Location' && v.rentalCost) {
                fixedCostsTotal += v.rentalCost * durationMonths;
            }
        }

        const totalFuel = fuelCosts[0]?.total || 0;
        const totalMaint = maintCosts[0]?.total || 0;
        const totalIncidents = incidentCosts[0]?.total || 0;

        return {
            totalCost: totalFuel + totalMaint + totalIncidents + fixedCostsTotal,
            breakdown: {
                fuel: totalFuel,
                maintenance: totalMaint,
                incidents: totalIncidents,
                fixed: fixedCostsTotal
            },
            vehicleCount: vehicles.length
        };
    }

    /**
     * Prédiction des coûts pour le mois prochain
     */
    async predictNextMonthCosts(country) {
        // 1. Basé sur la moyenne des 3 derniers mois
        const today = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);

        const recentStats = await this.calculateTCO({
            startDate: threeMonthsAgo,
            endDate: today,
            country
        });

        // Moyenne mensuelle historique
        const avgMonthlyCost = recentStats.totalCost / 3;

        // 2. Ajustement avec les maintenances prévues (Maintenance > 90%)
        // On peut récupérer les prochaines maintenances via le service prédictif existant ou le refaire ici
        // Pour l'instant, facteur de risque simple : +10% de marge de sécu

        return {
            predictedTotal: Math.round(avgMonthlyCost * 1.1), // Marque de sécurité heuristique
            confidence: 'Medium',
            trend: 'Stable'
        };
    }

    /**
     * Analyse de fiabilité par Modèle (MTBF - Mean Time Between Failures)
     * Ou plus simplement : Coût moyen par km par modèle
     */
    async analyzeFleetReliability(country) {
        // On aggrège tout : coûts maintenance + incidents par modèle
        const userQuery = country && country !== 'All' ? { pays: country } : {};

        // Récupérer tous les véhicules
        const vehicles = await Vehicle.find(userQuery).select('marque modele kilometrage _id');

        const modelStats = {};

        for (const v of vehicles) {
            const modelKey = `${v.marque} ${v.modele}`;
            if (!modelStats[modelKey]) {
                modelStats[modelKey] = { totalKm: 0, totalCost: 0, vehicles: 0, incidents: 0 };
            }

            modelStats[modelKey].vehicles += 1;
            modelStats[modelKey].totalKm += (v.kilometrage || 0);

            // Coût maintenance spécifique à ce véhicule
            const mCosts = await Maintenance.aggregate([
                { $match: { vehicule: v._id } },
                { $group: { _id: null, total: { $sum: '$cost' } } }
            ]);

            // Nombre d'incidents
            const iCount = await Incident.countDocuments({ vehicule: v._id, type: 'Panne' });

            modelStats[modelKey].totalCost += (mCosts[0]?.total || 0);
            modelStats[modelKey].incidents += iCount;
        }

        // Transformer en tableau et calculer les scores
        const ranking = Object.keys(modelStats).map(key => {
            const stats = modelStats[key];
            const costPerKm = stats.totalKm > 0 ? (stats.totalCost / stats.totalKm) : 0;
            const reliabilityScore = 100 - (stats.incidents * 10); // Simple hack: -10 points par panne

            return {
                model: key,
                costPerKm: parseFloat(costPerKm.toFixed(3)),
                reliabilityScore: Math.max(0, reliabilityScore),
                vehicleCount: stats.vehicles,
                totalIncidents: stats.incidents
            };
        });

        return ranking.sort((a, b) => b.reliabilityScore - a.reliabilityScore);
    }
}

module.exports = new CostAnalyticsService();
