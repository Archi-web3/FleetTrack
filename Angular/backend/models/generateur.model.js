const mongoose = require('mongoose');

const generateurSchema = new mongoose.Schema({
  // Identification
  marque: { type: String, required: true },
  modele: { type: String, required: true },
  puissanceKVA: { type: Number, required: true },
  numeroSerie: { type: String, required: true, unique: true },
  numeroMoteur: { type: String },
  acfCode: { type: String }, // Code interne d'identification
  categorie: { type: String },
  proprietaire: { type: String }, // ACF, Location, etc.
  typeCarburant: { type: String, enum: ['Diesel', 'Essence', 'Autre'], default: 'Diesel' },
  
  // Historique et Assurance
  anneeFabrication: { type: Number },
  anneePremiereUtilisation: { type: Number },
  coutAssuranceAnnuel: { type: Number },
  dateCommencement: { type: Date },
  
  // Localisation
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  pays: { type: mongoose.Schema.Types.ObjectId, ref: 'Pays' },
  siteInstallation: { type: String },
  
  // Statut
  statut: { type: String, enum: ['Actif', 'En maintenance', 'En panne', 'Hors service'], default: 'Actif' },
  
  // Compteurs
  heuresInitiales: { type: Number, default: 0 },
  heuresFonctionnement: { type: Number, default: 0 }, // Heures totales actuelles
  consommationTheorique: { type: Number, default: 0 }, // Litres par heure (L/h)
  
  // Détails additionnels
  dateAcquisition: { type: Date },
  valeurAchat: { type: Number },
  notes: { type: String },
  remarques: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Generateur', generateurSchema);
