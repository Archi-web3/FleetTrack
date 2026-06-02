const https = require('https');

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dGlsaXNhdGV1ciI6eyJpZCI6IjY5MzgzZDM0NzkwMGM1NzUyNmYzZjMxNSIsIm5vbSI6IkFkbWluIFJEQyIsInByb2ZpbCI6IkFkbWluIiwicGF5cyI6eyJpZCI6IjY5MzdmZjM0OTAwNzRlNjhhZGUzYzA3NCIsIm5vbSI6IlJEQyIsImNvZGUiOiJSREMifSwiYmFzZSI6eyJpZCI6IjY5MzdmZjUyOTAwNzRlNjhhZGUzYzA3YiIsIm5vbSI6IkdvbWEifX0sImlhdCI6MTc2ODQwMDc3NiwiZXhwIjoxNzY4NDg3MTc2fQ.0e-WTH-1rbTviO4JX6QKxLv0SqRkpIZHLw3WkrZaAAs';

console.log('🔄 Peuplement des services existants avec les tâches des templates...\n');

const options = {
    hostname: 'fleettrack-api.onrender.com',
    port: 443,
    path: '/api/maintenance/service/populate-tasks',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': 2,
        'x-auth-token': JWT_TOKEN
    }
};

const req = https.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            const result = JSON.parse(responseData);
            console.log('✅ Succès!');
            console.log(`   Total: ${result.total} service(s)`);
            console.log(`   Mis à jour: ${result.updated}`);
            console.log(`   Ignorés: ${result.skipped}`);
            console.log('\n🎉 Terminé! Rafraîchissez le e-logbook pour voir les tâches.');
        } else {
            console.log(`❌ Erreur ${res.statusCode}`);
            console.log(responseData);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Erreur:', error.message);
});

req.write('{}');
req.end();
