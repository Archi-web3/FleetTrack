const mongoose = require('mongoose');

const weeklyChecklistSchema = new mongoose.Schema({
    vehicule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicule',
        required: true
    },
    semaine: {
        type: Number,
        required: true,
        min: 1,
        max: 53
    },
    annee: {
        type: Number,
        required: true
    },
    chauffeur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    taches: [
        {
            numero: String,
            categorie: String,
            description: String,
            numeroTacheManuel: String,
            validee: {
                type: Boolean,
                default: false
            },
            dateValidation: Date,
            commentaire: String
        }
    ],
    completee: {
        type: Boolean,
        default: false
    },
    tauxCompletion: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    dateCreation: {
        type: Date,
        default: Date.now
    },
    dateCompletion: Date
}, { timestamps: true });

// Index pour recherche rapide
weeklyChecklistSchema.index({ vehicule: 1, semaine: 1, annee: 1 });
weeklyChecklistSchema.index({ chauffeur: 1, completee: 1 });

const WeeklyChecklist = mongoose.model('WeeklyChecklist', weeklyChecklistSchema);

module.exports = WeeklyChecklist;
