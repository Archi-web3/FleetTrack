const AuditLog = require('../models/auditLog.model');

// List Audit Logs
exports.getLogs = async (req, res) => {
    try {
        const { limit = 50, category, action } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (action) filter.action = action;

        const logs = await AuditLog.find(filter)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));

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
