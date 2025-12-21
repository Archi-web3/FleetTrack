const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Utilisateur = require('./models/utilisateur.model');
const Pays = require('./models/pays.model');
const Base = require('./models/base.model');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkUsers() {
    try {
        console.log('=== VÉRIFICATION DES UTILISATEURS ===\n');

        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connecté à MongoDB\n');

        const users = await Utilisateur.find().populate('pays').populate('base');

        console.log(`Total utilisateurs: ${users.length}\n`);

        console.log('Détail des utilisateurs:');
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. ${user.email}`);
            console.log(`   Profil: ${user.profil}`);
            console.log(`   Pays: ${user.pays ? user.pays.nom + ' (ID: ' + user.pays._id + ')' : 'NON ASSIGNÉ'}`);
            console.log(`   Base: ${user.base ? user.base.nom + ' (ID: ' + user.base._id + ')' : 'NON ASSIGNÉE'}`);
        });

        process.exit(0);

    } catch (err) {
        console.error('❌ ERREUR:', err.message);
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
