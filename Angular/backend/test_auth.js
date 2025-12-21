const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Utilisateur = require('./models/utilisateur.model');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

async function testAuth() {
    try {
        console.log('=== TEST AUTHENTIFICATION ===\n');

        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connecté à MongoDB\n');

        // 1. Chercher le SuperAdmin
        console.log('1. Recherche du SuperAdmin...');
        const user = await Utilisateur.findOne({ email: 'superadmin@acf.org' });

        if (!user) {
            console.log('✗ ERREUR: SuperAdmin non trouvé!');
            process.exit(1);
        }

        console.log('✓ SuperAdmin trouvé:');
        console.log('  - Email:', user.email);
        console.log('  - Nom:', user.nom);
        console.log('  - Profil:', user.profil);
        console.log('  - Hash du mot de passe:', user.motDePasse.substring(0, 20) + '...');

        // 2. Tester la comparaison de mot de passe
        console.log('\n2. Test de comparaison du mot de passe...');
        const testPassword = '123456';
        console.log('  Mot de passe testé:', testPassword);

        const isMatch = await user.comparePassword(testPassword);
        console.log('  Résultat de comparePassword():', isMatch);

        if (isMatch) {
            console.log('✓ SUCCÈS: Le mot de passe correspond!');
        } else {
            console.log('✗ ÉCHEC: Le mot de passe ne correspond PAS!');
            console.log('\n--- DIAGNOSTIC ---');
            console.log('Le hash stocké semble incorrect.');
            console.log('Recréation du SuperAdmin avec un nouveau hash...\n');

            // Supprimer et recréer
            await Utilisateur.deleteOne({ email: 'superadmin@acf.org' });
            const newAdmin = new Utilisateur({
                nom: 'Super Admin',
                email: 'superadmin@acf.org',
                motDePasse: '123456',
                profil: 'SuperAdmin'
            });
            await newAdmin.save();
            console.log('✓ SuperAdmin recréé');

            // Re-tester
            const userRetest = await Utilisateur.findOne({ email: 'superadmin@acf.org' });
            const isMatchRetest = await userRetest.comparePassword('123456');
            console.log('✓ Re-test:', isMatchRetest ? 'SUCCÈS' : 'ÉCHEC');
        }

        console.log('\n=== FIN DU TEST ===');
        process.exit(0);

    } catch (err) {
        console.error('❌ ERREUR:', err.message);
        console.error(err);
        process.exit(1);
    }
}

testAuth();
