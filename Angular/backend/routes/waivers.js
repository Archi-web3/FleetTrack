const express = require('express');
const router = express.Router();
const waiverController = require('../controllers/waiver.controller');
const multer = require('multer');
const auth = require('../middleware/authMiddleware');

// Multer config for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max for signature
});

// POST /api/waivers - Create a new waiver (Public or Auth?)
// Ideally should be authenticated by the tablet user (driver)
router.post('/', auth(), upload.single('signature'), waiverController.createWaiver);

// GET /api/waivers - List all waivers (Admin only)
router.get('/', auth(), waiverController.getAllWaivers);

// DELETE /api/waivers/:id - Delete a waiver (Admin only)
router.delete('/:id', auth(['Admin', 'SuperAdmin', 'Superviseur']), waiverController.deleteWaiver);

module.exports = router;
