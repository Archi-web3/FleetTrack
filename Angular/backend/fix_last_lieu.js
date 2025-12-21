const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Lieu = require('./models/lieu.model');
const Pays = require('./models/pays.model');
const Base = require('./models/base.model');

const MONGODB_URI = process.env.MONGODB_URI;

async function fixLastLieu() {
    try {
        console.log('=== CORRECTION DU DERNIER LIEU CRÉÉ ===\n');

        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connecté à MongoDB\n');

        // Trouver le dernier lieu créé (sans pays/base)
        const lastLieu = await Lieu.findOne({ pays: null }).sort({ _id: -1 });

        if (!lastLieu) {
            console.log('Aucun lieu sans pays trouvé');
            process.exit(0);
        }

        console.log(`Lieu trouvé: ${lastLieu.nom}`);
        console.log(`  Pays actuel: ${lastLieu.pays || 'NULL'}`);
        console.log(`  Base actuelle: ${lastLieu.base || 'NULL'}\n`);

        // Trouver la base Bunia
        const bunia = await Base.findOne({ nom: 'Bunia' });
        if (!bunia) {
            console.error('❌ Base Bunia non trouvée');
            process.exit(1);
        }

        // Trouver le pays RDC
        const rdc = await Pays.findOne({ code: 'RDC' });
        if (!rdc) {
            console.error('❌ Pays RDC non trouvé');
            process.exit(1);
        }

        // Mettre à jour le lieu
        lastLieu.pays = rdc._id;
        lastLieu.base = bunia._id;
        await lastLieu.save();

        console.log(`✓ Lieu mis à jour:`);
        console.log(`  Pays: ${rdc.nom} (${rdc._id})`);
        console.log(`  Base: ${bunia.nom} (${bunia._id})`);

        process.exit(0);

    } catch (err) {
        console.error('❌ ERREUR:', err.message);
        console.error(err);
        process.exit(1);
    }
}

fixLastLieu();
