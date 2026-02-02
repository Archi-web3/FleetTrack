const express = require('express');
const router = express.Router();
const FunctionalTree = require('../models/functional-tree.model');
const auth = require('../middleware/authMiddleware');

// GET: Retrieve the Functional Tree
router.get('/', auth(), async (req, res) => {
    try {
        let tree = await FunctionalTree.findOne({ treeId: 'MASTER' });
        if (!tree) {
            // Return null or specific code to let frontend know to use default/init
            return res.status(404).json({ message: 'No tree structure saved yet.' });
        }
        res.json(tree.content);
    } catch (err) {
        console.error('Error fetching functional tree:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST: Save/Update the Functional Tree
router.post('/', auth(), async (req, res) => {
    try {
        const { treeData } = req.body;

        if (!treeData) {
            return res.status(400).json({ message: 'No tree data provided' });
        }

        const updatedTree = await FunctionalTree.findOneAndUpdate(
            { treeId: 'MASTER' },
            {
                content: treeData,
                lastUpdated: Date.now(),
                updatedBy: req.utilisateur.nomComplet || req.utilisateur.email
            },
            { new: true, upsert: true }
        );

        res.json(updatedTree.content);
    } catch (err) {
        console.error('Error saving functional tree:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
