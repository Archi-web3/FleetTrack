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
  owner: { type: String, enum: ['ACF', 'Location'], default: 'ACF' },
  category: { type: String, enum: ['Voiture', 'Camion', 'Moto'], default: 'Voiture' },
  type: { type: String }, // Ex: City car, Minibus, 4x4 léger, 4x4 pickup, 4x4 lourd, 100cc, 125cc...

  // Details
  year: { type: Number }, // Année de fabrication
  startDate: { type: Date }, // Date de 1ère utilisation
  capacitePassagers: { type: Number, required: true, default: 1 },
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

  // Mileage
  initialMileage: { type: Number, default: 0 }, // KM initial

  // Status
  enService: { type: Boolean, default: true },
  remarks: { type: String }
}, { timestamps: true });

const Vehicule = mongoose.model('Vehicule', vehiculeSchema);

module.exports = Vehicule;
