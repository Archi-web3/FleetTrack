const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

// Import the ChecklistTemplate model
const ChecklistTemplate = require('./backend/models/checklist-template.model');

async function insertTemplate() {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Read the template JSON
        const templateData = JSON.parse(
            fs.readFileSync('service_a_template.json', 'utf-8')
        );

        // Check if template already exists
        const existing = await ChecklistTemplate.findOne({
            type: 'Service A',
            nom: templateData.nom
        });

        if (existing) {
            console.log('⚠️  Template "Service A" already exists. Updating...');
            await ChecklistTemplate.findByIdAndUpdate(existing._id, templateData);
            console.log('✅ Template updated successfully!');
        } else {
            // Create new template
            const template = await ChecklistTemplate.create(templateData);
            console.log('✅ Template created successfully!');
            console.log(`   ID: ${template._id}`);
            console.log(`   Name: ${template.nom}`);
            console.log(`   Tasks: ${template.taches.length}`);
        }

        // Close connection
        await mongoose.connection.close();
        console.log('\n🎉 Done!');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

insertTemplate();
