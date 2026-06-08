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
    actif: {
        type: Boolean,
        default: true
    },
    sequenceMode: {
        type: String,
        enum: ['Predefined', 'Custom'],
        default: 'Predefined'
    },
    customSequence: {
        type: [String],
        default: ['A', 'B', 'A', 'C']
    },
    remarques: String
}, { timestamps: true });

const MaintenanceConfig = mongoose.model('MaintenanceConfig', maintenanceConfigSchema);

module.exports = MaintenanceConfig;
