const mongoose = require('mongoose');

const securityConfigSchema = new mongoose.Schema({
    pays: { type: mongoose.Schema.Types.ObjectId, ref: 'Pays', required: true },
    base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' }, // Optionnel : Si défini, surcharge la config pays pour cette base spécifique

    rules: [{
        level: { type: Number, required: true, min: 1, max: 5 }, // Niveau de sécurité (1-5)

        // Liste des validateurs OBLIGATOIRES (ex: Le Chef de Base, Le Manager Sécu)
        mandatoryValidators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }],

        // Si pas de liste spécifique, ou en complément :
        // Est-ce que TOUS les validateurs listés ci-dessus doivent valider ? (Unanimité)
        // Sinon, combien de validations minimum sont requises ?
        requireUnanimity: { type: Boolean, default: true },
        quorum: { type: Number, default: 1 } // Utilisé si requireUnanimity = false. Min validateurs requis.
    }],

    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }
});

// Unicité : Une config par Pays (+ Base optionnelle)
securityConfigSchema.index({ pays: 1, base: 1 }, { unique: true });

const SecurityConfig = mongoose.model('SecurityConfig', securityConfigSchema);

module.exports = SecurityConfig;
