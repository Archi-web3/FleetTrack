const express = require('express');
const router = express.Router();
const Setting = require('../models/setting.model');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/settings/vehicleTypes
// @desc    Get list of vehicle types
// @access  Private
router.get('/vehicleTypes', auth(), async (req, res) => {
    try {
        // Try to get from settings first
        const setting = await Setting.findOne({ key: 'vehicleTypes' });

        if (setting && setting.value) {
            return res.json(setting.value);
        }

        // Default vehicle types if not configured
        const defaultTypes = [
            'Land Cruiser',
            'Hilux',
            'Corolla',
            'Moto',
            'Camion',
            'Autre'
        ];

        res.json(defaultTypes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/settings/:key
// @desc    Get a specific setting by key
// @access  Private
router.get('/:key', auth(), async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: req.params.key });
        if (!setting) {
            // Return null or default value logic could go here, for now 404
            return res.status(404).json({ msg: 'Setting not found' });
        }
        res.json(setting);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/settings/:key
// @desc    Create or Update a setting
// @access  Private (Admin only logic can be added)
router.post('/:key', auth(), async (req, res) => {
    try {
        const { value } = req.body;

        let setting = await Setting.findOne({ key: req.params.key });

        if (setting) {
            // Update
            setting.value = value;
            setting.updatedAt = Date.now();
        } else {
            // Create
            setting = new Setting({
                key: req.params.key,
                value: value
            });
        }

        await setting.save();
        res.json(setting);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
