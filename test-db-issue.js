const mongoose = require('mongoose');

// On ne require pas les models existants pour éviter les problèmes de require cache ou de compilation babel.
// On crée un model barebone juste pour lire
const dbUri = process.env.MONGODB_URI || 'mongodb+srv://jonathan:Genet1989%401989@cluster0.zoxd2.mongodb.net/fleettrack?retryWrites=true&w=majority';

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    
    // Mouvement
    const mouvementSchema = new mongoose.Schema({}, { strict: false });
    const Mouvement = mongoose.model('Mouvement', mouvementSchema, 'mouvements');
    
    const m = await Mouvement.findOne({ objectif: /livraison bananes/i }).sort({ _id: -1 });
    if(m) {
        console.log("=== Mouvement ===");
        console.log("ID:", m._id);
        console.log("Pays:", m.get('pays'));
        console.log("Base:", m.get('base'));
        console.log("ValidationMode:", m.get('securityValidationMode'));
    } else {
        console.log("Aucun mouvement trouvé.");
    }

    // SecurityConfig
    const configSchema = new mongoose.Schema({}, { strict: false });
    const SecurityConfig = mongoose.model('SecurityConfig', configSchema, 'securityconfigs');
    
    const configs = await SecurityConfig.find();
    console.log("\n=== Security Configs ===");
    console.log(`Found ${configs.length} configs`);
    for(let c of configs) {
        console.log("Config ID:", c._id);
        console.log("Pays:", c.get('pays'));
        console.log("Base:", c.get('base'));
        const rules = c.get('rules');
        if(rules && rules.length > 0) {
            let level3 = rules.find(r => r.level === 3);
            if(level3) {
                console.log(`  Level 3 mandatory validators:`, level3.mandatoryValidators);
            }
        }
    }
    
    process.exit(0);
  }).catch(err => {
      console.error(err);
      process.exit(1);
  });
