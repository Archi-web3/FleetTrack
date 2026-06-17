const mongoose = require('mongoose');
const SecurityConfig = require('./models/security-config.model.js');

mongoose.connect('mongodb+srv://jonathan:Genet1989%401989@cluster0.zoxd2.mongodb.net/fleettrack?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const configs = await SecurityConfig.find({});
    console.log(`Found ${configs.length} configs.`);
    configs.forEach(c => {
      console.log(`Config Pays: ${c.pays}, Base: ${c.base}`);
      c.rules.forEach(r => {
         console.log(`  Level ${r.level}: ${r.mandatoryValidators.length} validators`);
      });
    });
    process.exit(0);
  });
