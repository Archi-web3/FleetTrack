// Script de migration pour assigner les projets aux mouvements existants
// À exécuter une seule fois pour mettre à jour les mouvements existants

require('dotenv').config(); // Charger les variables d'environnement depuis .env

const mongoose = require('mongoose');
const Mouvement = require('./models/mouvement.model');
const Utilisateur = require('./models/utilisateur.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';
console.log('Connexion à:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Masquer le mot de passe

async function migrateMouvementsProjets() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté à MongoDB');

        // Récupérer TOUS les mouvements pour forcer la mise à jour
        const mouvements = await Mouvement.find({}).populate('demandeur').populate('passagers');

        console.log(`\nMouvements trouvés: ${mouvements.length}`);

        let updated = 0;
        let skipped = 0;

        for (const mvt of mouvements) {
            try {
                let changed = false;

                // 1. TOUJOURS assigner le projet du demandeur (même si déjà défini)
                if (mvt.demandeur && mvt.demandeur.projet) {
                    const oldProjet = mvt.projet;
                    mvt.projet = mvt.demandeur.projet;
                    console.log(`✓ Mouvement ${mvt._id}: projet "${mvt.projet}" assigné depuis demandeur ${oldProjet ? `(était: "${oldProjet}")` : ''}`);
                    changed = true;
                } else {
                    console.log(`⚠ Mouvement ${mvt._id}: demandeur sans projet (demandeur: ${mvt.demandeur?.nom || 'N/A'})`);
                }

                // 2. Récupérer les projets des passagers
                if (mvt.passagers && mvt.passagers.length > 0) {
                    const projetsUniques = [...new Set(
                        mvt.passagers
                            .map(p => p.projet)
                            .filter(p => p)
                    )];

                    mvt.projetsPassagers = projetsUniques;

                    if (projetsUniques.length > 1) {
                        console.log(`  → Multi-projets détecté: ${projetsUniques.join(', ')}`);
                    }
                    changed = true;
                }

                if (changed) {
                    await mvt.save();
                    updated++;
                } else {
                    skipped++;
                }

            } catch (err) {
                console.error(`❌ Erreur pour mouvement ${mvt._id}:`, err.message);
            }
        }

        console.log('\n=== RÉSUMÉ ===');
        console.log(`✅ Mouvements mis à jour: ${updated}`);
        console.log(`⏭️  Mouvements ignorés: ${skipped}`);
        console.log('\n✅ Migration terminée avec succès!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
        process.exit(1);
    }
}

migrateMouvementsProjets();
