const mongoose = require('mongoose');
const Mouvement = require('./models/mouvement.model.js');
mongoose.connect('mongodb://localhost:27017/acf-logbook').then(async () => {
  const m = await Mouvement.find({objectif: "livraison bananes"}).sort({_id: -1}).limit(4);
  console.log(m.map(x => ({id: x._id, pays: x.pays, demandeur: x.demandeur, base: x.base})));
  process.exit();
}).catch(e => { console.error(e); process.exit(); });
