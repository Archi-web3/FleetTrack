const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://localhost:27017/admin'; // Connect to admin to list dbs

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB Admin');
        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const list = await admin.listDatabases();
        console.log('Databases:', list.databases);
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('❌ Error:', err);
    });
