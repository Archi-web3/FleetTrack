const express = require('express');
const router = express.Router();
const EnvironmentAction = require('../models/environment-action.model');
const EnvironmentData = require('../models/environment-data.model');
const Fuel = require('../models/fuel.model');
// Mouvement model might be needed for Km aggregation if not in Trip
const Mouvement = require('../models/mouvement.model');
// Assuming auth middleware exists
// const auth = require('../middleware/auth'); 

// ==========================================
// 1. ACTIONS (Roadmap)
// ==========================================

// GET actions by year/base
router.get('/actions', async (req, res) => {
    try {
        const { year, base } = req.query;
        if (!year || !base) return res.status(400).json({ message: 'Year and Base required' });

        const actions = await EnvironmentAction.find({ year, base });
        res.json(actions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create action
router.post('/actions', async (req, res) => {
    try {
        const newAction = new EnvironmentAction(req.body);
        const savedAction = await newAction.save();
        res.status(201).json(savedAction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update action
router.put('/actions/:id', async (req, res) => {
    try {
        const updatedAction = await EnvironmentAction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedAction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE action
router.delete('/actions/:id', async (req, res) => {
    try {
        await EnvironmentAction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Action deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ==========================================
// 2. DATA (Monthly Stats & IAP)
// ==========================================

// GET data by year/base (For charts & table)
router.get('/data', async (req, res) => {
    try {
        const { year, base } = req.query;
        const data = await EnvironmentData.find({ year, base }).sort({ month: 1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST/PUT Upsert Monthly Data
router.post('/data', async (req, res) => {
    try {
        const { year, month, base } = req.body;

        // Calculate IAP and Metrics before saving if not provided
        // (Or trust frontend - better to do simple validation here)
        const data = await EnvironmentData.findOneAndUpdate(
            { year, month, base },
            req.body,
            { new: true, upsert: true }
        );
        res.json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ==========================================
// 3. AUTOMATION (Aggregation)
// ==========================================

// GET aggregated stats (Auto-fill) from existing records
router.get('/aggregate', async (req, res) => {
    try {
        const { year, month, base } = req.query; // base can be used to filter vehicles if they are linked to base

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // --- 1. Aggregation Fuel (Litres) ---
        // Note: fuel.model has 'vehicule', 'quantity'

        // Need to filter by Base? 
        // Assuming Vehicule has 'base' or we filter Fuels by Vehicles belonging to base.
        // For now, simpler: Get all fuels in date range (Improvement: Filter by Base)
        // TODO: Add Base filtering logic once linked

        const fuelStats = await Fuel.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lte: endDate }
                    // 'base': base // If Fuel has base or lookup needed
                }
            },
            {
                $group: {
                    _id: null,
                    totalLiters: { $sum: '$quantity' }
                }
            }
        ]);

        // --- 2. Aggregation Km (From Mouvements/Trips) ---
        // Assuming Mouvement has 'distanceReelle' or 'distance' and 'statut'='Terminé'
        const kmStats = await Mouvement.aggregate([
            {
                $match: {
                    dateDepart: { $gte: startDate, $lte: endDate },
                    statut: { $in: ['Terminé', 'Validé'] } // Only completed trips
                }
            },
            {
                $group: {
                    _id: null,
                    totalKm: { $sum: '$distanceReelle' }, // Or fallback to estimated distance
                    nbMissions: { $sum: 1 }
                }
            }
        ]);

        // --- 3. Drivers Activity (Example: Count Projects) ---
        // This depends on how projects are stored/active
        // Placeholder 

        res.json({
            fleet_liters_total: fuelStats[0]?.totalLiters || 0,
            fleet_km_total: kmStats[0]?.totalKm || 0,
            driver_nb_projects: 0 // To be implemented with Project model
        });

    } catch (error) {
        console.error('Aggregation error:', error);
        res.status(500).json({ message: 'Error calculating aggregates', error: error.message });
    }
});

module.exports = router;
