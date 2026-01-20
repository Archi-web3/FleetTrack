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

async function syncManualReferences() {
    console.log('🔄 Synchronisation des références du manuel...\n');

    try {
        // 1. Fetch all templates
        console.log('📋 Récupération des templates...');
        const templates = await makeRequest('GET', '/api/maintenance/template');

        const serviceA = templates.find(t => t.type === 'Service A');
        const serviceB = templates.find(t => t.type === 'Service B');
        const serviceC = templates.find(t => t.type === 'Service C');
        const weekly = templates.find(t => t.type === 'Hebdomadaire');

        if (!serviceA) {
            console.log('❌ Service A template not found');
            return;
        }

        console.log(`✅ Service A trouvé avec ${serviceA.taches.length} tâches\n`);

        // 2. Create a map of Service A tasks by normalized description
        const serviceAMap = new Map();
        serviceA.taches.forEach(task => {
            if (task.numeroTacheManuel) {
                const normalized = normalizeDescription(task.description);
                serviceAMap.set(normalized, task.numeroTacheManuel);
            }
        });

        console.log(`📖 ${serviceAMap.size} tâches du Service A ont des références au manuel\n`);

        // 3. Update other templates
        const templatesToUpdate = [
            { template: serviceB, name: 'Service B' },
            { template: serviceC, name: 'Service C' },
            { template: weekly, name: 'Checklist Hebdomadaire' }
        ];

        for (const { template, name } of templatesToUpdate) {
            if (!template) {
                console.log(`⚠️  ${name} non trouvé, ignoré\n`);
                continue;
            }

            console.log(`🔍 Traitement de ${name}...`);
            let updated = 0;

            template.taches.forEach(task => {
                const normalized = normalizeDescription(task.description);
                const manualRef = serviceAMap.get(normalized);

                if (manualRef && task.numeroTacheManuel !== manualRef) {
                    console.log(`   ✏️  "${task.description.substring(0, 50)}..." → Ref: ${manualRef}`);
                    task.numeroTacheManuel = manualRef;
                    updated++;
                }
            });

            if (updated > 0) {
                console.log(`   💾 Sauvegarde de ${name} (${updated} tâches mises à jour)...`);
                await makeRequest('PUT', `/api/maintenance/template/${template._id}`, template);
                console.log(`   ✅ ${name} mis à jour\n`);
            } else {
                console.log(`   ℹ️  Aucune mise à jour nécessaire\n`);
            }
        }

        console.log('🎉 Synchronisation terminée!');

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

syncManualReferences();
