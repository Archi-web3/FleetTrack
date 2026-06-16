const mongoose = require('mongoose');
const Mouvement = require('./models/mouvement.model');
require('dotenv').config();

mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const all = await Mouvement.find();
    const found = all.find(x => x._id.toString().endsWith('d9cb'));
    if (found) {
        console.log("Found:", found._id);
        console.log("Statut global:", found.statut);
        console.log("Statut secu:", found.statutSecurite);
        console.log("Statut log:", found.statutLogistique);
        console.log("SecurityApprovals:", found.securityApprovals.length);
        console.log("validationLevelRequired:", found.validationLevelRequired);
    } else {
        console.log("Not found any ending with d9cb");
    }
    process.exit(0);
  });
