const mongoose = require('mongoose');
const uri = 'mongodb+srv://dbGestiondeplacement:ftiS24t2mofJnEVb@cluster0.662bzca.mongodb.net/DB_gestion-des-deplacements?retryWrites=true&w=majority&appName=Cluster0';

const UtilisateurSchema = new mongoose.Schema({
  nom: String,
  email: String,
  pays: { type: mongoose.Schema.Types.ObjectId, ref: 'Pays' },
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' },
});
const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema);

async function check() {
  await mongoose.connect(uri);
  const rp = await Utilisateur.findOne({ nom: /RP/i }).exec();
  console.log('Mongoose Find RP:', rp.nom, 'pays:', rp.pays, 'pays typeof:', typeof rp.pays);
  console.log('Is pays truthy?', !!rp.pays);
  mongoose.disconnect();
}
check();
