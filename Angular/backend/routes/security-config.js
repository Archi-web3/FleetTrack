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
        const baseId = req.query.baseId === 'null' ? null : req.query.baseId;

        const mongoose = require('mongoose');
        if (!pays || pays === 'all' || pays === 'none' || !mongoose.Types.ObjectId.isValid(pays)) {
            return res.status(400).json({ message: 'Veuillez sélectionner un pays spécifique.' });
        }

        // Chercher la config du pays (et de la base)
        const filter = { pays: pays };
        if (baseId !== undefined) {
            filter.base = baseId;
        } else {
            filter.base = null; // Par défaut, on retourne la config globale
        }

        let config = await SecurityConfig.findOne(filter)
            .populate('rules.mandatoryValidators', 'nom prenom email');

        if (!config) {
            // Aucune config trouvée, on retourne un objet vide ou des valeurs par défaut
            return res.json({ pays, base: baseId || null, rules: [] });
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
        const { rules, base } = req.body;
        const baseId = base === 'null' || !base ? null : base;

        const mongoose = require('mongoose');
        if (!pays || pays === 'all' || pays === 'none' || !mongoose.Types.ObjectId.isValid(pays)) {
            return res.status(400).json({ message: 'Veuillez sélectionner un pays spécifique.' });
        }

        // Upsert (Mise à jour ou Création)
        const filter = { pays: pays, base: baseId };
        const update = {
            pays: pays,
            base: baseId,
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
