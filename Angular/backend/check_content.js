const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://localhost:27017/acf-logbook';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to acf-logbook');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count}`);
        }
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('❌ Error:', err);
    });
