const mongoose = require('mongoose');

const lieuSchema = new mongoose.Schema({
  nom: { type: String, required: true }, // Nom du lieu (non unique car peut exister dans différents pays/bases)
  adresse: { type: String, required: true },
  coordonnees: { // Stockage des coordonnées géographiques
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  estSensible: { type: Boolean, default: false }, // Pour le workflow de sécurité
  niveauSecurite: { type: Number, enum: [1, 2, 3, 4, 5], default: 1 }, // 1: Vert, 2: Jaune, 3: Orange, 4: Rouge, 5: Noir
  pays: { type: mongoose.Schema.Types.ObjectId, ref: 'Pays' }, // Pays du lieu
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' }, // Base du lieu
  // Vous pouvez ajouter d'autres champs si nécessaire (description, photos, etc.)
});

const Lieu = mongoose.model('Lieu', lieuSchema);

module.exports = Lieu;
