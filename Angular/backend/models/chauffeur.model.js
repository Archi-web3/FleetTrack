const mongoose = require('mongoose');

const chauffeurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String, required: true, unique: true },
  permis: { type: String, required: true, unique: true }, // Numéro de permis
  disponible: { type: Boolean, default: true },
  schedules: [{
    status: { type: String, enum: ['On Duty', 'Off Duty', 'Sick', 'Vacation', 'Other'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    notes: { type: String }
  }]
  // Vous pouvez ajouter d'autres champs selon les besoins (expérience, langues, etc.)
});

const Chauffeur = mongoose.model('Chauffeur', chauffeurSchema);

module.exports = Chauffeur;
