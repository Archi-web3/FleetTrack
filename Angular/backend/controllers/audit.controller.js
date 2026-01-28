const AuditLog = require('../models/auditLog.model');

// List Audit Logs
exports.getLogs = async (req, res) => {
    try {
        const { limit = 50, category, action, pays } = req.query;
        let filter = {};

        // 1. Filtrage explicite (SuperAdmin selector)
        if (pays) {
            if (pays === 'none') {
                // Filtre "Aucun" : logs sans pays ou pays null
                filter.$or = [{ pays: null }, { pays: { $exists: false } }];
            } else {
                filter.pays = pays;
            }
        }
        // 2. Filtrage implicite (Admin pays restreint)
        // Note: req.countryFilter est déjà populé par le middleware sur route /api/audit
        else if (req.countryFilter && req.countryFilter.pays) {
            filter.pays = req.countryFilter.pays;
        }

        if (category) filter.category = category;
        if (action) filter.action = action;

        const logs = await AuditLog.find(filter)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .populate('actor.userId', 'nom email role') // Populate actor details if needed
            .populate('pays', 'nom'); // Populate pays name

        res.json(logs);
    } catch (error) {
        console.error('❌ [AUDIT] Error fetching logs:', error);
        res.status(500).json({ error: 'Error fetching audit logs' });
    }
};

// Prune Logs (SuperAdmin only)
exports.pruneLogs = async (req, res) => {
    try {
        // Optionnel : Filtrer par date (ex: supprimer plus vieux que 30 jours)
        // Pour l'instant on fait un "Clean All" comme demandé
        await AuditLog.deleteMany({});

        console.log(`🧹 [AUDIT] Logs purgés par ${req.utilisateur.nom}`);
        res.json({ message: 'Journal d\'activité nettoyé avec succès.' });
    } catch (error) {
        console.error('❌ [AUDIT] Error pruning logs:', error);
        res.status(500).json({ error: 'Error pruning logs' });
    }
};
