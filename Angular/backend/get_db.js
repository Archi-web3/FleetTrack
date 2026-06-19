const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const Mouvement = require('./models/mouvement.model');
    const m = await Mouvement.find({ objectif: /MOB-002/ }).populate('vehicule', 'immatriculation');
    console.log("Mouvements:", JSON.stringify(m, null, 2));
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
