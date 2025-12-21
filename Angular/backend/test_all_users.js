const axios = require('axios');

async function testAllUsers() {
    const users = [
        { email: 'superadmin@acf.org', password: '123456', name: 'SuperAdmin' },
        { email: 'admin@acf-rdc.org', password: '123456', name: 'Admin RDC' },
        { email: 'charroi@acf-rdc.org', password: '123456', name: 'Superviseur' },
        { email: 'muhindo@acf-rdc.org', password: '123456', name: 'Chauffeur' }
    ];

    console.log('=== TEST DE TOUS LES UTILISATEURS ===\n');

    for (const user of users) {
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email: user.email,
                motDePasse: user.password
            });

            console.log(`✓ ${user.name} (${user.email})`);
            console.log(`  Profil: ${response.data.user.profil}`);
            console.log(`  Token reçu: OUI\n`);

        } catch (error) {
            console.log(`✗ ${user.name} (${user.email})`);
            if (error.response) {
                console.log(`  Erreur: ${error.response.data.message}\n`);
            } else {
                console.log(`  Erreur: Pas de réponse\n`);
            }
        }
    }
}

testAllUsers();
