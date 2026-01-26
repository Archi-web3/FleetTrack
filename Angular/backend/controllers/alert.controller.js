const Alert = require('../models/alert.model');
const Vehicule = require('../models/vehicule.model');

// Créer une nouvelle alerte
// Créer une nouvelle alerte
exports.createAlert = async (req, res) => {
    console.log('📥 [API] createAlert received body:', req.body);
    console.log('👤 [API] createAlert User:', req.user); // Vérifier si l'user est bien passé

    try {
        const { title, message, severity, targetType, targetVehicleId } = req.body;

        const alert = new Alert({
            title,
            message,
            severity,
            targetType,
            targetVehicleId,
            createdBy: req.user ? req.user.userId : null // Gestion cas user manquant
        });

        const savedAlert = await alert.save();
        console.log('✅ [API] Alert saved:', savedAlert._id);
        res.status(201).json({ message: 'Alerte créée avec succès', alert: savedAlert });
    } catch (error) {
        console.error('❌ [API] Erreur création alerte:', error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'alerte' });
    }
};

// Récupérer les alertes pour un véhicule donné (celles non lues ou récentes)
exports.getAlertsForVehicle = async (req, res) => {
    try {
        // Le véhicule ID est passé en query ou déduit du contexte (ici on attend un query param ?vehicleId=...)
        // Dans une vraie sécu, on vérifierait que le user a le droit sur ce véhicule.
        const { vehicleId } = req.query;

        if (!vehicleId) {
            return res.status(400).json({ error: 'VehicleId requis' });
        }

        // Chercher les alertes actives :
        // 1. Ciblées 'all'
        // 2. OU Ciblées sur ce vehicleId précis
        // 3. ET qui n'ont PAS encore été lues par ce véhicule
        const alerts = await Alert.find({
            active: true,
            $or: [
                { targetType: 'all' },
                { targetType: 'vehicle', targetVehicleId: vehicleId }
            ],
            'readBy.vehicleId': { $ne: vehicleId } // Exclure celles déjà lues par ce véhicule
        }).sort({ createdAt: -1 });

        res.status(200).json(alerts);
    } catch (error) {
        console.error('Erreur récupération alertes:', error);
        res.status(500).json({ error: 'Erreur récupération alertes' });
    }
};

// Marquer une alerte comme lue
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { vehicleId, user } = req.body;

        if (!vehicleId) {
            return res.status(400).json({ error: 'VehicleId requis pour marquer comme lu' });
        }

        const alert = await Alert.findById(id);
        if (!alert) {
            return res.status(404).json({ error: 'Alerte non trouvée' });
        }

        // Vérifier si déjà lu
        const alreadyRead = alert.readBy.some(r => r.vehicleId === vehicleId);
        if (!alreadyRead) {
            alert.readBy.push({ vehicleId, user: user || 'Unknown' });
            await alert.save();
        }

        res.status(200).json({ message: 'Alerte marquée comme lue' });
    } catch (error) {
        console.error('Erreur markAsRead:', error);
        res.status(500).json({ error: 'Erreur technique' });
    }
};

// Récupérer toutes les alertes (pour l'admin/historique)
exports.getAllAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ createdAt: -1 }).populate('createdBy', 'nom prenom');
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ error: 'Erreur récupération historique' });
    }
};
