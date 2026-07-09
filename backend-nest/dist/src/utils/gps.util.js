"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateGpsDistance = calculateGpsDistance;
exports.analyzeDeviations = analyzeDeviations;
function calculateGpsDistance(trace) {
    if (!trace || trace.length < 2)
        return 0;
    let totalDistance = 0;
    for (let i = 0; i < trace.length - 1; i++) {
        totalDistance += getDistanceFromLatLonInKm(trace[i].lat, trace[i].lng, trace[i + 1].lat, trace[i + 1].lng);
    }
    return parseFloat(totalDistance.toFixed(2));
}
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
function analyzeDeviations(gpsDistance, odometerDistance) {
    const deviations = [];
    const tolerancePercent = 0.15;
    const toleranceKm = 5;
    const diff = Math.abs(gpsDistance - odometerDistance);
    const allowedDiff = Math.max(odometerDistance * tolerancePercent, toleranceKm);
    if (diff > allowedDiff) {
        deviations.push({
            type: 'distance',
            value: parseFloat(diff.toFixed(2)),
            description: `Écart important: GPS=${gpsDistance}km vs Compteur=${odometerDistance}km (Diff: ${diff.toFixed(2)}km)`,
        });
    }
    return deviations;
}
//# sourceMappingURL=gps.util.js.map