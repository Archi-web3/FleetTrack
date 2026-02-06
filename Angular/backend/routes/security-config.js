const express = require('express');
const router = express.Router();
const SecurityConfig = require('../models/security-config.model');
const auth = require('../middleware/authMiddleware');

// === GET CONFIG ===
// Récupérer la config pour le pays (et base optionnelle) de l'utilisateur connecté
router.get('/security-config', auth(['SuperAdmin', 'Admin', 'Superviseur Sécurité']), async (req, res) => {
    try {
        const { pays, base } = req.utilisateur;

        if (!pays) {
            return res.status(400).json({ message: 'Utilisateur sans pays défini.' });
        }

        // Chercher une config spécifique à la base, sinon celle du pays
        let config = await SecurityConfig.findOne({ pays: pays, base: base })
            .populate('rules.mandatoryValidators', 'nom prenom email');

        if (!config && base) {
            // Fallback: Config pays générique (base null)
            config = await SecurityConfig.findOne({ pays: pays, base: null })
                .populate('rules.mandatoryValidators', 'nom prenom email');
        }

        if (!config) {
            // Aucune config trouvée, on retourne un objet vide ou des valeurs par défaut
            return res.json({ pays, base, rules: [] });
        }

        res.json(config);
    } catch (err) {
        console.error('Erreur GET security-config:', err);
        res.status(500).json({ message: err.message });
    }
});

// === UPDATE / CREATE CONFIG ===
// Seul un Admin ou Superviseur Sécurité peut modifier la matrice
router.post('/security-config', auth(['SuperAdmin', 'Admin', 'Superviseur Sécurité']), async (req, res) => {
    try {
        const { pays, base } = req.utilisateur; // On force le pays/base de l'admin pour éviter qu'il modifie ailleurs
        const { rules } = req.body;

        if (!pays) {
            return res.status(400).json({ message: 'Utilisateur sans pays défini.' });
        }

        // Upsert (Mise à jour ou Création)
        // On cherche par Pays + Base (ou null si config nationale)
        // Note: Pour simplifier, on permet ici de modifier la config de SA base ou SON pays. 
        // Idéalement, on gérerait ça via des params, mais pour l'instant restons simples.

        const filter = { pays: pays, base: base || null };
        const update = {
            pays: pays,
            base: base || null,
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
