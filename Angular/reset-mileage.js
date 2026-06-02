const https = require('https');

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dGlsaXNhdGV1ciI6eyJpZCI6IjY5MzgzZDM0NzkwMGM1NzUyNmYzZjMxNSIsIm5vbSI6IkFkbWluIFJEQyIsInByb2ZpbCI6IkFkbWluIiwicGF5cyI6eyJpZCI6IjY5MzdmZjM0OTAwNzRlNjhhZGUzYzA3NCIsIm5vbSI6IlJEQyIsImNvZGUiOiJSREMifSwiYmFzZSI6eyJpZCI6IjY5MzdmZjUyOTAwNzRlNjhhZGUzYzA3YiIsIm5vbSI6IkdvbWEifX0sImlhdCI6MTc2ODQwMDc3NiwiZXhwIjoxNzY4NDg3MTc2fQ.0e-WTH-1rbTviO4JX6QKxLv0SqRkpIZHLw3WkrZaAAs';
const VEHICLE_ID = '6939c69a1e421df54f38bde6';

function updateVehicle() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            kilometrage: 150000
        });

        const options = {
            hostname: 'fleettrack-api.onrender.com',
            port: 443,
            path: `/api/vehicules/${VEHICLE_ID}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
                'x-auth-token': JWT_TOKEN
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function fixMileage() {
    try {
        console.log('🔧 Correction du kilométrage pour MOB-002...');
        const result = await updateVehicle();

        if (result.vehicule) {
            console.log('✅ Véhicule mis à jour avec succès');
            console.log(`   Nouveau Km Actuel: ${result.vehicule.kilometrage}`);
            console.log(`   Services générés/mis à jour: ${result.servicesGeneres || 0}`);
        } else {
            console.log('❌ Erreur de mise à jour:', result);
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

fixMileage();
