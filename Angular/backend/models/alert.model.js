const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'danger'],
        default: 'info'
    },
    targetType: {
        type: String,
        enum: ['all', 'vehicle'],
        required: true
    },
    targetVehicleId: {
        type: String, // Plaque ou ID véhicule si targetType === 'vehicle'
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur'
    },
    active: {
        type: Boolean,
        default: true
    },
    // Liste des lectures confirmées (pour tracking)
    readBy: [{
        vehicleId: String,
        readAt: { type: Date, default: Date.now },
        user: String
    }],
    // Liste des véhicules pour lesquels l'alerte est masquée ("supprimée" par l'utilisateur)
    deletedBy: [{
        vehicleId: String,
        deletedAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d' // Auto-suppression après 7 jours pour ne pas encombrer
    }
});

module.exports = mongoose.model('Alert', alertSchema);
