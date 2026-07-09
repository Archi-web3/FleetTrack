const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error("MONGODB_URI is missing in environment variables.");
  process.exit(1);
}

const countries = [
  { code: 'AF', nom: 'Afghanistan', nomEn: 'Afghanistan', devise: 'AFN' },
  { code: 'BD', nom: 'Bangladesh', nomEn: 'Bangladesh', devise: 'BDT' },
  { code: 'BF', nom: 'Burkina Faso', nomEn: 'Burkina Faso', devise: 'XOF' },
  { code: 'CM', nom: 'Cameroun', nomEn: 'Cameroon', devise: 'XAF' },
  { code: 'CF', nom: 'République centrafricaine', nomEn: 'Central African Republic', devise: 'XAF' },
  { code: 'TD', nom: 'Tchad', nomEn: 'Chad', devise: 'XAF' },
  { code: 'CG', nom: 'Congo', nomEn: 'Congo', devise: 'XAF' },
  { code: 'DJ', nom: 'Djibouti', nomEn: 'Djibouti', devise: 'DJF' },
  { code: 'FR', nom: 'France', nomEn: 'France', devise: 'EUR' },
  { code: 'IN', nom: 'Inde', nomEn: 'India', devise: 'INR' },
  { code: 'ID', nom: 'Indonésie', nomEn: 'Indonesia', devise: 'IDR' },
  { code: 'IQ', nom: 'Irak', nomEn: 'Iraq', devise: 'IQD' },
  { code: 'CI', nom: 'Côte d\'Ivoire', nomEn: 'Ivory Coast', devise: 'XOF' },
  { code: 'JO', nom: 'Jordanie', nomEn: 'Jordan', devise: 'JOD' },
  { code: 'LR', nom: 'Libéria', nomEn: 'Liberia', devise: 'LRD' },
  { code: 'LY', nom: 'Libye', nomEn: 'Libya', devise: 'LYD' },
  { code: 'MG', nom: 'Madagascar', nomEn: 'Madagascar', devise: 'MGA' },
  { code: 'MZ', nom: 'Mozambique', nomEn: 'Mozambique', devise: 'MZN' },
  { code: 'MM', nom: 'Birmanie', nomEn: 'Myanmar', devise: 'MMK' },
  { code: 'NG', nom: 'Nigéria', nomEn: 'Nigeria', devise: 'NGN' },
  { code: 'NP', nom: 'Népal', nomEn: 'Nepal', devise: 'NPR' },
  { code: 'PK', nom: 'Pakistan', nomEn: 'Pakistan', devise: 'PKR' },
  { code: 'SL', nom: 'Sierra Leone', nomEn: 'Sierra Leone', devise: 'SLL' },
  { code: 'SO', nom: 'Somalie', nomEn: 'Somalia', devise: 'SOS' },
  { code: 'UA', nom: 'Ukraine', nomEn: 'Ukraine', devise: 'UAH' },
  { code: 'YE', nom: 'Yémen', nomEn: 'Yemen', devise: 'YER' },
  { code: 'ZW', nom: 'Zimbabwe', nomEn: 'Zimbabwe', devise: 'ZWL' },
  { code: 'RO', nom: 'RomPol', nomEn: 'RomPol', devise: 'RON' }, // Custom region probably
  { code: 'TH', nom: 'Thaïlande', nomEn: 'Thailand', devise: 'THB' },
  { code: 'SY', nom: 'Syrie', nomEn: 'Syria', devise: 'SYP' },
  { code: 'LB', nom: 'Liban', nomEn: 'Lebanon', devise: 'LBP' }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    const paysCollection = mongoose.connection.collection('pays');

    for (const c of countries) {
      const existing = await paysCollection.findOne({ code: c.code });
      if (existing) {
        console.log(`Updating ${c.nom}...`);
        await paysCollection.updateOne(
          { code: c.code },
          { $set: { nomEn: c.nomEn, nom: c.nom, devise: c.devise } }
        );
      } else {
        console.log(`Inserting ${c.nom}...`);
        await paysCollection.insertOne({
          nom: c.nom,
          nomEn: c.nomEn,
          code: c.code,
          devise: c.devise,
          parametres: { fuseauHoraire: 'UTC' },
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
