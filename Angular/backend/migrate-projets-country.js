// Script pour assigner un pays aux projets existants
require('dotenv').config();
const mongoose = require('mongoose');
const Projet = require('./models/projet.model');
const Pays = require('./models/pays.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

async function assignCountryToProjects() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté à MongoDB\n');

        // Trouver tous les pays
        const pays = await Pays.find();
        console.log('Pays disponibles:');
        pays.forEach((p, i) => console.log(`  ${i + 1}. ${p.nom} (${p.code}) - ID: ${p._id}`));

        if (pays.length === 0) {
            console.log('\n❌ Aucun pays trouvé. Exécutez d\'abord init-pays.js');
            process.exit(1);
        }

        // Utiliser le premier pays (RDC probablement)
        const paysParDefaut = pays[0];
        console.log(`\n📍 Assignation du pays par défaut: ${paysParDefaut.nom} (${paysParDefaut._id})\n`);

        // Trouver tous les projets sans pays
        const projetsSansPays = await Projet.find({
            $or: [
                { pays: { $exists: false } },
                { pays: null }
            ]
        });

        console.log(`Projets sans pays: ${projetsSansPays.length}`);

        let updated = 0;
        for (const projet of projetsSansPays) {
            projet.pays = paysParDefaut._id;
            await projet.save();
            console.log(`✅ Projet "${projet.nom}" assigné au pays ${paysParDefaut.nom}`);
            updated++;
        }

        console.log(`\n=== RÉSUMÉ ===`);
        console.log(`✅ Projets mis à jour: ${updated}`);
        console.log(`\n✅ Migration terminée !`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        process.exit(1);
    }
}

assignCountryToProjects();
