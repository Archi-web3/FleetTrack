const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Lieu = require('./models/lieu.model');
const Pays = require('./models/pays.model');
const Base = require('./models/base.model');

const MONGODB_URI = process.env.MONGODB_URI;

async function fixAllLieuxWithoutBase() {
    try {
        console.log('=== CORRECTION DE TOUS LES LIEUX SANS PAYS/BASE ===\n');

        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connecté à MongoDB\n');

        // Trouver le pays RDC
        const rdc = await Pays.findOne({ code: 'RDC' });
        if (!rdc) {
            console.error('❌ Pays RDC non trouvé');
            process.exit(1);
        }

        // Trouver la base Bunia
        const bunia = await Base.findOne({ nom: 'Bunia' });
        if (!bunia) {
            console.error('❌ Base Bunia non trouvée');
            process.exit(1);
        }

        // Trouver tous les lieux sans pays/base
        const lieuxSansBase = await Lieu.find({
            $or: [
                { pays: { $exists: false } },
                { pays: null },
                { base: { $exists: false } },
                { base: null }
            ]
        });

        console.log(`Lieux sans pays/base trouvés: ${lieuxSansBase.length}\n`);

        if (lieuxSansBase.length === 0) {
            console.log('Aucun lieu à corriger');
            process.exit(0);
        }

        // Afficher les lieux qui seront corrigés
        console.log('Lieux qui seront assignés à Bunia:');
        lieuxSansBase.forEach(lieu => {
            console.log(`  - ${lieu.nom}`);
        });

        // Mettre à jour tous les lieux
        const result = await Lieu.updateMany(
            {
                $or: [
                    { pays: { $exists: false } },
                    { pays: null },
                    { base: { $exists: false } },
                    { base: null }
                ]
            },
            {
                $set: {
                    pays: rdc._id,
                    base: bunia._id
                }
            }
        );

        console.log(`\n✓ ${result.modifiedCount} lieux mis à jour avec:`);
        console.log(`  - Pays: ${rdc.nom} (${rdc._id})`);
        console.log(`  - Base: ${bunia.nom} (${bunia._id})`);

        process.exit(0);

    } catch (err) {
        console.error('❌ ERREUR:', err.message);
        console.error(err);
        process.exit(1);
    }
}

fixAllLieuxWithoutBase();
