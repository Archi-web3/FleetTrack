// Script pour convertir les pays des mouvements en ObjectId
require('dotenv').config();
const mongoose = require('mongoose');
const Mouvement = require('./models/mouvement.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

async function fixMouvementsPaysType() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté à MongoDB\n');

        // Trouver tous les mouvements
        const mouvements = await Mouvement.find();
        console.log(`Total mouvements: ${mouvements.length}\n`);

        let fixed = 0;
        for (const mvt of mouvements) {
            if (mvt.pays) {
                const paysType = typeof mvt.pays;
                const isObjectId = mvt.pays instanceof mongoose.Types.ObjectId;

                console.log(`Mouvement ${mvt._id}:`);
                console.log(`  Pays actuel: ${mvt.pays}`);
                console.log(`  Type: ${paysType}, isObjectId: ${isObjectId}`);

                // Si c'est une string, convertir en ObjectId
                if (paysType === 'string' || !isObjectId) {
                    try {
                        mvt.pays = new mongoose.Types.ObjectId(mvt.pays);
                        await mvt.save();
                        console.log(`  ✅ Converti en ObjectId`);
                        fixed++;
                    } catch (err) {
                        console.log(`  ❌ Erreur conversion: ${err.message}`);
                    }
                } else {
                    console.log(`  ✓ Déjà ObjectId`);
                }
            } else {
                console.log(`Mouvement ${mvt._id}: AUCUN PAYS`);
            }
        }

        console.log(`\n=== RÉSUMÉ ===`);
        console.log(`✅ Mouvements corrigés: ${fixed}`);
        console.log(`\n✅ Terminé !`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

fixMouvementsPaysType();
