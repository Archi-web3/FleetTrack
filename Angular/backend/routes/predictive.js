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
router.get('/fleet-health', auth, async (req, res) => {
    try {
        // Supposons que l'objet user est attaché à req par le middleware auth
        // Et qu'il contient le pays (scope)
        const userCountry = req.user.userPays || 'All'; // 'All' pour SuperAdmin si non défini

        const data = await predictiveService.getFleetHealthPrediction(userCountry);
        res.json(data);
    } catch (error) {
        console.error('Error in predictive service:', error);
        res.status(500).json({ message: 'Error calculating fleet health' });
    }
});

module.exports = router;
