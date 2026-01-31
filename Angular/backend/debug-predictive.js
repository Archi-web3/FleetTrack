const mongoose = require('mongoose');
const predictiveService = require('./services/predictive-maintenance.service');
const MONGODB_URI = 'mongodb://localhost:27017/acf-logbook'; // Force check this DB

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        console.log('--- Testing with userCountry = "All" ---');
        const resultsAll = await predictiveService.getFleetHealthPrediction('All');
        console.log('Total Vehicles (All):', resultsAll.totalVehicles);
        console.log('Global Health:', resultsAll.globalHealth);

        console.log('--- Testing with userCountry = "France" (Example) ---');
        const resultsFr = await predictiveService.getFleetHealthPrediction('France');
        console.log('Total Vehicles (France):', resultsFr.totalVehicles);

        mongoose.disconnect();
    })
    .catch(err => {
        console.error('❌ Error:', err);
    });
