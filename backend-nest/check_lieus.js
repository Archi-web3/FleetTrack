const mongoose = require('mongoose');
const uri = 'mongodb+srv://dbGestiondeplacement:ftiS24t2mofJnEVb@cluster0.662bzca.mongodb.net/DB_gestion-des-deplacements?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  
  const lieus = await db.collection('lieus').find().limit(5).toArray();
  console.log('Lieus:', lieus.map(l => ({ nom: l.nom, pays: l.pays })));
  
  mongoose.disconnect();
}
check();
