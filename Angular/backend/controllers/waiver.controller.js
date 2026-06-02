const Waiver = require('../models/waiver.model');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const auditService = require('../services/audit.service');

// Helper pour uploader sur Cloudinary via Stream
const uploadToCloudinary = (fileBuffer, folder, publicId) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: publicId,
                resource_type: 'image'
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

// Créer une nouvelle décharge (Upload signature + Save DB)
exports.createWaiver = async (req, res) => {
    try {
        const { visitorName, vehicleId, tripId } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Signature image is required' });
        }
        if (!visitorName || !vehicleId) {
            return res.status(400).json({ error: 'Visitor Name and Vehicle ID are required' });
        }

        // 1. Upload Signature to Cloudinary
        const folder = `fleettrack/waivers/${new Date().getFullYear()}`;
        const publicId = `waiver_${Date.now()}_${vehicleId}`;

        console.log('📝 [WAIVER] Uploading signature for:', visitorName);
        const cloudResult = await uploadToCloudinary(req.file.buffer, folder, publicId);

        // 2. Save Metadata to DB
        const waiver = new Waiver({
            visitorName,
            vehicleId,
            tripId: tripId || null,
            signatureUrl: cloudResult.secure_url
        });

        await waiver.save();
        console.log('✅ [WAIVER] Saved:', waiver._id);

        res.status(201).json({ message: 'Waiver signed successfully', waiver });

    } catch (error) {
        console.error('❌ [WAIVER] Error creating waiver:', error);
        res.status(500).json({ error: 'Error processing waiver' });
    }
};

// Supprimer une décharge
exports.deleteWaiver = async (req, res) => {
    try {
        const waiver = await Waiver.findById(req.params.id);
        if (!waiver) {
            return res.status(404).json({ error: 'Décharge non trouvée' });
        }

        // Tenter de supprimer l'image Cloudinary (Optionnel / Best Effort)
        if (waiver.signatureUrl) {
            try {
                // Extraction approximative du public_id depuis l'URL
                // Ex: https://res.cloudinary.com/cloudname/image/upload/v1234/folder/waiver_123.png
                // On veut: folder/waiver_123
                const urlParts = waiver.signatureUrl.split('/');
                const versionIndex = urlParts.findIndex(part => part.startsWith('v') && !isNaN(part.substring(1)));
                if (versionIndex !== -1) {
                    const publicIdWithExt = urlParts.slice(versionIndex + 1).join('/');
                    const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));

                    console.log('🗑️ [WAIVER] Tentative suppression image:', publicId);
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (imgErr) {
                console.warn('⚠️ [WAIVER] Erreur suppression image Cloudinary:', imgErr.message);
            }
        }

        await Waiver.findByIdAndDelete(req.params.id);

        // Log Deletion
        auditService.logAction(
            req,
            'DELETE_WAIVER',
            'WAIVER',
            `Waiver ID: ${req.params.id}`,
            { visitor: waiver.visitorName, vehicle: waiver.vehicleId }
        );

        console.log('✅ [WAIVER] Décharge supprimée:', req.params.id);
        res.json({ message: 'Décharge supprimée avec succès' });

    } catch (error) {
        console.error('❌ [WAIVER] Erreur suppression:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};

// List Waivers (Admin)
exports.getAllWaivers = async (req, res) => {
    try {
        const waivers = await Waiver.find()
            .populate('vehicleId', 'immatriculation marque modele') // Populate vehicle info
            .populate('tripId', 'mission') // Optional: populate trip info
            .sort({ signedAt: -1 });

        res.status(200).json(waivers);
    } catch (error) {
        console.error('❌ [WAIVER] Error listing waivers:', error);
        res.status(500).json({ error: 'Error retrieving waivers' });
    }
};
