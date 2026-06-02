const mongoose = require('mongoose');

const WaiverSchema = new mongoose.Schema({
    visitorName: {
        type: String,
        required: true
    },
    signatureUrl: {
        type: String,
        required: true
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicule',
        required: true
    },
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mouvement'
    },
    signedAt: {
        type: Date,
        default: Date.now
    },
    legalTextVersion: {
        type: String,
        default: 'v1.0' // To track which text they signed
    }
});

module.exports = mongoose.model('Waiver', WaiverSchema);
