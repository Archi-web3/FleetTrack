const express = require('express');
const router = express.Router();
const Pays = require('../models/pays.model');
const authMiddleware = require('../middleware/authMiddleware');

// Get all pays
router.get('/', authMiddleware(), async (req, res) => {
    try {
        const pays = await Pays.find().sort('nom');
        res.json(pays);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create pays
router.post('/', authMiddleware(['SuperAdmin']), async (req, res) => {
    try {
        const pays = new Pays(req.body);
        const savedPays = await pays.save();
        res.status(201).json(savedPays);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update pays (SuperAdmin uniquement)
router.put('/:id', authMiddleware(['SuperAdmin']), async (req, res) => {
    try {
        const pays = await Pays.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pays) return res.status(404).json({ message: 'Pays non trouvé' });
        res.json(pays);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete pays
router.delete('/:id', authMiddleware(['SuperAdmin']), async (req, res) => {
    try {
        const pays = await Pays.findByIdAndDelete(req.params.id);
        if (!pays) return res.status(404).json({ message: 'Pays non trouvé' });
        res.json({ message: 'Pays supprimé avec succès' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
