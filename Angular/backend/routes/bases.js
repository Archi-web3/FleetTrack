const express = require('express');
const router = express.Router();
const Base = require('../models/base.model');
const authMiddleware = require('../middleware/authMiddleware');

// Get all bases (potentially filtered by Pays if query param exists)
router.get('/', authMiddleware(), async (req, res) => {
    try {
        let query = {};
        // NOUVEAU: Si Admin, on force le pays de l'utilisateur
        if (req.utilisateur.profil === 'Admin' || req.utilisateur.profil === 'Superviseur') {
            query.pays = req.utilisateur.pays;
        } else if (req.query.pays) {
            query.pays = req.query.pays;
        }
        const bases = await Base.find(query).populate('pays', 'nom code').sort('nom');
        res.json(bases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create base
router.post('/', authMiddleware(['SuperAdmin', 'Admin']), async (req, res) => {
    // Si c'est un Admin, on force le pays à être le sien (sécurité)
    if (req.utilisateur.profil === 'Admin') {
        req.body.pays = req.utilisateur.pays;
    }
    try {
        const base = new Base(req.body);
        const savedBase = await base.save();
        // Populate return
        await savedBase.populate('pays', 'nom code');
        res.status(201).json(savedBase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update base
router.put('/:id', authMiddleware(['SuperAdmin', 'Admin']), async (req, res) => {
    try {
        const base = await Base.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!base) return res.status(404).json({ message: 'Base non trouvée' });
        res.json(base);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete base
router.delete('/:id', authMiddleware(['SuperAdmin', 'Admin']), async (req, res) => {
    try {
        const base = await Base.findByIdAndDelete(req.params.id);
        if (!base) return res.status(404).json({ message: 'Base non trouvée' });
        res.json({ message: 'Base supprimée avec succès' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
