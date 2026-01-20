const https = require('https');

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dGlsaXNhdGV1ciI6eyJpZCI6IjY5MzgzZDM0NzkwMGM1NzUyNmYzZjMxNSIsIm5vbSI6IkFkbWluIFJEQyIsInByb2ZpbCI6IkFkbWluIiwicGF5cyI6eyJpZCI6IjY5MzdmZjM0OTAwNzRlNjhhZGUzYzA3NCIsIm5vbSI6IlJEQyIsImNvZGUiOiJSREMifSwiYmFzZSI6eyJpZCI6IjY5MzdmZjUyOTAwNzRlNjhhZGUzYzA3YiIsIm5vbSI6IkdvbWEifX0sImlhdCI6MTc2ODQwMDc3NiwiZXhwIjoxNzY4NDg3MTc2fQ.0e-WTH-1rbTviO4JX6QKxLv0SqRkpIZHLw3WkrZaAAs';

function getVehicles() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'fleettrack-api.onrender.com',
            port: 443,
            path: '/api/vehicules',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': JWT_TOKEN
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try {
                    const vehicles = JSON.parse(responseData);
                    resolve(vehicles);
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function inspectVehicle() {
    try {
        const vehicles = await getVehicles();
        const mob002 = vehicles.find(v => v.acfCode === 'MOB-002' || v.immatriculation === 'CD-FG-HJ');

        if (mob002) {
            console.log('🚗 Véhicule trouvé:');
            console.log(`   ID: ${mob002._id}`);
            console.log(`   Immatriculation: ${mob002.immatriculation}`);
            console.log(`   Km Initial: ${mob002.kilometrageInitial}`);
            console.log(`   Km Actuel: ${mob002.kilometrage}`);
        } else {
            console.log('❌ Véhicule MOB-002 non trouvé');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

inspectVehicle();
