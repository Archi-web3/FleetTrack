const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Lieu = require('./models/lieu.model');
const Pays = require('./models/pays.model');
const Base = require('./models/base.model');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkLieux() {
    try {
        console.log('=== VÉRIFICATION DES LIEUX ===\n');

        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connecté à MongoDB\n');

        const lieux = await Lieu.find().populate('pays').populate('base');

        console.log(`Total lieux: ${lieux.length}\n`);

        let withPays = 0;
        let withBase = 0;
        let withoutPays = 0;
        let withoutBase = 0;

        console.log('Détail des lieux:');
        lieux.forEach((lieu, index) => {
            console.log(`\n${index + 1}. ${lieu.nom}`);
            console.log(`   Adresse: ${lieu.adresse}`);
            console.log(`   Pays: ${lieu.pays ? lieu.pays.nom : 'NON ASSIGNÉ'}`);
            console.log(`   Base: ${lieu.base ? lieu.base.nom : 'NON ASSIGNÉE'}`);

            if (lieu.pays) withPays++;
            else withoutPays++;

            if (lieu.base) withBase++;
            else withoutBase++;
        });

        console.log('\n=== STATISTIQUES ===');
        console.log(`Lieux avec pays: ${withPays}`);
        console.log(`Lieux sans pays: ${withoutPays}`);
        console.log(`Lieux avec base: ${withBase}`);
        console.log(`Lieux sans base: ${withoutBase}`);

        process.exit(0);

    } catch (err) {
        console.error('❌ ERREUR:', err.message);
        console.error(err);
        process.exit(1);
    }
}

checkLieux();
