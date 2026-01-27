const webPush = require('web-push');
const Vehicule = require('../models/vehicule.model');

// Configuration unique au démarrage
webPush.setVapidDetails(
    process.env.VAPID_MAILTO,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Renvoyer la clé publique au client
exports.getVapidKey = (req, res) => {
    res.status(200).json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};

// Enregistrer l'abonnement pour un véhicule
exports.subscribe = async (req, res) => {
    try {
        const { vehicleId, subscription } = req.body;

        if (!vehicleId || !subscription) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        console.log(`🔔 [PUSH] Nouvel abonnement pour véhicule ${vehicleId}`);

        await Vehicule.findByIdAndUpdate(vehicleId, {
            pushSubscription: subscription
        });

        res.status(201).json({ message: 'Abonnement Push enregistré' });
    } catch (error) {
        console.error('❌ [PUSH] Erreur lors de l\'abonnement:', error);
        res.status(500).json({ error: 'Erreur technique' });
    }
};

// Fonction utilitaire interne pour envoyer une notification (appelée par d'autres controllers)
exports.sendNotificationToVehicle = async (vehicleId, payload) => {
    try {
        const vehicle = await Vehicule.findById(vehicleId);
        if (!vehicle || !vehicle.pushSubscription || !vehicle.pushSubscription.endpoint) {
            console.log(`⚠️ [PUSH] Pas d'abonnement pour véhicule ${vehicleId}`);
            return false;
        }

        await webPush.sendNotification(vehicle.pushSubscription, JSON.stringify(payload));
        console.log(`✅ [PUSH] Notification envoyée à ${vehicle.immatriculation}`);
        return true;
    } catch (error) {
        console.error(`❌ [PUSH] Echec envoi notif à ${vehicleId}:`, error.message);
        // Si 410 (Gone), on pourrait supprimer l'abo, mais on garde simple pour l'instant
        return false;
    }
};
