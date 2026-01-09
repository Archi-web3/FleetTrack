const mongoose = require('mongoose');

const serviceScheduleSchema = new mongoose.Schema({
    vehicule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicule',
        required: true
    },
    typeService: {
        type: String,
        required: true
    },
    kilometragePrevu: {
        type: Number,
        required: true,
        min: 0
    },
    kilometrageActuel: {
        type: Number,
        default: 0,
        min: 0
    },
    statut: {
        type: String,
        enum: ['À venir', 'Dû', 'En retard', 'Complété'],
        default: 'À venir'
    },
    dateAlerte: Date,
    taches: [
        {
            description: String,
            numeroTacheManuel: String,
            validee: {
                type: Boolean,
                default: false
            },
            dateValidation: Date,
            validePar: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Utilisateur'
            }, // Superviseur
            commentaire: String
        }
    ],
    signature: {
        superviseur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Utilisateur'
        },
        date: Date,
        signatureData: String // Base64 de la signature électronique
    },
    dateCreation: {
        type: Date,
        default: Date.now
    },
    dateCompletion: Date,
    prochainService: {
        type: {
            type: String
        },
        kilometrage: Number
    }
}, { timestamps: true });

// Index pour recherche rapide
serviceScheduleSchema.index({ vehicule: 1, statut: 1 });
serviceScheduleSchema.index({ kilometragePrevu: 1 });

const ServiceSchedule = mongoose.model('ServiceSchedule', serviceScheduleSchema);

module.exports = ServiceSchedule;
