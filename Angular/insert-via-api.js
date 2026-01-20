const fs = require('fs');
const https = require('https');

// Read template
const template = JSON.parse(fs.readFileSync('service_a_template.json', 'utf-8'));

// API endpoint
const options = {
    hostname: 'fleettrack-api.onrender.com',
    port: 443,
    path: '/api/maintenance/template',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // You'll need to add your auth token here
        'x-auth-token': process.env.AUTH_TOKEN || 'YOUR_TOKEN_HERE'
    }
};

const data = JSON.stringify(template);

console.log('📤 Sending template to API...');
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
            console.log('\n✅ Template created successfully!');
            console.log(JSON.parse(responseData));
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
