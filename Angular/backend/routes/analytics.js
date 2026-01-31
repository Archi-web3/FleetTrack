const express = require('express');
const router = express.Router();
const costService = require('../services/cost-analytics.service');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/analytics/costs/tco:
 *   get:
 *     summary: Get Total Cost of Ownership
 */
router.get('/costs/tco', auth(), async (req, res) => {
    try {
        const userCountry = req.utilisateur.pays || null;
        const { startDate, endDate, vehicleId } = req.query;

        const filters = {
            startDate,
            endDate,
            vehicleId,
            country: userCountry
        };

        const data = await costService.calculateTCO(filters);
        res.json(data);
    } catch (err) {
        console.error("Error TCO:", err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/analytics/costs/forecast:
 *   get:
 *     summary: Get Cost Forecast for next month
 */
router.get('/costs/forecast', auth(), async (req, res) => {
    try {
        const userCountry = req.utilisateur.pays || null;
        const { months } = req.query; // Récupération du paramètre
        const data = await costService.predictCosts(userCountry, months);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/analytics/reliability:
 *   get:
 *     summary: Get Vehicle Model Reliability Ranking
 */
router.get('/reliability', auth(), async (req, res) => {
    try {
        const userCountry = req.utilisateur.pays || null;
        const data = await costService.analyzeFleetReliability(userCountry);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
