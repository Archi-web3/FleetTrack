const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Importez bcryptjs

const utilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  profil: {
    type: String,
    enum: ['SuperAdmin', 'Admin', 'Superviseur', 'Superviseur Sécurité', 'Logisticien', 'Technicien', 'Guest', 'Chauffeur'],
    default: 'Technicien'
  },
  // Multi-Tenancy
  pays: { type: mongoose.Schema.Types.ObjectId, ref: 'Pays' },
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' },

  // Info Pro
  numeroEmploye: { type: String },
  niveauValidationSecu: { type: Number, enum: [1, 2, 3, 4, 5], default: 1 }, // Jusqu'à quel niveau cet utilisateur peut valider (ex: 3 = peut valider 1, 2 et 3)
  autoManageSecurity: { type: Boolean, default: true }, // NOUVEAU: Indique si le niveau est lié automatiquement au profil

  // Champs spécifiques aux chauffeurs
  prenom: { type: String },
  telephone: { type: String },
  permis: { type: String },
  disponible: { type: Boolean, default: true },
  formationEcoConduite: {
    effectuee: { type: Boolean, default: false },
    date: { type: Date }
  },
  vehiculeAttitre: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' },
  
  // Documents / Pièces jointes (Permis scanné, Certificats...)
  documents: [{
    nom: { type: String },
    url: { type: String },
    dateAjout: { type: Date, default: Date.now },
    typeSource: { type: String, enum: ['Upload', 'Lien'], default: 'Upload' }
  }],

  // Projet/Programme
  projet: {
    type: String,
    default: 'Support',
    trim: true
  }
});

// Pré-hook Mongoose : avant de sauvegarder, hacher le mot de passe
utilisateurSchema.pre('save', async function (next) {
  if (this.isModified('motDePasse')) { // Hacher seulement si le mot de passe a été modifié ou est nouveau
    const salt = await bcrypt.genSalt(10); // Générer un sel (coût de hachage de 10)
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt); // Hacher le mot de passe
  }
  next(); // Passer au prochain middleware ou à la sauvegarde
});

// Méthode pour comparer un mot de passe donné avec le mot de passe haché
utilisateurSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.motDePasse);
};

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

module.exports = Utilisateur;
