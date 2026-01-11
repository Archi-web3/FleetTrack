const Vehicule = require('../models/vehicule.model');
const Mouvement = require('../models/mouvement.model');

/**
 * Recalcule le kilométrage total d'un véhicule
 * Formule: Kilométrage Actuel = Kilométrage Initial + Somme(Distances des trajets validés/terminés)
 * @param {string} vehicleId - ID du véhicule
 */
async function recalculateVehicleMileage(vehicleId) {
    try {
        const vehicule = await Vehicule.findById(vehicleId);
        if (!vehicule) return;

        // 1. Récupérer tous les trajets terminés/validés
        const trips = await Mouvement.find({
            vehicule: vehicleId,
            statut: { $in: ['terminé', 'validé', 'pris en charge'] },
            startMileage: { $ne: null },
            endMileage: { $ne: null }
        });

        // 2. Calculer la distance totale parcourue
        let totalDistance = 0;
        trips.forEach(trip => {
            if (trip.endMileage > trip.startMileage) {
                totalDistance += (trip.endMileage - trip.startMileage);
            }
        });

        // 3. Mettre à jour le véhicule
        // Note: kilometrageInitial par défaut à 0 si non défini
        const initialKm = vehicule.kilometrageInitial || 0;
        const newTotalKm = initialKm + totalDistance;

        // Optimisation: ne sauvegarder que si changement
        if (vehicule.kilometrage !== newTotalKm) {
            console.log(`🔄 [SYNC MILEAGE] Vehicule ${vehicule.immatriculation}: ${vehicule.kilometrage} -> ${newTotalKm} (Initial: ${initialKm} + Trips: ${totalDistance})`);
            vehicule.kilometrage = newTotalKm;
            await vehicule.save();
        }

    } catch (err) {
        console.error('❌ [SYNC MILEAGE] Erreur calcul kilométrage:', err);
    }
}

module.exports = { recalculateVehicleMileage };
