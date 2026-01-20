const mongoose = require('mongoose');
const fs = require('fs');

// MongoDB Atlas URI (from Render deployment)
const MONGODB_URI = 'mongodb+srv://fleettrack:fleettrack2024@cluster0.mongodb.net/fleettrack?retryWrites=true&w=majority';

// Define the schema inline
const checklistTemplateSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    type: { type: String, required: true, enum: ['Hebdomadaire', 'Service A', 'Service B', 'Service C'] },
    typeVehicule: { type: String, default: 'Tous' },
    taches: [{
        numero: String,
        categorie: String,
        description: { type: String, required: true },
        numeroTacheManuel: String,
        obligatoire: { type: Boolean, default: true }
    }],
    actif: { type: Boolean, default: true }
}, { timestamps: true });

const ChecklistTemplate = mongoose.model('ChecklistTemplate', checklistTemplateSchema);

async function insertAllTemplates() {
    try {
        // Read all templates
        const templates = [
            { file: 'service_a_template.json', type: 'Service A' },
            { file: 'service_b_template.json', type: 'Service B' },
            { file: 'service_c_template.json', type: 'Service C' }
        ];

        console.log('📤 Inserting all service templates to MongoDB Atlas...\n');

        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected!\n');

        for (const { file, type } of templates) {
            const template = JSON.parse(fs.readFileSync(file, 'utf-8'));

            console.log(`📋 Processing: ${template.nom}`);
            console.log(`   Type: ${template.type}`);
            console.log(`   Tasks: ${template.taches.length}`);

            // Check if exists
            const existing = await ChecklistTemplate.findOne({ type });

            if (existing) {
                console.log(`   ⚠️  Already exists. Updating...`);
                await ChecklistTemplate.findByIdAndUpdate(existing._id, template);
                console.log(`   ✅ Updated!\n`);
            } else {
                const result = await ChecklistTemplate.create(template);
                console.log(`   ✅ Created! ID: ${result._id}\n`);
            }
        }

        await mongoose.connection.close();
        console.log('🎉 Done! All 3 service templates are ready.');
        console.log('   Refresh your dashboard to see them.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

insertAllTemplates();
