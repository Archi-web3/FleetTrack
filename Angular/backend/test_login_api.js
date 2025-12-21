const axios = require('axios');

async function testLogin() {
    try {
        console.log('=== TEST LOGIN API ===\n');
        console.log('Tentative de connexion à http://localhost:3000/api/auth/login');
        console.log('Email: superadmin@acf.org');
        console.log('Password: 123456\n');

        const response = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'superadmin@acf.org',
            motDePasse: '123456'
        });

        console.log('✓ SUCCÈS!');
        console.log('Status:', response.status);
        console.log('Token reçu:', response.data.token ? 'OUI' : 'NON');
        console.log('User:', response.data.user);

    } catch (error) {
        console.log('✗ ÉCHEC!');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Message:', error.response.data);
        } else if (error.request) {
            console.log('❌ ERREUR: Pas de réponse du serveur');
            console.log('Le backend n\'est probablement PAS démarré sur le port 3000');
        } else {
            console.log('❌ ERREUR:', error.message);
        }
    }
}

testLogin();
