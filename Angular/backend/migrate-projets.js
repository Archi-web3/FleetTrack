// Script de migration pour créer les projets initiaux
// À exécuter une seule fois pour pré-remplir la base de données

const mongoose = require('mongoose');
const Projet = require('./models/projet.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

const projetsInitiaux = [
    { nom: 'WASH', code: 'WASH-001', description: 'Water, Sanitation and Hygiene', actif: true },
    { nom: 'Nutrition', code: 'NUT-001', description: 'Programme de nutrition', actif: true },
    { nom: 'Support', code: 'SUP-001', description: 'Support et logistique', actif: true },
    { nom: 'Protection', code: 'PROT-001', description: 'Protection des populations', actif: true },
    { nom: 'Santé', code: 'SANTE-001', description: 'Programmes de santé', actif: true },
    { nom: 'Éducation', code: 'EDU-001', description: 'Programmes éducatifs', actif: true },
    { nom: 'Autre', code: 'AUTRE-001', description: 'Autres programmes', actif: true }
];

async function migrateProjets() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté à MongoDB');

        // Vérifier si des projets existent déjà
        const count = await Projet.countDocuments();
        if (count > 0) {
            console.log(`${count} projets existent déjà. Migration annulée.`);
            console.log('Si vous voulez réinitialiser, supprimez d\'abord les projets existants.');
            process.exit(0);
        }

        // Créer les projets initiaux
        console.log('Création des projets initiaux...');
        for (const projetData of projetsInitiaux) {
            const projet = new Projet(projetData);
            await projet.save();
            console.log(`✓ Projet créé: ${projet.nom}`);
        }

        console.log('\n✅ Migration terminée avec succès!');
        console.log(`${projetsInitiaux.length} projets ont été créés.`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        process.exit(1);
    }
}

migrateProjets();
