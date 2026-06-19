const mongoose = require('mongoose');

const generateurLogbookSchema = new mongoose.Schema({
  generateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Generateur', required: true },
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  
  dateReleve: { type: Date, required: true },
  
  // Compteur Horaire
  heureDebut: { type: Number, required: true },
  heureFin: { type: Number, required: true },
  
  // Consommation
  carburantAjoute: { type: Number, default: 0 }, // En litres
  
  observations: { type: String }
}, { timestamps: true });

// Champ virtuel pour calculer le nombre d'heures de la session
generateurLogbookSchema.virtual('dureeSession').get(function() {
  return this.heureFin - this.heureDebut;
});

// Champ virtuel pour la consommation L/h sur la session
generateurLogbookSchema.virtual('consommationLpH').get(function() {
  const duree = this.heureFin - this.heureDebut;
  if (duree > 0 && this.carburantAjoute > 0) {
    return this.carburantAjoute / duree;
  }
  return 0;
});

module.exports = mongoose.model('GenerateurLogbook', generateurLogbookSchema);
