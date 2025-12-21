// Script de test pour vérifier le filtrage par pays
// Teste si le middleware et les routes fonctionnent correctement

require('dotenv').config();
const mongoose = require('mongoose');
const Utilisateur = require('./models/utilisateur.model');
const Pays = require('./models/pays.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

async function testCountryFiltering() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté à MongoDB\n');

        // Lister tous les pays
        const pays = await Pays.find();
        console.log('=== PAYS DISPONIBLES ===');
        pays.forEach(p => console.log(`  ${p.nom} (${p.code}) - ID: ${p._id}`));

        // Lister tous les utilisateurs avec leur pays
        const users = await Utilisateur.find().populate('pays');
        console.log('\n=== UTILISATEURS ===');
        users.forEach(u => {
            const paysNom = u.pays ? u.pays.nom : 'AUCUN';
            console.log(`  ${u.nom} (${u.profil}) → Pays: ${paysNom}`);
        });

        // Test de filtrage manuel
        if (pays.length >= 2) {
            const paysTest = pays[1]; // Deuxième pays (Liban probablement)
            console.log(`\n=== TEST FILTRAGE PAR ${paysTest.nom} ===`);
            const usersFiltered = await Utilisateur.find({ pays: paysTest._id });
            console.log(`Utilisateurs trouvés: ${usersFiltered.length}`);
            usersFiltered.forEach(u => console.log(`  - ${u.nom}`));
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

testCountryFiltering();
