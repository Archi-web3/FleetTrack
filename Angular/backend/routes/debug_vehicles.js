const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicule.model');
const mongoose = require('mongoose');

// Route de debug accessible publiquement (temporaire)
router.get('/debug/vehicles', async (req, res) => {
    try {
        const count = await Vehicle.countDocuments({});
        const sample = await Vehicle.find({}).limit(5);
        res.json({
            status: 'DEBUG_OK',
            dbName: mongoose.connection.name,
            totalVehicles: count,
            sample: sample
        });
    } catch (err) {
        res.status(500).json({ status: 'DEBUG_ERROR', error: err.message });
    }
});

module.exports = router;
