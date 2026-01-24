const mongoose = require('mongoose');

// Définir le sous-schéma pour une étape (stop)
const stopSchema = new mongoose.Schema({
  lieu: { type: mongoose.Schema.Types.ObjectId, ref: 'Lieu', required: false }, // MODIFIÉ: Optionnel pour "Ma Position"
  dateArrivee: { type: Date }, // Date/heure d'arrivée à cette étape (optionnel, ex: pour le départ final)
  dateDepart: { type: Date }, // Date/heure de départ de cette étape (optionnel, ex: pour l'arrivée finale)
  originMouvement: { type: mongoose.Schema.Types.ObjectId, ref: 'Mouvement' } // NOUVEAU: Pour tracer l'origine lors de la consolidation
}, { _id: false });

const mouvementSchema = new mongoose.Schema({
  stops: { type: [stopSchema], required: true, validate: v => Array.isArray(v) && v.length > 0 },
  demandeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule' },
  chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }, // MODIFIÉ: ref 'Utilisateur' au lieu de 'Chauffeur'
  passagers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }],
  materiel: [String],
  objectif: String,
  statut: { type: String, enum: ['en attente', 'validé', 'pris en charge', 'en cours', 'terminé', 'annulé', 'refusé', 'en attente validation sécurité', 'regroupé', 'regroupé-enfant'], default: 'en attente' },
  motifRefus: { type: String },
  parentMouvement: { type: mongoose.Schema.Types.ObjectId, ref: 'Mouvement' },
  enfantsMouvements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mouvement' }],

  // Multi-Tenancy : La base qui gère ce mouvement (déduite du demandeur ou assignée)
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: false }, // required: false pour la migration

  // Multi-Pays : Le pays du mouvement (déduit du demandeur ou de la base)
  pays: { type: mongoose.Schema.Types.ObjectId, ref: 'Pays', required: false },

  // Projet associé au mouvement (déduit du demandeur ou des passagers)
  projet: { type: String }, // Code du projet principal (du demandeur)

  // Liste des projets de tous les passagers (pour mouvements consolidés multi-projets)
  projetsPassagers: [{ type: String }], // Array des codes projets uniques des passagers

  // Mode de Transport (Module 2)
  modeTransport: { type: String, enum: ['Routier', 'Aérien', 'Maritime'], default: 'Routier' },

  // Validation Avancée (Module 2)
  validationLevelRequired: { type: Number, default: 0 }, // 0 = Pas de restriction, 1-5 = Niveau de danger max du trajet
  validationHistory: [{
    validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    validatedAt: { type: Date, default: Date.now },
    level: { type: Number }, // Niveau de sécurité que l'utilisateur avait le droit de valider
    status: { type: String } // 'validé' ou 'refusé'
  }],

  // Gestion Financière (Module 2)
  projetsVentilation: [{
    projet: { type: String },
    percentage: { type: Number }
  }],

  isRoundTrip: { type: Boolean, default: false }, // NOUVEAU CHAMP : Indique si c'est un aller-retour simple

  // Ces champs sont dérivés des stops, mais maintenus pour des recherches rapides ou des affichages sommaires
  // (Le hook pre-save les gérera)
  dateDepart: { type: Date }, // Gardons-les pour compatibilité avec le code existant et le hook
  dateArrivee: { type: Date }, // Gardons-les pour compatibilité avec le code existant et le hook

  // --- PRISE EN CHARGE PAR LE CHAUFFEUR ---
  takenInChargeAt: { type: Date }, // Quand le chauffeur a pris en charge la mission
  takenInChargeBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Chauffeur' }, // Qui a pris en charge

  // --- CHAMPS E-LOGBOOK (Données Réelles) ---
  realDepartureTime: { type: Date },
  realArrivalTime: { type: Date },
  startMileage: { type: Number },
  endMileage: { type: Number },
  gpsTrace: [{ // Tableau de points GPS pour le tracé réel
    lat: Number,
    lng: Number,
    timestamp: Date,
    speed: Number
  }],
  deviations: [{ // NOUVEAU : Écarts constatés (calculés ou signalés)
    type: { type: String, enum: ['time', 'distance', 'route'] },
    value: Number, // Valeur de l'écart (minutes, km)
    description: String
  }],
  driverObservations: { type: String }, // Remarques du chauffeur
  photos: [{ type: mongoose.Schema.Types.Mixed }], // NOUVEAU: Photos (compteur, trajet) - Support string[] ou object[]
  isLocked: { type: Boolean, default: false }, // Si true, les données ne sont plus modifiables par le chauffeur
  syncStatus: { type: String, enum: ['pending', 'synced', 'error'], default: 'pending' } // Pour le debug de synchro
});

// Ajoutez un pré-save hook pour garantir la cohérence des dates globales
mouvementSchema.pre('save', function (next) {
  if (this.stops && this.stops.length > 0) {
    // La dateDepart globale est la dateDepart du premier stop
    this.dateDepart = this.stops[0].dateDepart;
    // La dateArrivee globale est la dateArrivee du dernier stop
    this.dateArrivee = this.stops[this.stops.length - 1].dateArrivee;
  }
  next();
});

const Mouvement = mongoose.model('Mouvement', mouvementSchema);

module.exports = Mouvement;
