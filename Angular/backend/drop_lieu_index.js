const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

async function dropUniqueIndex() {
    try {
        console.log('=== SUPPRESSION INDEX UNIQUE SUR LIEU.NOM ===\n');

        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connecté à MongoDB\n');

        const db = mongoose.connection.db;
        const collection = db.collection('lieus'); // Mongoose pluralise automatiquement

        // Lister les index existants
        console.log('Index existants sur la collection "lieus":');
        const indexes = await collection.indexes();
        indexes.forEach(index => {
            console.log(`  - ${index.name}:`, JSON.stringify(index.key));
        });

        // Supprimer l'index unique sur 'nom'
        try {
            await collection.dropIndex('nom_1');
            console.log('\n✓ Index "nom_1" supprimé avec succès');
        } catch (err) {
            if (err.code === 27) {
                console.log('\n⚠️  Index "nom_1" n\'existe pas (déjà supprimé)');
            } else {
                throw err;
            }
        }

        console.log('\n=== TERMINÉ ===');
        process.exit(0);

    } catch (err) {
        console.error('❌ ERREUR:', err.message);
        console.error(err);
        process.exit(1);
    }
}

dropUniqueIndex();
