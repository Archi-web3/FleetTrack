const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Pays = require('./models/pays.model');
const Base = require('./models/base.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

async function createPaysAndBases() {
    try {
        console.log('=== CRÉATION PAYS ET BASES DANS ATLAS ===\n');

        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connecté à MongoDB Atlas\n');

        // Vérifier si RDC existe déjà
        let rdc = await Pays.findOne({ code: 'RDC' });

        if (!rdc) {
            console.log('Création du pays RDC...');
            rdc = await Pays.create({
                nom: 'République Démocratique du Congo',
                code: 'RDC',
                devise: 'USD'
            });
            console.log('✓ Pays RDC créé');
        } else {
            console.log('✓ Pays RDC existe déjà');
        }

        // Vérifier si Goma existe déjà
        let goma = await Base.findOne({ nom: 'Goma', pays: rdc._id });

        if (!goma) {
            console.log('Création de la base Goma...');
            goma = await Base.create({
                nom: 'Goma',
                code: 'GOM',
                pays: rdc._id
            });
            console.log('✓ Base Goma créée');
        } else {
            console.log('✓ Base Goma existe déjà');
        }

        // Créer d'autres bases si nécessaire
        const autresBases = [
            { nom: 'Kinshasa', code: 'KIN' },
            { nom: 'Bukavu', code: 'BUK' }
        ];

        for (const baseData of autresBases) {
            const existingBase = await Base.findOne({ nom: baseData.nom, pays: rdc._id });
            if (!existingBase) {
                await Base.create({
                    ...baseData,
                    pays: rdc._id
                });
                console.log(`✓ Base ${baseData.nom} créée`);
            } else {
                console.log(`✓ Base ${baseData.nom} existe déjà`);
            }
        }

        console.log('\n=== TERMINÉ ===');
        console.log(`Pays ID: ${rdc._id}`);
        console.log(`Base Goma ID: ${goma._id}`);

        process.exit(0);

    } catch (err) {
        console.error('❌ ERREUR:', err.message);
        console.error(err);
        process.exit(1);
    }
}

createPaysAndBases();
