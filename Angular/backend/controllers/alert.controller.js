const Alert = require('../models/alert.model'); // Restauration import manquant
const pushController = require('./push.controller'); // NOUVEAU
const Vehicule = require('../models/vehicule.model');

// Créer une nouvelle alerte
exports.createAlert = async (req, res) => {
    console.log('📥 [API] createAlert received body:', req.body);
    console.log('👤 [API] createAlert User:', req.user);

    try {
        const { title, message, severity, targetType, targetVehicleId } = req.body;

        const alert = new Alert({
            title,
            message,
            severity,
            targetType,
            targetVehicleId,
            createdBy: req.user ? req.user.userId : null
        });

        const savedAlert = await alert.save();
        console.log('✅ [API] Alert saved:', savedAlert._id);

        // --- ENVOI PUSH NOTIFICATION (ASYNC) ---
        // On ne bloque pas la réponse HTTP pour ça
        (async () => {
            try {
                const payload = {
                    notification: {
                        title: `📢 ${title}`,
                        body: message,
                        icon: 'assets/icons/icon-72x72.png',
                        vibrate: [100, 50, 100],
                        data: {
                            url: '/', // Ouvre l'app
                            alertId: savedAlert._id
                        }
                    }
                };

                if (targetType === 'vehicle' && targetVehicleId) {
                    await pushController.sendNotificationToVehicle(targetVehicleId, payload);
                } else if (targetType === 'all') {
                    // Trouver tous les véhicules actifs avec un abonnement push
                    const vehicles = await Vehicule.find({
                        active: { $ne: false },
                        'pushSubscription.endpoint': { $exists: true }
                    });

                    console.log(`🔔 [PUSH] Envoi groupé à ${vehicles.length} véhicules...`);
                    for (const v of vehicles) {
                        await pushController.sendNotificationToVehicle(v._id, payload);
                    }
                }
            } catch (pushError) {
                console.error('❌ [PUSH] Erreur envoi global:', pushError);
            }
        })();
        // ---------------------------------------

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

        // 1. Récupérer TOUTES les alertes actives pour ce véhicule
        const rawQuery = {
            active: true,
            $or: [
                { targetType: 'all' },
                { targetType: 'vehicle', targetVehicleId: vehicleId }
            ]
        };

        const allPotentialAlerts = await Alert.find(rawQuery)
            .sort({ createdAt: -1 })
            .limit(100); // Optimisation: ne pas charger tout l'historique inutilement

        console.log(`🔍 [API] Raw Candidates: ${allPotentialAlerts.length}`);

        // 2. Filtrage manuel en Javascript
        const filteredAlerts = allPotentialAlerts.filter(alert => {
            // A. Est-ce que l'utilisateur a supprimé cette alerte de son inbox ?
            const isDeleted = alert.deletedBy && alert.deletedBy.some(d => d.vehicleId.toString() === vehicleId);
            if (isDeleted) return false;

            // B. Si on n'est PAS en mode inbox, on masque les alertes déjà lues
            if (mode !== 'inbox') {
                const isRead = alert.readBy && alert.readBy.some(r => r.vehicleId.toString() === vehicleId);
                if (isRead) return false;
            }

            return true;
        });

        console.log(`✅ [API] Returning ${filteredAlerts.length} alerts (Mode: ${mode})`);

        res.status(200).json(filteredAlerts);
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
