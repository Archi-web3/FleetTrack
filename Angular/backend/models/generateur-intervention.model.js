const mongoose = require('mongoose');

const generateurInterventionSchema = new mongoose.Schema({
  generateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Generateur', required: true },
  
  // Type et Fréquence
  typeIntervention: { type: String, enum: ['Préventive', 'Curative'], required: true },
  frequence: { type: Number, enum: [250, 500, 1000, 3000, null] }, // null pour Curative
  
  // Intervenant
  nomIntervenant: { type: String, required: true },
  dateIntervention: { type: Date, required: true },
  
  // Heures au moment de l'intervention
  heuresActuelles: { type: Number, required: true },
  prochaineMaintenanceHeures: { type: Number },
  datePrevisionnelleProchaine: { type: Date },
  
  // Checklist pour maintenance préventive (Objet stockant l'état des cases cochées)
  // Basé sur le tableau de maintenance (250h, 500h, 1000h, 3000h)
  checklist: { type: mongoose.Schema.Types.Mixed },
  
  // Curative ou détails pannes
  descriptionPanne: { type: String },
  observations: { type: String },
  
  // Pièces utilisées
  piecesUtilisees: [{
    reference: { type: String },
    details: { type: String },
    quantite: { type: Number }
  }],
  
  // Test du groupe durant 5 mn
  testCondition: { 
    type: String, 
    enum: ['Fonctionnement normal', 'Bruit suspect detecté', 'Mauvais fonctionnement'],
    default: 'Fonctionnement normal'
  },
  
  // Validation
  faitA: { type: String }, // Lieu
  signatureIntervenant: { type: Boolean, default: false },
  signatureResponsable: { type: Boolean, default: false },
  
  // Statut global
  statut: { type: String, enum: ['Planifié', 'En cours', 'Complété'], default: 'Planifié' }

}, { timestamps: true });

module.exports = mongoose.model('GenerateurIntervention', generateurInterventionSchema);
