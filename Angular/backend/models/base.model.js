const mongoose = require('mongoose');

const baseSchema = new mongoose.Schema({
    nom: { type: String, required: true }, // ex: 'Bureau Goma', 'Base Kinshasa'
    code: { type: String }, // Code interne optionnel

    // Relation parente
    pays: { type: mongoose.Schema.Types.ObjectId, ref: 'Pays', required: true },

    // Responsable de la base (Chef de base / Logistique)
    chef_de_base: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },

    // Coordonnées géographiques par défaut de la base (pour centrer les cartes)
    localisation: {
        lat: Number,
        lng: Number
    }
}, { timestamps: true });

const Base = mongoose.model('Base', baseSchema);

module.exports = Base;
