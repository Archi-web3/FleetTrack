const mongoose = require('mongoose');
const uri = 'mongodb+srv://dbGestiondeplacement:ftiS24t2mofJnEVb@cluster0.662bzca.mongodb.net/DB_gestion-des-deplacements?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  
  // Find all collections
  const colls = await db.listCollections().toArray();
  console.log('Collections:', colls.map(c => c.name).join(', '));
  
  const lieux = await db.collection('lieux').find({ pays: { $exists: true } }).limit(5).toArray();
  console.log('Lieux avec pays:', lieux.length);
  const lieuxWithoutPays = await db.collection('lieux').find({ pays: { $exists: false } }).limit(5).toArray();
  console.log('Lieux sans pays:', lieuxWithoutPays.length);
  
  if (lieuxWithoutPays.length > 0) {
    console.log('Exemple sans pays:', lieuxWithoutPays[0]);
  }
  
  mongoose.disconnect();
}
check();
