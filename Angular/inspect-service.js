const https = require('https');

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dGlsaXNhdGV1ciI6eyJpZCI6IjY5MzgzZDM0NzkwMGM1NzUyNmYzZjMxNSIsIm5vbSI6IkFkbWluIFJEQyIsInByb2ZpbCI6IkFkbWluIiwicGF5cyI6eyJpZCI6IjY5MzdmZjM0OTAwNzRlNjhhZGUzYzA3NCIsIm5vbSI6IlJEQyIsImNvZGUiOiJSREMifSwiYmFzZSI6eyJpZCI6IjY5MzdmZjUyOTAwNzRlNjhhZGUzYzA3YiIsIm5vbSI6IkdvbWEifX0sImlhdCI6MTc2ODQwMDc3NiwiZXhwIjoxNzY4NDg3MTc2fQ.0e-WTH-1rbTviO4JX6QKxLv0SqRkpIZHLw3WkrZaAAs';
const VEHICLE_ID = '6939c69a1e421df54f38bde6'; // MOB-002

function makeRequest(method, path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'fleettrack-api.onrender.com',
            port: 443,
            path: path,
            method: method,
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
                    resolve(JSON.parse(responseData));
                } catch (e) {
                    resolve(responseData);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function inspectService() {
    try {
        console.log('🔍 Inspection du prochain service pour MOB-002...');
        const service = await makeRequest('GET', `/api/maintenance/service/next?vehicule=${VEHICLE_ID}`);

        if (service && service.taches) {
            console.log(`✅ Service trouvé: ${service.typeService}`);
            console.log(`📊 Nombre de tâches: ${service.taches.length}`);

            console.log('\n📝 5 premières tâches:');
            service.taches.slice(0, 5).forEach((t, i) => {
                console.log(`   ${i + 1}. [Ref: "${t.numeroTacheManuel || ''}"] ${t.description.substring(0, 50)}...`);
            });
        } else {
            console.log('❌ Aucun service trouvé ou pas de tâches');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

inspectService();
