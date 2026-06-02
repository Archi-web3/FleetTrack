const https = require('https');
const fs = require('fs');

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dGlsaXNhdGV1ciI6eyJpZCI6IjY5MzgzZDM0NzkwMGM1NzUyNmYzZjMxNSIsIm5vbSI6IkFkbWluIFJEQyIsInByb2ZpbCI6IkFkbWluIiwicGF5cyI6eyJpZCI6IjY5MzdmZjM0OTAwNzRlNjhhZGUzYzA3NCIsIm5vbSI6IlJEQyIsImNvZGUiOiJSREMifSwiYmFzZSI6eyJpZCI6IjY5MzdmZjUyOTAwNzRlNjhhZGUzYzA3YiIsIm5vbSI6IkdvbWEifX0sImlhdCI6MTc2ODQwMDc3NiwiZXhwIjoxNzY4NDg3MTc2fQ.0e-WTH-1rbTviO4JX6QKxLv0SqRkpIZHLw3WkrZaAAs';

function createTemplate(templateFile, templateType) {
    return new Promise((resolve, reject) => {
        const template = JSON.parse(fs.readFileSync(templateFile, 'utf-8'));
        const data = JSON.stringify(template);

        const options = {
            hostname: 'fleettrack-api.onrender.com',
            port: 443,
            path: '/api/maintenance/template',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
                'x-auth-token': JWT_TOKEN
            }
        };

        console.log(`\n📋 Creating ${templateType}...`);
        console.log(`   Name: ${template.nom}`);
        console.log(`   Tasks: ${template.taches.length}`);

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 201 || res.statusCode === 200) {
                    console.log(`   ✅ ${templateType} created successfully!`);
                    try {
                        const result = JSON.parse(responseData);
                        console.log(`   ID: ${result._id}`);
                        resolve(result);
                    } catch (e) {
                        resolve(responseData);
                    }
                } else {
                    console.log(`   ❌ Error ${res.statusCode}`);
                    console.log(`   Response: ${responseData.substring(0, 200)}`);
                    reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error(`   ❌ Request failed:`, error.message);
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

async function createAllTemplates() {
    console.log('🚀 Creating all service templates via Render API...');

    try {
        await createTemplate('service_a_template.json', 'Service A');
        await createTemplate('service_b_template.json', 'Service B');
        await createTemplate('service_c_template.json', 'Service C');

        console.log('\n🎉 All templates created successfully!');
        console.log('   Refresh your dashboard to see them.');
    } catch (error) {
        console.error('\n❌ Failed to create templates:', error.message);
        process.exit(1);
    }
}

createAllTemplates();
