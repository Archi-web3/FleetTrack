const mongoose = require('mongoose');

const environmentActionSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    base: { type: String, required: true }, // Nom de la base (ex: 'Goma')
    quarter: { type: String, enum: ['T1', 'T2', 'T3', 'T4'], required: true },

    category: {
        type: String,
        required: true,
        enum: [
            'Pooling',
            'Planification',
            'Choix Véhicule',
            'Eco-conduite',
            'Maintenance',
            'Substitution',
            'Géolocalisation',
            'Stock Carburant',
            'Générateurs',
            'Politique Transport',
            'Autre'
        ]
    },

    action: { type: String, required: true }, // Description de l'action
    status: {
        type: String,
        enum: ['Non commencé', 'En cours', 'Fait', 'Reporté'],
        default: 'Non commencé'
    },

    impact_estimated: { type: String }, // Ex: "Gain 2% conso"
    comments: { type: String }

}, { timestamps: true });

module.exports = mongoose.model('EnvironmentAction', environmentActionSchema);
