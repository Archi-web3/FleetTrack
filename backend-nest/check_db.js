const mongoose = require('mongoose');
const uri = 'mongodb+srv://dbGestiondeplacement:ftiS24t2mofJnEVb@cluster0.662bzca.mongodb.net/DB_gestion-des-deplacements?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  
  // Find RP user
  const users = await db.collection('utilisateurs').find({ nom: /RP/i }).toArray();
  console.log('--- RP USERS ---');
  users.forEach(u => console.log(u.nom, u.email, 'pays:', u.pays, 'base:', u.base));

  // Check some recent lieux to see if they have pays
  const lieux = await db.collection('lieux').find().sort({ _id: -1 }).limit(5).toArray();
  console.log('\n--- RECENT LIEUX ---');
  lieux.forEach(l => console.log(l.nom, 'pays:', l.pays, 'base:', l.base));
  
  mongoose.disconnect();
}
check();
