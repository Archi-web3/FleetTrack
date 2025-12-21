// Script pour vérifier et corriger l'assignation des pays aux mouvements
require('dotenv').config();
const mongoose = require('mongoose');
const Mouvement = require('./models/mouvement.model');
const Pays = require('./models/pays.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

async function checkAndFixMouvements() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté à MongoDB\n');

        // Trouver tous les pays
        const pays = await Pays.find();
        console.log('=== PAYS DISPONIBLES ===');
        pays.forEach(p => console.log(`  ${p.nom} (${p.code}) - ID: ${p._id}`));

        const rdcPays = pays.find(p => p.code === 'RDC');
        if (!rdcPays) {
            console.log('\n❌ Pays RDC non trouvé');
            process.exit(1);
        }

        // Compter tous les mouvements
        const totalMouvements = await Mouvement.countDocuments();
        console.log(`\n=== MOUVEMENTS ===`);
        console.log(`Total mouvements: ${totalMouvements}`);

        // Mouvements sans pays
        const mouvementsSansPays = await Mouvement.find({
            $or: [
                { pays: { $exists: false } },
                { pays: null }
            ]
        });
        console.log(`Mouvements sans pays: ${mouvementsSansPays.length}`);

        // Mouvements par pays
        const mouvementsParPays = await Mouvement.aggregate([
            {
                $group: {
                    _id: '$pays',
                    count: { $sum: 1 }
                }
            }
        ]);
        console.log('\nMouvements par pays:');
        for (const group of mouvementsParPays) {
            const paysObj = pays.find(p => p._id.toString() === (group._id ? group._id.toString() : null));
            const paysNom = paysObj ? paysObj.nom : 'AUCUN';
            console.log(`  ${paysNom}: ${group.count}`);
        }

        // Corriger les mouvements sans pays
        if (mouvementsSansPays.length > 0) {
            console.log(`\n📍 Assignation de ${mouvementsSansPays.length} mouvements au pays RDC...`);
            let updated = 0;
            for (const mvt of mouvementsSansPays) {
                mvt.pays = rdcPays._id;
                await mvt.save();
                updated++;
            }
            console.log(`✅ ${updated} mouvements mis à jour`);
        } else {
            console.log('\n✅ Tous les mouvements ont déjà un pays assigné');
        }

        console.log('\n=== TERMINÉ ===');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

checkAndFixMouvements();
