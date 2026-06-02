// Script pour créer les pays initiaux dans la base de données
// À exécuter une seule fois pour initialiser les pays

const mongoose = require('mongoose');
const Pays = require('./models/pays.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

const paysInitiaux = [
    { nom: 'République Démocratique du Congo', code: 'RDC', devise: 'USD' },
    { nom: 'République Centrafricaine', code: 'RCA', devise: 'XAF' },
    { nom: 'Mali', code: 'MLI', devise: 'XOF' },
    { nom: 'Niger', code: 'NER', devise: 'XOF' },
    { nom: 'Tchad', code: 'TCD', devise: 'XAF' }
];

async function createInitialCountries() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté à MongoDB');

        // Vérifier si des pays existent déjà
        const existingCount = await Pays.countDocuments();
        if (existingCount > 0) {
            console.log(`\n⚠️  ${existingCount} pays déjà présents dans la base de données.`);
            console.log('Voulez-vous vraiment ajouter les pays initiaux ? (Ctrl+C pour annuler)\n');
        }

        let created = 0;
        let skipped = 0;

        for (const paysData of paysInitiaux) {
            try {
                // Vérifier si le pays existe déjà
                const existing = await Pays.findOne({ code: paysData.code });
                if (existing) {
                    console.log(`⏭️  Pays ${paysData.nom} (${paysData.code}) existe déjà`);
                    skipped++;
                } else {
                    const pays = new Pays(paysData);
                    await pays.save();
                    console.log(`✅ Pays créé: ${paysData.nom} (${paysData.code})`);
                    created++;
                }
            } catch (err) {
                console.error(`❌ Erreur pour ${paysData.nom}:`, err.message);
            }
        }

        console.log('\n=== RÉSUMÉ ===');
        console.log(`✅ Pays créés: ${created}`);
        console.log(`⏭️  Pays ignorés (déjà existants): ${skipped}`);
        console.log('\n✅ Initialisation terminée !');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        process.exit(1);
    }
}

createInitialCountries();
