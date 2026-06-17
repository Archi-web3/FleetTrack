const mongoose = require('mongoose');
const SecurityConfig = require('./models/security-config.model');
const Mouvement = require('./models/mouvement.model');
const Utilisateur = require('./models/utilisateur.model');

mongoose.connect('mongodb+srv://Archi-web3:hLz1Z2Q8n82nCXY6@cluster0.p71v9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    const configs = await SecurityConfig.find().populate('pays', 'nom');
    console.log("CONFIGS IN DB:", JSON.stringify(configs.map(c => ({ pays: c.pays?.nom, base: c.base, rulesCount: c.rules.length })), null, 2));
    
    const mov = await Mouvement.findById('6a32485385d6490d654e4c46');
    if(mov) {
      console.log("MOVEMENT FOUND! Pays:", mov.pays, "Base:", mov.base);
      const conf = await SecurityConfig.findOne({ pays: mov.pays, base: null });
      console.log("Found config for this movement's country:", conf ? "YES" : "NO");
    } else {
      console.log("MOVEMENT 6a32485385d6490d654e4c46 NOT FOUND");
    }

    mongoose.disconnect();
  });
