const mongoose = require('mongoose');
const Vehicle = require('../models/vehicule.model');
const ServiceSchedule = require('../models/service-schedule.model');
const Fuel = require('../models/fuel.model');

class PredictiveMaintenanceService {
    async getFleetHealthPrediction(userCountry) {
        const matchStage = { $match: { statut: { $nin: ['Vendu', 'Rebut', 'Inactif'] } } };

        if (userCountry && userCountry !== 'All') {
            // Optional filter
        }

        const vehicles = await Vehicle.find(matchStage.$match);
        const predictions = [];
        const alerts = [];

        for (const vehicle of vehicles) {
            let healthScore = 100;
            
            // 1. SERVICES PLANIFIES (Vraie moyenne)
            const prochainService = await ServiceSchedule.findOne({
                vehicule: vehicle._id,
                statut: { $ne: 'Complété' }
            }).sort({ kilometragePrevu: 1 });

            let nextServiceKm = vehicle.kilometrage + 5000;
            let estimatedDate = new Date();
            estimatedDate.setDate(estimatedDate.getDate() + 90); // Default 3 months
            let remainingKm = 5000;

            if (prochainService) {
                // Find average km per month
                const servicesCompletes = await ServiceSchedule.find({
                    vehicule: vehicle._id,
                    statut: 'Complété'
                }).sort({ dateCompletion: 1 });

                let moyenneKmParMois = 1000; // Default
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

                nextServiceKm = prochainService.kilometragePrevu;
                remainingKm = nextServiceKm - (vehicle.kilometrage || 0);

                if (remainingKm > 0) {
                    const moisEstimes = remainingKm / moyenneKmParMois;
                    estimatedDate = new Date();
                    if (isFinite(moisEstimes)) {
                        estimatedDate.setDate(estimatedDate.getDate() + Math.round(moisEstimes * 30));
                    }
                } else {
                    estimatedDate = new Date();
                }

                // Health Score based on real schedule
                if (remainingKm < 1000) healthScore -= 20;
                if (remainingKm < 500) healthScore -= 30;
                if (remainingKm < 0) healthScore = 0;

                if (remainingKm < 1000) {
                    alerts.push({
                        vehicleId: vehicle._id,
                        immatriculation: vehicle.immatriculation,
                        marque: vehicle.marque,
                        modele: vehicle.modele,
                        type: 'SERVICE_SOON',
                        message: `Révision dans ${Math.max(0, remainingKm)} km`,
                        severity: remainingKm < 500 ? 'high' : 'medium',
                        remainingKm: remainingKm,
                        estimatedDate: estimatedDate
                    });
                }
            }

            // 2. SURCONSOMMATION
            let overConsumptionAlert = false;
            let consumptionMsg = "";
            let avgRealConsumption = null;

            if (vehicle.consommation && vehicle.consommation.valeur) {
                const theoreticalConso = vehicle.consommation.valeur;
                
                // Get last 5 full fuels to compute average real consumption
                const fuels = await Fuel.find({ vehicule: vehicle._id, fullTank: true })
                    .sort({ date: -1 })
                    .limit(6);
                
                if (fuels.length >= 2) {
                    let totalLiters = 0;
                    let totalKm = fuels[0].mileage - fuels[fuels.length - 1].mileage;
                    
                    // Don't count the oldest fuel's liters, as they were used for the oldest distance which we don't have
                    for (let i = 0; i < fuels.length - 1; i++) {
                        totalLiters += fuels[i].quantity;
                    }

                    if (totalKm > 0) {
                        avgRealConsumption = (totalLiters / totalKm) * 100;
                        // If real is 20% higher than theoretical, alert!
                        if (avgRealConsumption > theoreticalConso * 1.2) {
                            overConsumptionAlert = true;
                            consumptionMsg = `Surconsommation détectée: Réel ${avgRealConsumption.toFixed(1)} L/100km vs Théorique ${theoreticalConso} L/100km`;
                            healthScore -= 20;
                        }
                    }
                }
            }

            if (overConsumptionAlert) {
                alerts.push({
                    vehicleId: vehicle._id,
                    immatriculation: vehicle.immatriculation,
                    marque: vehicle.marque,
                    modele: vehicle.modele,
                    type: 'HIGH_CONSUMPTION',
                    message: consumptionMsg,
                    severity: 'high',
                    estimatedDate: new Date()
                });
            }

            predictions.push({
                vehicleId: vehicle._id,
                immatriculation: vehicle.immatriculation,
                currentKm: vehicle.kilometrage || 0,
                nextServiceKm,
                estimatedDate: estimatedDate,
                healthScore: Math.max(0, healthScore),
                avgRealConsumption,
                theoreticalConsumption: vehicle.consommation ? vehicle.consommation.valeur : null
            });
        }

        const globalHealth = predictions.length > 0
            ? Math.round(predictions.reduce((acc, p) => acc + p.healthScore, 0) / predictions.length)
            : 100;

        return {
            globalHealth,
            totalVehicles: vehicles.length,
            alertsCount: alerts.length,
            alerts: alerts.sort((a, b) => (a.severity === 'high' ? -1 : 1)),
            predictions
        };
    }
}

module.exports = new PredictiveMaintenanceService();
