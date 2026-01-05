const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    date: { type: Date, required: true, default: Date.now },
    vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' }, // Peut être null si incident hors véhicule
    chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Chauffeur', required: true },
    mouvement: { type: mongoose.Schema.Types.ObjectId, ref: 'Mouvement' }, // Lien optionnel vers un mouvement en cours

    type: { type: String, enum: ['Panne', 'Accident', 'Retard', 'Sécurité', 'Autre'], required: true },
    severity: { type: String, enum: ['Faible', 'Moyenne', 'Haute', 'Critique'], default: 'Moyenne' },

    description: { type: String, required: true },
    location: { // Coordonnées GPS de l'incident
        lat: Number,
        lng: Number,
        address: String
    },

    // MODIFIÉ: Photos avec métadonnées Cloudinary
    photos: [{
        url: { type: String, required: true },
        publicId: String,
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }
    }],

    status: { type: String, enum: ['Signalé', 'En cours de traitement', 'Résolu', 'Clôturé'], default: 'Signalé' },
    resolutionNotes: String,
    cost: { type: Number } // Coût lié à l'incident
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);
