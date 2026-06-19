const mongoose = require('mongoose');

const generateurSchema = new mongoose.Schema({
  // Identification
  marque: { type: String, required: true },
  modele: { type: String, required: true },
  puissanceKVA: { type: Number, required: true },
  numeroSerie: { type: String, required: true, unique: true },
  acfCode: { type: String }, // Code interne d'identification
  
  // Localisation
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  pays: { type: mongoose.Schema.Types.ObjectId, ref: 'Pays' },
  siteInstallation: { type: String },
  
  // Statut
  statut: { type: String, enum: ['Actif', 'En maintenance', 'En panne', 'Hors service'], default: 'Actif' },
  
  // Compteurs
  heuresFonctionnement: { type: Number, default: 0 },
  consommationTheorique: { type: Number, default: 0 }, // Litres par heure (L/h)
  
  // Détails additionnels
  dateAcquisition: { type: Date },
  valeurAchat: { type: Number },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Generateur', generateurSchema);
