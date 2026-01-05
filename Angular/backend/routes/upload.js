const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const auth = require('../middleware/authMiddleware');

// Configuration Multer (stockage en mémoire)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        // Accepter uniquement les images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Seules les images sont acceptées'), false);
        }
    }
});

/**
 * Upload une photo vers Cloudinary
 * POST /api/upload
 * Body: FormData avec 'photo' (file), 'type', 'recordId', 'country', 'base'
 */
router.post('/upload', auth(), upload.single('photo'), async (req, res) => {
    try {
        console.log('📸 [UPLOAD] Début upload photo');
        console.log('📸 [UPLOAD] Headers:', req.headers.authorization ? 'Token présent' : 'PAS DE TOKEN');
        console.log('📸 [UPLOAD] User:', req.utilisateur ? req.utilisateur.nom : 'UTILISATEUR NON DÉFINI');
        console.log('📸 [UPLOAD] File:', req.file ? req.file.originalname : 'No file');

        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier fourni' });
        }

        const { type, recordId, country, base } = req.body;

        if (!type || !recordId || !country || !base) {
            return res.status(400).json({
                message: 'Paramètres manquants (type, recordId, country, base)'
            });
        }

        // Organisation par pays/base/type/date
        const date = new Date();
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const folder = `fleettrack/${country}/${base}/${type}/${yearMonth}`;

        console.log('📸 [UPLOAD] Folder:', folder);

        // Upload vers Cloudinary via stream
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    public_id: `${type}_${recordId}_${Date.now()}`,
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) {
                        console.error('❌ [UPLOAD] Cloudinary error:', error);
                        reject(error);
                    } else {
                        console.log('✅ [UPLOAD] Success:', result.secure_url);
                        resolve(result);
                    }
                }
            );

            // Convertir buffer en stream et pipe vers Cloudinary
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });

        const result = await uploadPromise;

        res.json({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            size: result.bytes
        });

    } catch (error) {
        console.error('❌ [UPLOAD] Error:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * Supprimer une photo de Cloudinary
 * DELETE /api/upload/:publicId
 */
router.delete('/upload/:publicId', auth(), async (req, res) => {
    try {
        const publicId = req.params.publicId.replace(/_/g, '/'); // Reconvertir le publicId

        console.log('🗑️ [DELETE] Suppression photo:', publicId);

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            console.log('✅ [DELETE] Photo supprimée');
            res.json({ message: 'Photo supprimée avec succès' });
        } else {
            console.log('⚠️ [DELETE] Photo non trouvée');
            res.status(404).json({ message: 'Photo non trouvée' });
        }
    } catch (error) {
        console.error('❌ [DELETE] Error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
