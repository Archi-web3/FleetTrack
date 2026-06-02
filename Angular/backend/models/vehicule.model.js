const mongoose = require('mongoose');

const vehiculeSchema = new mongoose.Schema({
  // Identification
  immatriculation: { type: String, required: true, unique: true },
  marque: { type: String, required: true },
  modele: { type: String, required: true },
  acfCode: { type: String }, // Numéro d'identification du véhicule
  // base: { type: String }, // ANCIEN (String)
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' }, // NOUVEAU (Relation)
  pays: { type: mongoose.Schema.Types.ObjectId, ref: 'Pays' }, // Pays du véhicule

  // Classification
  typePropriete: { type: String, enum: ['ACF', 'Location'], default: 'ACF' },
  locationDetails: {
    nomLoueur: { type: String },
    dateDebut: { type: Date },
    dateFin: { type: Date }
  },
  achatDetails: {
    dateAchat: { type: Date },
    valeurAchat: { type: Number }
  },
  category: { type: String, enum: ['Voiture', 'Camion', 'Moto'], default: 'Voiture' },
  type: { type: String }, // Ex: City car, Minibus, 4x4 léger, 4x4 pickup, 4x4 lourd, 100cc, 125cc...

  // Details
  year: { type: Number }, // Année de fabrication
  startDate: { type: Date }, // Date de 1ère utilisation
  // Kilométrage
  kilometrage: { type: Number, required: true, default: 0, min: 0 },
  kilometrageInitial: { type: Number, default: 0, min: 0 }, // Km lors de l'acquisition du véhicule
  derniereMiseAJourKm: { type: Date, default: Date.now },
  capacitePassagers: { type: Number, default: 5 },
  enService: { type: Boolean, default: true },
  enableGpsTracking: { type: Boolean, default: false }, // NOUVEAU: Config GPS par véhicule,
  fuelType: { type: String, enum: ['Diesel', 'Essence', 'Hybride', 'Electrique'], default: 'Diesel' },

  // Données environnementales
  emissionsCO2: {
    valeur: { type: Number, min: 0 }, // en g/km
    source: {
      type: String,
      enum: ['Constructeur', 'Test Manuel'],
      default: 'Constructeur'
    }
  },
  consommation: {
    valeur: { type: Number, min: 0 }, // en L/100km
    source: {
      type: String,
      enum: ['Constructeur', 'Test Manuel'],
      default: 'Constructeur'
    },
    dateTest: { type: Date } // Si test manuel, date du test
  },

  // Costs & Value (ACF)
  purchaseValue: { type: Number }, // Valeur d'achat
  depreciationMonths: { type: Number }, // Période de dépréciation (mois)
  insuranceCost: { type: Number }, // Coût annuel assurance
  insuranceEndDate: { type: Date }, // Date fin assurance

  // Costs (Location)
  rentalCost: { type: Number }, // Coût mensuel location
  driverIncluded: { type: Boolean, default: false }, // Location inclut chauffeur ?

  // Web Push Subscription (Tablette e-logbook) - Type Mixed pour flexibilité
  pushSubscription: { type: mongoose.Schema.Types.Mixed },

  // Mileage


  // Status / Archivage
  statut: { type: String, enum: ['En Service', 'Hors Service', 'Vendu', 'Archivé', 'Restitué'], default: 'En Service' },
  archivedAt: { type: Date }, // Date d'archivage

  // Insurance
  assurance: {
    nomAssureur: { type: String },
    dateFin: { type: Date },
    certificatUrl: { type: String } // Lien vers le fichier uploadé
  },

  // Equipements de bord (Nouveau) - Liste standard (1-22)
  equipements: [{
    code: { type: Number }, // 1 à 22
    name: { type: String },
    isPresent: { type: Boolean, default: false },
    lastChecked: { type: Date },
    comment: { type: String } // Pour noter si "périmé", "quantité manquante"...
  }],

  remarks: { type: String }
}, { timestamps: true });

// Hook pour générer automatiquement l'ID (acfCode)
// Hook pour générer automatiquement l'ID (acfCode) - Séquence par PAYS
vehiculeSchema.pre('save', async function (next) {
  if (!this.acfCode) {
    try {
      const Denomination = 'MOB';

      // Trouver le dernier véhicule DE CE PAYS qui a un code commençant par 'MOB-'
      // Note: this.pays est un ObjectId, donc la requête doit matcher cet ID.
      const lastVehicule = await this.constructor.findOne({
        pays: this.pays,
        acfCode: { $regex: new RegExp(`^${Denomination}-\\d+$`) }
      })
        .sort({ acfCode: -1 })
        .limit(1);

      let nextNum = 1;
      if (lastVehicule && lastVehicule.acfCode) {
        const parts = lastVehicule.acfCode.split('-');
        if (parts.length === 2) {
          const numPart = parseInt(parts[1], 10);
          if (!isNaN(numPart)) {
            nextNum = numPart + 1;
          }
        }
      }

      // Formater avec 3 chiffres (ex: MOB-001)
      this.acfCode = `${Denomination}-${nextNum.toString().padStart(3, '0')}`;
      console.log(`[Auto-ID] Code généré pour le nouveau véhicule (Pays: ${this.pays}): ${this.acfCode}`);
    } catch (err) {
      console.error("[Auto-ID] Erreur lors de la génération de l'ID:", err);
      return next(err);
    }
  }
  next();
});

const Vehicule = mongoose.model('Vehicule', vehiculeSchema);

module.exports = Vehicule;
