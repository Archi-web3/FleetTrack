/**
 * Calcule la distance totale d'un tracé GPS en kilomètres
 * @param {Array} trace - Array of {lat, lng} objects
 * @returns {number} Distance in km
 */
function calculateGpsDistance(trace) {
    if (!trace || trace.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < trace.length - 1; i++) {
        totalDistance += getDistanceFromLatLonInKm(
            trace[i].lat, trace[i].lng,
            trace[i + 1].lat, trace[i + 1].lng
        );
    }
    return parseFloat(totalDistance.toFixed(2));
}

/**
 * Formule de Haversine pour la distance entre deux points
 */
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la terre en km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance en km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Analyse les écarts entre la distance GPS et la distance Compteur
 * @param {number} gpsDistance 
 * @param {number} odometerDistance 
 * @returns {Array} List of deviations found
 */
function analyzeDeviations(gpsDistance, odometerDistance) {
    const deviations = [];

    // Tolérance de 15% ou 5km (le plus grand des deux)
    // On permet une marge car le GPS n'est pas parfait et le compteur peut tricher un peu (pneus, etc)
    const tolerancePercent = 0.15;
    const toleranceKm = 5;

    const diff = Math.abs(gpsDistance - odometerDistance);
    const allowedDiff = Math.max(odometerDistance * tolerancePercent, toleranceKm);

    if (diff > allowedDiff) {
        deviations.push({
            type: 'distance',
            value: parseFloat(diff.toFixed(2)),
            description: `Écart important: GPS=${gpsDistance}km vs Compteur=${odometerDistance}km (Diff: ${diff.toFixed(2)}km)`
        });
    }

    // TODO: Ajouter analyse vitesse max ici si on envoie la vitesse dans le trace

    return deviations;
}

module.exports = {
    calculateGpsDistance,
    analyzeDeviations
};
