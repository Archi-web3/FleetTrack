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
