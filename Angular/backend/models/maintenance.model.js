const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    date: { type: Date, required: true, default: Date.now },
    vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicule', required: true },
    type: { type: String, enum: ['Preventive', 'Curative', 'Contrôle Technique', 'Autre'], required: true },
    mileage: { type: Number, required: true },
    garage: { type: String }, // Nom du garage ou "Interne"
    mechanic: { type: String }, // Nom du mécanicien

    // Liste des tâches effectuées (basé sur une checklist)
    tasks: [{
        name: String,
        status: { type: String, enum: ['OK', 'Not OK', 'Fixed', 'Pending'], default: 'OK' },
        comments: String
    }],

    // Pièces remplacées
    parts: [{
        name: String,
        quantity: Number,
        reference: String,
        price: Number
    }],

    cost: { type: Number }, // Coût total
    invoicePhoto: { type: String },
    mechanicSignature: { type: String },
    nextMaintenanceMileage: { type: Number }, // Rappel pour la prochaine maintenance
    comments: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
