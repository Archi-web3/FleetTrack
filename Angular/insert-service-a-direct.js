const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

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

async function insertTemplate() {
    try {
        // Read the Service A template
        const template = JSON.parse(fs.readFileSync('service_a_template.json', 'utf-8'));

        console.log('📤 Inserting Service A template to MongoDB...');
        console.log(`   Name: ${template.nom}`);
        console.log(`   Type: ${template.type}`);
        console.log(`   Tasks: ${template.taches.length}`);

        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!');

        // Check if exists
        const existing = await ChecklistTemplate.findOne({ type: 'Service A' });

        if (existing) {
            console.log('⚠️  Template Service A already exists. Updating...');
            await ChecklistTemplate.findByIdAndUpdate(existing._id, template);
            console.log('✅ Template updated!');
        } else {
            const result = await ChecklistTemplate.create(template);
            console.log('✅ Template Service A created successfully!');
            console.log(`   ID: ${result._id}`);
        }

        await mongoose.connection.close();
        console.log('\n🎉 Done! Refresh your dashboard to see the template.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

insertTemplate();
