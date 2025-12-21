const mongoose = require('mongoose');

const fuelSchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule', required: true },
  chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Chauffeur', required: true },
  mileage: { type: Number, required: true }, // Kilométrage au moment du plein
  quantity: { type: Number, required: true }, // Quantité en litres
  fuelType: { type: String, enum: ['Diesel', 'Essence', 'Hybride', 'Electrique'], required: true },
  source: { type: String, enum: ['Station Service', 'Stock ACF', 'Autre'], default: 'Station Service' },
  fullTank: { type: Boolean, default: true }, // Est-ce un plein complet ? (Utile pour calcul conso)
  price: { type: Number }, // Prix total ou par litre (optionnel)
  driverSignature: { type: String }, // URL ou base64 de la signature
  receiptPhoto: { type: String }, // URL de la photo du reçu
  comments: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Fuel', fuelSchema);
