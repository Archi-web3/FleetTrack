const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Utiliser l'URI Atlas sans spécifier de base de données
const ATLAS_URI = process.env.ATLAS_URI || process.env.MONGODB_URI;

if (!ATLAS_URI) {
    console.error("❌ ERREUR: La variable d'environnement ATLAS_URI ou MONGODB_URI n'est pas définie.");
    process.exit(1);
}

async function listAllDatabases() {
    try {
        console.log('=== LISTE DES BASES DE DONNÉES SUR ATLAS ===\n');

        await mongoose.connect(ATLAS_URI);
        console.log('✓ Connecté à MongoDB Atlas\n');

        const adminDb = mongoose.connection.db.admin();
        const { databases } = await adminDb.listDatabases();

        console.log('Bases de données trouvées:');
        for (const db of databases) {
            console.log(`\n📁 ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);

            // Se connecter à chaque base pour lister les collections
            const database = mongoose.connection.client.db(db.name);
            const collections = await database.listCollections().toArray();

            if (collections.length > 0) {
                console.log('   Collections:');
                for (const coll of collections) {
                    const count = await database.collection(coll.name).countDocuments();
                    if (count > 0) {
                        console.log(`   - ${coll.name}: ${count} documents`);
                    }
                }
            }
        }

        process.exit(0);

    } catch (err) {
        console.error('❌ ERREUR:', err.message);
        console.error(err);
        process.exit(1);
    }
}

listAllDatabases();
