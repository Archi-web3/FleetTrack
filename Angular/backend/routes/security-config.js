const express = require('express');
const router = express.Router();
const SecurityConfig = require('../models/security-config.model');
const Mouvement = require('../models/mouvement.model');
const Utilisateur = require('../models/utilisateur.model');
const auth = require('../middleware/authMiddleware');

// === GET CONFIG ===
// Récupérer la config pour le pays
router.get('/security-config', auth(), async (req, res) => {
    try {
        const pays = req.selectedCountry || req.utilisateur.pays;

        const mongoose = require('mongoose');
        if (!pays || pays === 'all' || pays === 'none' || !mongoose.Types.ObjectId.isValid(pays)) {
            return res.status(400).json({ message: 'Veuillez sélectionner un pays spécifique.' });
        }

        // Chercher la config du pays
        let config = await SecurityConfig.findOne({ pays: pays })
            .populate('rules.mandatoryValidators', 'nom prenom email');

        if (!config) {
            // Aucune config trouvée, on retourne un objet vide ou des valeurs par défaut
            return res.json({ pays, rules: [] });
        }

        res.json(config);
    } catch (err) {
        console.error('Erreur GET security-config:', err);
        res.status(500).json({ message: err.message });
    }
});

// === UPDATE / CREATE CONFIG ===
// La gestion des droits est faite côté front, mais on limite au moins aux profils élevés
router.post('/security-config', auth(['SuperAdmin', 'Admin']), async (req, res) => {
    try {
        const pays = req.selectedCountry || req.utilisateur.pays;
        const { rules } = req.body;

        const mongoose = require('mongoose');
        if (!pays || pays === 'all' || pays === 'none' || !mongoose.Types.ObjectId.isValid(pays)) {
            return res.status(400).json({ message: 'Veuillez sélectionner un pays spécifique.' });
        }

        // Upsert (Mise à jour ou Création)
        // La matrice est maintenant uniquement au niveau pays.
        const filter = { pays: pays, base: null };
        const update = {
            pays: pays,
            rules: rules,
            updatedAt: new Date(),
            updatedBy: req.utilisateur.id
        };

        const config = await SecurityConfig.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true, // Crée si n'existe pas
            setDefaultsOnInsert: true
        });



        res.json(config);
    } catch (err) {
        console.error('Erreur POST security-config:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
