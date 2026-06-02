// Script pour retirer le pays des SuperAdmin
// SuperAdmin ne doit pas avoir de pays assigné

require('dotenv').config();
const mongoose = require('mongoose');
const Utilisateur = require('./models/utilisateur.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

async function removeSuperAdminCountry() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté à MongoDB\n');

        // Trouver tous les SuperAdmin
        const superAdmins = await Utilisateur.find({ profil: 'SuperAdmin' });
        console.log(`SuperAdmin trouvés: ${superAdmins.length}\n`);

        let updated = 0;
        for (const admin of superAdmins) {
            if (admin.pays) {
                console.log(`✓ Retrait du pays pour: ${admin.nom} (${admin.email})`);
                admin.pays = null;
                await admin.save();
                updated++;
            } else {
                console.log(`⏭️  ${admin.nom} n'a déjà pas de pays`);
            }
        }

        console.log(`\n=== RÉSUMÉ ===`);
        console.log(`✅ SuperAdmin mis à jour: ${updated}`);
        console.log(`\n✅ Les SuperAdmin peuvent maintenant sélectionner n'importe quel pays !`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

removeSuperAdminCountry();
