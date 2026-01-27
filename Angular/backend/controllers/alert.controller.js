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

// Récupérer les alertes pour un véhicule donné (celles non lues ou mode Inbox)
exports.getAlertsForVehicle = async (req, res) => {
    try {
        const { vehicleId, mode } = req.query;

        if (!vehicleId) {
            return res.status(400).json({ error: 'VehicleId requis' });
        }

        const query = {
            active: true,
            $or: [
                { targetType: 'all' },
                { targetType: 'vehicle', targetVehicleId: vehicleId }
            ],
            'deletedBy.vehicleId': { $ne: vehicleId } // Exclure celles masquées par l'utilisateur
        };

        // Si ce n'est PAS le mode inbox, on filtre aussi celles déjà lues (comportement popup)
        if (mode !== 'inbox') {
            query['readBy.vehicleId'] = { $ne: vehicleId };
        }

        console.log(`🔍 [API] getAlertsForVehicle vehicle=${vehicleId} mode=${mode}`);
        console.log('🔍 [API] Query:', JSON.stringify(query));

        const alerts = await Alert.find(query).sort({ createdAt: -1 });
        console.log(`✅ [API] Found ${alerts.length} alerts`);

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

// Masquer une alerte pour un véhicule (Suppression Inbox)
exports.hideAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const { vehicleId } = req.body;

        if (!vehicleId) return res.status(400).json({ error: 'VehicleId requis' });

        await Alert.findByIdAndUpdate(id, {
            $push: { deletedBy: { vehicleId } }
        });

        res.status(200).json({ message: 'Alerte masquée' });
    } catch (error) {
        console.error('Erreur hideAlert:', error);
        res.status(500).json({ error: 'Erreur masquage alerte' });
    }
};

// Suppression physique (Admin)
exports.deleteAlert = async (req, res) => {
    try {
        await Alert.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Alerte supprimée définitivement' });
    } catch (error) {
        console.error('Erreur deleteAlert:', error);
        res.status(500).json({ error: 'Erreur suppression alerte' });
    }
};
