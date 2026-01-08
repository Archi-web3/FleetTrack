const mongoose = require('mongoose');

const maintenanceConfigSchema = new mongoose.Schema({
    typeVehicule: {
        type: String,
        required: true
    },
    conditionsRoute: {
        type: String,
        required: true,
        enum: ['100% piste difficile', 'Mixte route + piste', 'Route goudronnée', 'Route mixte/urbaine']
    },
    intervalleService: {
        type: Number,
        required: true,
        min: 0
    }, // en km
    intervalleVidange: {
        bonneQualite: { type: Number, required: true, min: 0 },
        mauvaiseQualite: { type: Number, required: true, min: 0 }
    },
    qualiteCarburant: {
        type: String,
        enum: ['Bonne', 'Mauvaise', 'Inconnue'],
        default: 'Inconnue'
    },
    actif: {
        type: Boolean,
        default: true
    },
    remarques: String
}, { timestamps: true });

const MaintenanceConfig = mongoose.model('MaintenanceConfig', maintenanceConfigSchema);

module.exports = MaintenanceConfig;
