const mongoose = require('mongoose');

const paysSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    code: { type: String, required: true, unique: true }, // ex: 'RDC', 'RCA', 'MLI'
    devise: { type: String, default: 'USD' }, // Devise principale du pays

    // Configuration spécifique au pays
    parametres: {
        fuseauHoraire: { type: String, default: 'UTC' }
    }
}, { timestamps: true });

const Pays = mongoose.model('Pays', paysSchema);

module.exports = Pays;
