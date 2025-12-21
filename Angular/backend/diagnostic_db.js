const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Utilisateur = require('./models/utilisateur.model');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

async function checkAndCreateUsers() {
    try {
        console.log('=== DIAGNOSTIC MONGODB ===');
        console.log('URI de connexion:', MONGODB_URI);

        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connecté à MongoDB');

        // Vérifier la base de données actuelle
        const dbName = mongoose.connection.db.databaseName;
        console.log('Base de données active:', dbName);

        // Compter les utilisateurs existants
        const count = await Utilisateur.countDocuments();
        console.log('Nombre d\'utilisateurs existants:', count);

        if (count > 0) {
            console.log('\n--- Utilisateurs existants ---');
            const users = await Utilisateur.find({}, 'nom email profil');
            users.forEach(u => console.log(`  - ${u.email} (${u.profil})`));
        }

        // Supprimer TOUS les utilisateurs
        console.log('\n⚠️  Suppression de tous les utilisateurs...');
        await Utilisateur.deleteMany({});
        console.log('✓ Utilisateurs supprimés');

        // Créer le SuperAdmin
        console.log('\n--- Création du SuperAdmin ---');
        const superAdmin = new Utilisateur({
            nom: 'Super Admin',
            email: 'superadmin@acf.org',
            motDePasse: '123456',
            profil: 'SuperAdmin'
        });
        await superAdmin.save();
        console.log('✓ SuperAdmin créé:', superAdmin.email);

        // Vérifier la création
        const verification = await Utilisateur.findOne({ email: 'superadmin@acf.org' });
        if (verification) {
            console.log('✓ VÉRIFICATION: SuperAdmin trouvé dans la DB');
            console.log('  ID:', verification._id);
            console.log('  Profil:', verification.profil);
        } else {
            console.log('✗ ERREUR: SuperAdmin non trouvé après création!');
        }

        console.log('\n=== FIN DU DIAGNOSTIC ===');
        process.exit(0);

    } catch (err) {
        console.error('❌ ERREUR:', err.message);
        console.error(err);
        process.exit(1);
    }
}

checkAndCreateUsers();
