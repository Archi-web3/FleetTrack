// Run this from backend directory: node seed-templates.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const ChecklistTemplate = require('./models/checklist-template.model');

async function seedServiceA() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected!');

        // Read the template from parent directory
        const templatePath = path.join(__dirname, '..', 'service_a_template.json');
        const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

        console.log(`📋 Loading template: ${templateData.nom}`);
        console.log(`   Type: ${templateData.type}`);
        console.log(`   Tasks: ${templateData.taches.length}`);

        // Check if exists
        const existing = await ChecklistTemplate.findOne({
            type: 'Service A'
        });

        if (existing) {
            console.log('⚠️  Template already exists. Updating...');
            await ChecklistTemplate.findByIdAndUpdate(existing._id, templateData);
            console.log('✅ Updated!');
        } else {
            const template = await ChecklistTemplate.create(templateData);
            console.log('✅ Created!');
            console.log(`   ID: ${template._id}`);
        }

        await mongoose.connection.close();
        console.log('\n🎉 Done!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

seedServiceA();
