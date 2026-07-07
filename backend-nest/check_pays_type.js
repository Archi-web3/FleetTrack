const mongoose = require('mongoose');
const uri = 'mongodb+srv://dbGestiondeplacement:ftiS24t2mofJnEVb@cluster0.662bzca.mongodb.net/DB_gestion-des-deplacements?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  
  const user = await db.collection('utilisateurs').findOne({ nom: /RP/i });
  console.log('Raw user from DB:', user.nom, 'pays:', user.pays, 'pays typeof:', typeof user.pays);
  console.log('Is pays an ObjectId?', user.pays instanceof mongoose.Types.ObjectId);
  
  const lieu = await db.collection('lieus').findOne();
  console.log('Raw lieu from DB:', lieu.nom, 'pays:', lieu.pays, 'pays typeof:', typeof lieu.pays);
  console.log('Is pays an ObjectId?', lieu.pays instanceof mongoose.Types.ObjectId);
  
  mongoose.disconnect();
}
check();
