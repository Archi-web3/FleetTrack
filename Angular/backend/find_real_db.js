const mongoose = require('mongoose');

const dbs = [
    'acf-logbook',
    'admin',
    'config',
    'deplacements',
    'fleettrack',
    'gestionDeplacementsACF',
    'local'
];

async function checkDb(dbName) {
    const uri = `mongodb://localhost:27017/${dbName}`;
    try {
        const conn = await mongoose.createConnection(uri).asPromise();
        const collections = await conn.db.listCollections().toArray();
        console.log(`\nChecking DB: ${dbName}`);

        for (const col of collections) {
            if (col.name.toLowerCase().includes('vehic') || col.name.toLowerCase().includes('vehicle')) {
                const count = await conn.db.collection(col.name).countDocuments();
                console.log(`  - Found collection '${col.name}' with ${count} docs`);

                if (count > 0) {
                    const sample = await conn.db.collection(col.name).findOne({});
                    console.log(`    Sample: ${JSON.stringify(sample).substring(0, 100)}...`);

                    // Look for Citroen
                    const citroen = await conn.db.collection(col.name).findOne({ $or: [{ marque: /Citroen/i }, { model: /Citroen/i }] });
                    if (citroen) {
                        console.log(`    ✅ FOUND CITROEN in ${dbName}.${col.name}! This is the one!`);
                    }
                }
            }
        }
        await conn.close();
    } catch (e) {
        console.log(`  Error connecting to ${dbName}: ${e.message}`);
    }
}

async function run() {
    for (const db of dbs) {
        await checkDb(db);
    }
}

run();
