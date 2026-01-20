const https = require('https');

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dGlsaXNhdGV1ciI6eyJpZCI6IjY5MzgzZDM0NzkwMGM1NzUyNmYzZjMxNSIsIm5vbSI6IkFkbWluIFJEQyIsInByb2ZpbCI6IkFkbWluIiwicGF5cyI6eyJpZCI6IjY5MzdmZjM0OTAwNzRlNjhhZGUzYzA3NCIsIm5vbSI6IlJEQyIsImNvZGUiOiJSREMifSwiYmFzZSI6eyJpZCI6IjY5MzdmZjUyOTAwNzRlNjhhZGUzYzA3YiIsIm5vbSI6IkdvbWEifX0sImlhdCI6MTc2ODQwMDc3NiwiZXhwIjoxNzY4NDg3MTc2fQ.0e-WTH-1rbTviO4JX6QKxLv0SqRkpIZHLw3WkrZaAAs';

// Template data
const templates = {
    'Service A': require('./service_a_template.json'),
    'Service B': require('./service_b_template.json'),
    'Service C': require('./service_c_template.json')
};

function makeRequest(method, path, data = null) {
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

        if (data) {
            const jsonData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(jsonData);
        }

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(responseData));
                    } catch (e) {
                        resolve(responseData);
                    }
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function updateExistingServices() {
    console.log('🔄 Mise à jour des services existants avec les tâches des templates...\n');

    try {
        // 1. Récupérer tous les services non complétés
        console.log('📋 Récupération des services...');
        const services = await makeRequest('GET', '/api/maintenance/service/alerts');

        console.log(`   Trouvé ${services.length} service(s) à mettre à jour\n`);

        let updated = 0;
        let skipped = 0;
        let errors = 0;

        for (const service of services) {
            const serviceType = `Service ${service.typeService}`;
            const template = templates[serviceType];

            if (!template) {
                console.log(`   ⚠️  Service ${service._id} (${serviceType}) - Pas de template`);
                skipped++;
                continue;
            }

            // Vérifier si le service a déjà des tâches
            if (service.taches && service.taches.length > 0) {
                console.log(`   ⏭️  Service ${service._id} (${serviceType}) - Déjà ${service.taches.length} tâches`);
                skipped++;
                continue;
            }

            // Copier les tâches du template
            const taches = template.taches.map(t => ({
                description: t.description,
                numeroTacheManuel: t.numeroTacheManuel,
                categorie: t.categorie,
                validee: false,
                dateValidation: null,
                commentaire: ''
            }));

            try {
                await makeRequest('PUT', `/api/maintenance/service/${service._id}/tasks`, { taches });
                console.log(`   ✅ Service ${service._id} (${serviceType}) - ${taches.length} tâches ajoutées`);
                updated++;
            } catch (error) {
                console.log(`   ❌ Service ${service._id} (${serviceType}) - Erreur: ${error.message}`);
                errors++;
            }
        }

        console.log('\n📊 Résumé:');
        console.log(`   ✅ Mis à jour: ${updated}`);
        console.log(`   ⏭️  Ignorés: ${skipped}`);
        console.log(`   ❌ Erreurs: ${errors}`);
        console.log('\n🎉 Terminé! Rafraîchissez le e-logbook pour voir les tâches.');

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

updateExistingServices();
