const mongoose = require('mongoose');

const projetSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    pays: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pays'
    },
    actif: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

module.exports = mongoose.model('Projet', projetSchema);
