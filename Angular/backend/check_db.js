const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

async function checkDatabase() {
    try {
        console.log('=== VÉRIFICATION BASE DE DONNÉES ===\n');
        console.log('URI de connexion:', MONGODB_URI);

        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connecté à MongoDB\n');

        const db = mongoose.connection.db;
        console.log('Nom de la base de données:', db.databaseName);

        // Lister toutes les collections
        const collections = await db.listCollections().toArray();
        console.log('\nCollections dans cette base:');
        for (const coll of collections) {
            const count = await db.collection(coll.name).countDocuments();
            console.log(`  - ${coll.name}: ${count} documents`);
        }

        // Compter les utilisateurs
        const userCount = await db.collection('utilisateurs').countDocuments();
        console.log(`\n✓ Total utilisateurs: ${userCount}`);

        if (userCount > 0) {
            const users = await db.collection('utilisateurs').find({}).limit(5).toArray();
            console.log('\nPremiers utilisateurs:');
            users.forEach(u => {
                console.log(`  - ${u.email} (${u.profil})`);
            });
        }

        process.exit(0);

    } catch (err) {
        console.error('❌ ERREUR:', err.message);
        console.error(err);
        process.exit(1);
    }
}

checkDatabase();
