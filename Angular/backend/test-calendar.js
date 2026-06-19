const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const Mouvement = require('./Angular/backend/models/mouvement.model');
    const vehicules = await mongoose.connection.db.collection('vehicules').find({enService: true}).toArray();
    console.log('vehicules:', vehicules.length);

    const predictiveService = require('./Angular/backend/services/predictive-maintenance.service');
    const aiData = await predictiveService.getFleetHealthPrediction('All');
    console.log('alerts:', aiData.alerts.length);
    process.exit(0);
  })
  .catch(console.error);
