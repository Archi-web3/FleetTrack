const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    actor: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
        nom: String,
        role: String
    },
    pays: { type: mongoose.Schema.Types.ObjectId, ref: 'Pays' }, // NOUVEAU: Pays concerné
    action: { type: String, required: true }, // LOGIN, CREATE, DELETE, UPDATE
    category: { type: String, required: true }, // AUTH, ADMIN, SECURITY, WAIVER, DATA
    target: { type: String }, // 'Waiver #123' or 'User: Jean'
    details: { type: Object }, // Metadata (IP, userAgent, changes...)
    ip: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
