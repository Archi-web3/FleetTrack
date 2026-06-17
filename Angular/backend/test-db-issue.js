const mongoose = require('mongoose');
const SecurityConfig = require('./models/security-config.model.js');
const Utilisateur = require('./models/utilisateur.model.js');

mongoose.connect('mongodb+srv://jonathan:Genet1989%401989@cluster0.zoxd2.mongodb.net/fleettrack?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to DB");
    const rdcConfigNull = await SecurityConfig.findOne({ base: null });
    console.log("CONFIG NULL:");
    console.log(JSON.stringify(rdcConfigNull, null, 2));

    const allConfigs = await SecurityConfig.find({});
    console.log("ALL CONFIGS COUNT:", allConfigs.length);
    for(let c of allConfigs) {
      if(c.base) console.log("Found config with base:", c.base);
    }

    const users = await Utilisateur.find({ niveauValidationSecu: { $gte: 1 } });
    console.log("\nUSERS:");
    users.forEach(u => {
      if(u.nom === "Genet" || u.prenom === "Jonathan" || u.nom === "CT") {
        console.log(`${u.nom} ${u.prenom} | Profil: ${u.profil} | Niveau: ${u.niveauValidationSecu} | Type: ${typeof u.niveauValidationSecu} | Base: ${u.base}`);
      }
    });

    process.exit(0);
  });
