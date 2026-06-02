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

console.log('📤 Sending Service A template to API...');
console.log(`   Name: ${template.nom}`);
console.log(`   Type: ${template.type}`);
console.log(`   Tasks: ${template.taches.length}`);

const req = https.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
            console.log('\n✅ Template Service A created successfully!');
            try {
                const result = JSON.parse(responseData);
                console.log(`   ID: ${result._id}`);
                console.log(`   Tasks: ${result.taches.length}`);
            } catch (e) {
                console.log(responseData);
            }
        } else {
            console.log(`\n❌ Error: ${res.statusCode}`);
            console.log(responseData);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request failed:', error);
});

req.write(data);
req.end();
