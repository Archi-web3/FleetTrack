// Script pour assigner un pays aux données existantes
// À exécuter pour migrer les données vers le système multi-pays

require('dotenv').config();
const mongoose = require('mongoose');
const Utilisateur = require('./models/utilisateur.model');
const Vehicule = require('./models/vehicule.model');
const Base = require('./models/base.model');
const Lieu = require('./models/lieu.model');
const Mouvement = require('./models/mouvement.model');
const Pays = require('./models/pays.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

async function assignCountryToExistingData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté à MongoDB\n');

        // Demander quel pays assigner (ou utiliser le premier trouvé)
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

        let stats = {
            utilisateurs: 0,
            vehicules: 0,
            bases: 0,
            lieux: 0,
            mouvements: 0
        };

        // 1. Utilisateurs sans pays
        const utilisateursSansPays = await Utilisateur.find({
            $or: [
                { pays: { $exists: false } },
                { pays: null }
            ]
        });
        console.log(`Utilisateurs sans pays: ${utilisateursSansPays.length}`);
        for (const user of utilisateursSansPays) {
            user.pays = paysParDefaut._id;
            await user.save();
            stats.utilisateurs++;
        }

        // 2. Véhicules sans pays
        const vehiculesSansPays = await Vehicule.find({
            $or: [
                { pays: { $exists: false } },
                { pays: null }
            ]
        });
        console.log(`Véhicules sans pays: ${vehiculesSansPays.length}`);
        for (const vehicule of vehiculesSansPays) {
            vehicule.pays = paysParDefaut._id;
            await vehicule.save();
            stats.vehicules++;
        }

        // 3. Bases sans pays
        const basesSansPays = await Base.find({
            $or: [
                { pays: { $exists: false } },
                { pays: null }
            ]
        });
        console.log(`Bases sans pays: ${basesSansPays.length}`);
        for (const base of basesSansPays) {
            base.pays = paysParDefaut._id;
            await base.save();
            stats.bases++;
        }

        // 4. Lieux sans pays (via leur base)
        const lieuxSansPays = await Lieu.find().populate('base');
        console.log(`Lieux à vérifier: ${lieuxSansPays.length}`);
        for (const lieu of lieuxSansPays) {
            if (lieu.base && lieu.base.pays) {
                // Le lieu hérite du pays de sa base
                console.log(`  Lieu ${lieu.nom} → pays via base ${lieu.base.nom}`);
            }
        }

        // 5. Mouvements sans pays
        const mouvementsSansPays = await Mouvement.find({
            $or: [
                { pays: { $exists: false } },
                { pays: null }
            ]
        });
        console.log(`Mouvements sans pays: ${mouvementsSansPays.length}`);
        for (const mvt of mouvementsSansPays) {
            mvt.pays = paysParDefaut._id;
            await mvt.save();
            stats.mouvements++;
        }

        console.log('\n=== RÉSUMÉ ===');
        console.log(`✅ Utilisateurs mis à jour: ${stats.utilisateurs}`);
        console.log(`✅ Véhicules mis à jour: ${stats.vehicules}`);
        console.log(`✅ Bases mises à jour: ${stats.bases}`);
        console.log(`✅ Mouvements mis à jour: ${stats.mouvements}`);
        console.log(`\n✅ Migration terminée ! Toutes les données sont assignées au pays: ${paysParDefaut.nom}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        process.exit(1);
    }
}

assignCountryToExistingData();
