const express = require('express');
const router = express.Router();
const predictiveService = require('../services/predictive-maintenance.service');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/predictive/fleet-health:
 *   get:
 *     summary: Retrieve fleet health predictions and alerts
 *     tags: [Predictive Maintenance]
 *     responses:
 *       200:
 *         description: Fleet health data
 */
router.get('/fleet-health', auth(), async (req, res) => {
    try {
        // req.utilisateur est défini par authMiddleware
        // contient .base et .pays
        const userCountry = req.utilisateur.pays || 'All'; // 'All' si undefined (SuperAdmin sans pays)

        const data = await predictiveService.getFleetHealthPrediction(userCountry);
        res.json(data);
    } catch (error) {
        console.error('Error in predictive service:', error);
        res.status(500).json({ message: 'Error calculating fleet health' });
    }
});

module.exports = router;
