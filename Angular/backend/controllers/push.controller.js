const webPush = require('web-push');
const Vehicule = require('../models/vehicule.model');

// Configuration unique au démarrage
// Configuration unique au démarrage
// Configuration unique au démarrage
const publicVapidKey = process.env.VAPID_PUBLIC_KEY || 'BJxzSPkMqZI8jwa2YPb6ubznDd4SYxaK88u3c5qdbYkM8b5KIZaRtO2tlgDuVmJa7750MyEzwkBCmavjez6SW80';
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || '2RezBMEx2LOc0WTMe-PBpj7nVMw772-ybd4McTPQzTw';

webPush.setVapidDetails(
    process.env.VAPID_MAILTO || 'mailto:admin@fleettrack.com',
    publicVapidKey,
    privateVapidKey
);

// Renvoyer la clé publique au client
exports.getVapidKey = (req, res) => {
    res.status(200).json({ publicKey: publicVapidKey });
};

// Enregistrer l'abonnement pour un véhicule
exports.subscribe = async (req, res) => {
    try {
        const { vehicleId, subscription } = req.body;

        if (!vehicleId || !subscription) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        console.log(`🔔 [PUSH] Nouvel abonnement pour véhicule ${vehicleId}`);
        console.log('📦 [PUSH] Payload Subscription:', JSON.stringify(subscription, null, 2));

        const result = await Vehicule.findByIdAndUpdate(vehicleId, {
            pushSubscription: subscription
        }, { new: true }); // new: true pour retourner le doc mis à jour (vérif)

        if (!result) {
            console.error('❌ [PUSH] Véhicule introuvable pour maj abo');
        } else {
            console.log('💾 [PUSH] Abonnement sauvegardé en DB. Endpoint:', result.pushSubscription?.endpoint?.substring(0, 50) + '...');
        }

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
