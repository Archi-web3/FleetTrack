const https = require('https');

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dGlsaXNhdGV1ciI6eyJpZCI6IjY5MzgzZDM0NzkwMGM1NzUyNmYzZjMxNSIsIm5vbSI6IkFkbWluIFJEQyIsInByb2ZpbCI6IkFkbWluIiwicGF5cyI6eyJpZCI6IjY5MzdmZjM0OTAwNzRlNjhhZGUzYzA3NCIsIm5vbSI6IlJEQyIsImNvZGUiOiJSREMifSwiYmFzZSI6eyJpZCI6IjY5MzdmZjUyOTAwNzRlNjhhZGUzYzA3YiIsIm5vbSI6IkdvbWEifX0sImlhdCI6MTc2ODQwMDc3NiwiZXhwIjoxNzY4NDg3MTc2fQ.0e-WTH-1rbTviO4JX6QKxLv0SqRkpIZHLw3WkrZaAAs';

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

// Normalize task description for comparison
function normalizeDescription(desc) {
    if (!desc) return '';
    return desc.toLowerCase()
        .replace(/[éèê]/g, 'e')
        .replace(/[àâ]/g, 'a')
        .replace(/[îï]/g, 'i')
        .replace(/[ôö]/g, 'o')
        .replace(/[ùûü]/g, 'u')
        .replace(/ç/g, 'c')
        .replace(/[^\w\s]/g, '')
        .trim();
}

async function refreshServiceRefs() {
    console.log('🔄 Mise à jour des références manuel dans les services actifs...\n');

    try {
        // 1. Fetch all templates
        console.log('📋 Récupération des templates...');
        const templates = await makeRequest('GET', '/api/maintenance/template');
        console.log(`   ${templates.length} templates récupérés\n`);

        // Create map of templates by type
        const templatesByType = {};
        templates.forEach(t => {
            // "Service A", "Service B", etc.
            if (t.type.startsWith('Service')) {
                // Short key: "A", "B", "C"
                const typeKey = t.type.replace('Service ', '').trim();
                templatesByType[typeKey] = t;
            }
        });

        // 2. Fetch pending services (alerts + others if possible via populate-tasks GET logic, 
        // but let's assume we want to fix ALL open services. 
        // Since we don't have a GET /all active services, we'll iterate active vehicles or use the alerts endpoint 
        // which returns DUE/OVERDUE/UPCOMING services?)
        // Actually /api/maintenance/service/alerts returns Due/Overdue.
        // But the user might be looking at an "À venir" service.
        // Let's rely on finding ALL active vehicles and their active service.

        console.log('🚗 Récupération des véhicules...');
        const vehicles = await makeRequest('GET', '/api/vehicules');
        console.log(`   ${vehicles.length} véhicules trouvés\n`);

        let totalUpdated = 0;

        for (const vehicle of vehicles) {
            // Get active service for each vehicle
            try {
                const service = await makeRequest('GET', `/api/maintenance/service/next?vehicule=${vehicle._id}`);

                if (!service || !service.taches || service.taches.length === 0) {
                    continue;
                }

                // Find corresponding template
                const template = templatesByType[service.typeService];
                if (!template) {
                    console.log(`⚠️  Pas de template trouvé pour Service ${service.typeService} (Véhicule ${vehicle.immatriculation})`);
                    continue;
                }

                // Create a map of template tasks
                const templateTaskMap = new Map();
                template.taches.forEach(t => {
                    if (t.numeroTacheManuel) {
                        templateTaskMap.set(normalizeDescription(t.description), t.numeroTacheManuel);
                    }
                });

                // Update service tasks
                let serviceUpdated = false;
                service.taches.forEach(task => {
                    const normalized = normalizeDescription(task.description);
                    const newRef = templateTaskMap.get(normalized);

                    if (newRef && task.numeroTacheManuel !== newRef) {
                        task.numeroTacheManuel = newRef;
                        serviceUpdated = true;
                    }
                });

                if (serviceUpdated) {
                    console.log(`✏️  Mise à jour du Service ${service.typeService} pour ${vehicle.immatriculation}...`);
                    await makeRequest('PUT', `/api/maintenance/service/${service._id}/tasks`, { taches: service.taches });
                    console.log(`   ✅ Tâches mises à jour`);
                    totalUpdated++;
                }

            } catch (err) {
                // Ignore errors (e.g. no next service)
                // console.log(`   (Info: Pas de service actif pour ${vehicle.immatriculation})`);
            }
        }

        console.log(`\n🎉 Terminé! ${totalUpdated} services mis à jour.`);

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

refreshServiceRefs();
