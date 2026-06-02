const AuditLog = require('../models/auditLog.model');

/**
 * Log an action to the database
 * @param {Object} req - The express request object (to extract user & ip)
 * @param {String} action - The action name (e.g. 'LOGIN', 'DELETE_WAIVER')
 * @param {String} category - The category (e.g. 'AUTH', 'ADMIN')
 * @param {String} target - The target of the action (e.g. 'User: John Doe')
 * @param {Object} details - Additional metadata
 */
exports.logAction = async (req, action, category, target, details = {}) => {
    try {
        const actor = req.utilisateur ? {
            userId: req.utilisateur._id,
            nom: req.utilisateur.nom,
            role: req.utilisateur.profil
        } : (details.actor || null); // Fallback if user not in req (e.g. failed login)

        // DÉTERMINATION INTELLIGENTE DU PAYS
        // 1. Priorité : Pays explicitement passé dans details (ex: création par SuperAdmin dans autre pays)
        // 2. Sinon : Pays présent dans le body de la requête (création/modif ressource)
        // 3. Sinon : Pays de l'acteur (fallback standard)
        let paysId = null;
        if (details && details.country) {
            paysId = details.country;
        } else if (req.body && req.body.pays) {
            paysId = req.body.pays;
        } else if (req.utilisateur && req.utilisateur.pays) {
            // Handle populated object or direct ID
            paysId = req.utilisateur.pays._id ? req.utilisateur.pays._id : req.utilisateur.pays;
        }

        const logEntry = new AuditLog({
            actor,
            pays: paysId,
            action,
            category,
            target,
            details,
            ip: req.ip || req.connection.remoteAddress
        });

        await logEntry.save();
        // console.log(`📝 [AUDIT] ${action} - ${target}`);
    } catch (error) {
        console.error('❌ [AUDIT] Failed to save log:', error);
    }
};
