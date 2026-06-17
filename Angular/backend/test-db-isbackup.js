const mongoose = require('mongoose');
const Mouvement = require('./models/mouvement.model.js');
const Lieu = require('./models/lieu.model.js');
const Utilisateur = require('./models/utilisateur.model.js');

mongoose.connect('mongodb+srv://jonathan:Genet1989%401989@cluster0.zoxd2.mongodb.net/fleettrack?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const mouvement = await Mouvement.findOne({ objectif: /livraison bananes/i }).sort({ createdAt: -1 });
    if(mouvement) {
      console.log('Mouvement trouvé:', mouvement._id);
      console.log('Validation Mode:', mouvement.securityValidationMode);
      mouvement.securityApprovals.forEach(a => {
        console.log(`Validator: ${a.validator}, Status: ${a.status}, isBackup: ${a.isBackup}`);
      });
    } else {
      console.log('Non trouvé');
    }
    process.exit(0);
  });
