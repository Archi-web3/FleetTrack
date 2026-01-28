const Waiver = require('../models/waiver.model');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

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
