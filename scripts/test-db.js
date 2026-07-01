const mongoose = require('mongoose');
const Mouvement = require('./Angular/backend/models/mouvement.model.js');
mongoose.connect('mongodb+srv://admin:1kHl2ZXYVnJgWw1Y@cluster0.p0qnn.mongodb.net/fleettrack?retryWrites=true&w=majority').then(async () => {
  const m = await Mouvement.find({objectif: "livraison bananes"}).sort({_id: -1}).limit(4);
  console.log(m.map(x => ({id: x._id, pays: x.pays, demandeur: x.demandeur, base: x.base})));
  process.exit();
});
