const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Lieu = require('./models/lieu.model');
const Pays = require('./models/pays.model');
const Base = require('./models/base.model');

const MONGODB_URI = process.env.MONGODB_URI;

async function assignPaysBaseToLieux() {
    try {
        console.log('=== ASSIGNATION PAYS/BASE AUX LIEUX ===\n');

        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connecté à MongoDB\n');

        // Trouver le pays RDC
        const rdc = await Pays.findOne({ code: 'RDC' });
        if (!rdc) {
            console.error('❌ Pays RDC non trouvé');
            process.exit(1);
        }
        console.log(`✓ Pays RDC trouvé: ${rdc._id}`);

        // Trouver la base Goma
        const goma = await Base.findOne({ nom: 'Goma', pays: rdc._id });
        if (!goma) {
            console.error('❌ Base Goma non trouvée');
            process.exit(1);
        }
        console.log(`✓ Base Goma trouvée: ${goma._id}\n`);

        // Trouver tous les lieux sans pays/base
        const lieuxSansPays = await Lieu.find({
            $or: [
                { pays: { $exists: false } },
                { pays: null }
            ]
        });

        console.log(`Lieux sans pays: ${lieuxSansPays.length}`);

        if (lieuxSansPays.length === 0) {
            console.log('Aucun lieu à mettre à jour');
            process.exit(0);
        }

        // Mettre à jour tous les lieux
        const result = await Lieu.updateMany(
            {
                $or: [
                    { pays: { $exists: false } },
                    { pays: null }
                ]
            },
            {
                $set: {
                    pays: rdc._id,
                    base: goma._id
                }
            }
        );

        console.log(`\n✓ ${result.modifiedCount} lieux mis à jour avec:`);
        console.log(`  - Pays: ${rdc.nom} (${rdc.code})`);
        console.log(`  - Base: ${goma.nom}`);

        // Vérification
        const lieuxMisAJour = await Lieu.find().populate('pays').populate('base');
        console.log('\n=== VÉRIFICATION ===');
        lieuxMisAJour.forEach(lieu => {
            console.log(`✓ ${lieu.nom} - Pays: ${lieu.pays?.nom || 'N/A'}, Base: ${lieu.base?.nom || 'N/A'}`);
        });

        process.exit(0);

    } catch (err) {
        console.error('❌ ERREUR:', err.message);
        console.error(err);
        process.exit(1);
    }
}

assignPaysBaseToLieux();
