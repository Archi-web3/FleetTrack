const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection string - using the one from backend/.env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://fleettrack:fleettrack2024@cluster0.mongodb.net/fleettrack?retryWrites=true&w=majority';

// Define the schema inline (same as backend/models/checklist-template.model.js)
const checklistTemplateSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Hebdomadaire', 'Service A', 'Service B', 'Service C']
    },
    typeVehicule: {
        type: String,
        default: 'Tous'
    },
    taches: [
        {
            numero: String,
            categorie: {
                type: String,
                enum: ['Détection', 'Moteur', 'Roues/Pneus', 'Batterie/Élec', 'Éclairage', 'Sécurité/Documents', 'Communication', 'Nettoyage', 'Finalisation', 'Autre']
            },
            description: {
                type: String,
                required: true
            },
            numeroTacheManuel: String,
            obligatoire: {
                type: Boolean,
                default: true
            }
        }
    ],
    actif: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const ChecklistTemplate = mongoose.model('ChecklistTemplate', checklistTemplateSchema);

async function seedServiceA() {
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected!');

        // Read the template
        const templateData = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'service_a_template.json'), 'utf-8')
        );

        // Check if it already exists
        const existing = await ChecklistTemplate.findOne({
            type: 'Service A',
            nom: templateData.nom
        });

        if (existing) {
            console.log('⚠️  Template "Service A" already exists. Updating...');
            await ChecklistTemplate.findByIdAndUpdate(existing._id, templateData);
            console.log('✅ Template updated!');
        } else {
            const template = await ChecklistTemplate.create(templateData);
            console.log('✅ Template "Service A" created!');
            console.log(`   ID: ${template._id}`);
            console.log(`   Tasks: ${template.taches.length}`);
        }

        await mongoose.connection.close();
        console.log('\n🎉 Done! You can now see the template in your dashboard.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seedServiceA();
