const mongoose = require('mongoose');

const checklistTemplateSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Hebdomadaire', 'Service A', 'Service B', 'Service C']
    },
    typeVehicule: {
        type: String,
        default: 'Tous'
    },
    taches: [
        {
            numero: String,
            categorie: {
                type: String,
                enum: ['Détection', 'Moteur', 'Pneus', 'Électricité', 'Sécurité', 'Communication', 'Nettoyage', 'Finalisation', 'Autre']
            },
            description: {
                type: String,
                required: true
            },
            numeroTacheManuel: String, // Numéro de tâche dans le manuel MSF
            obligatoire: {
                type: Boolean,
                default: true
            }
        }
    ],
    actif: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const ChecklistTemplate = mongoose.model('ChecklistTemplate', checklistTemplateSchema);

module.exports = ChecklistTemplate;
