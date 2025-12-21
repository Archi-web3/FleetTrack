const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pays = require('./models/pays.model');
const Base = require('./models/base.model');
const Utilisateur = require('./models/utilisateur.model');
const Vehicule = require('./models/vehicule.model');

// Charger les variables d'environnement
dotenv.config();

// Configuration
// Note: Adaptez l'URI si nécessaire ou assurez-vous que .env est bien chargé
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

async function seedMultiTenancy() {
    try {
        console.log('Connexion à MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté !');

        // 1. Créer le Pays par défaut (RDC)
        let rdc = await Pays.findOne({ code: 'RDC' });
        if (!rdc) {
            console.log('Création du Pays : RDC...');
            rdc = new Pays({
                nom: 'République Démocratique du Congo',
                code: 'RDC',
                devise: 'USD'
            });
            await rdc.save();
        } else {
            console.log('Pays RDC existe déjà.');
        }

        // 2. Créer les Bases (Goma, Kinshasa, Bunia, etc.)
        const basesData = ['Goma', 'Kinshasa', 'Bunia'];
        const basesMap = {}; // Pour stocker les IDs : { 'Goma': ObjectId(...) }

        for (const nomBase of basesData) {
            let base = await Base.findOne({ nom: nomBase, pays: rdc._id });
            if (!base) {
                console.log(`Création de la Base : ${nomBase}...`);
                base = new Base({
                    nom: nomBase,
                    pays: rdc._id
                });
                await base.save();
            }
            basesMap[nomBase] = base._id;
        }

        // Gérer une base "Par Défaut" pour les orphelins (ex: Goma si non spécifié)
        const defaultBaseId = basesMap['Goma'];

        // 3. Migrer les VÉHICULES
        console.log('Migration des Véhicules...');
        const vehicules = await Vehicule.find({});
        for (const v of vehicules) {
            // Si v.base est une String (l'ancien champ, récupéré via _doc ou lean si schema strict, 
            // mais ici mongoose peut le cacher si le schema a changé. 
            // Astuce: On vérifie si 'base' est un ObjectId valide.

            // Note: Comme on a changé le Schema, Mongoose va essayer de caster.
            // Si la valeur en DB est "Goma" (string) et le Schema attend ObjectId, 
            // Mongoose peut renvoyer une erreur CastelError à la lecture ou null.

            // Pour éviter les soucis de Schema Strict qui masquent l'ancienne valeur string,
            // on peut faire un updateMany basé sur des critères bruts si on connaissait les valeurs,
            // mais itérer est plus sûr pour la logique.

            // ATTENTION : Avec le nouveau Schema, accèder à v.base peut planter si c'est une string invalide pour ObjectId.
            // On va supposer que pour l'instant, les champs sont peut-être inaccessibles proprement via Mongoose typé.
            // Une approche robuste est d'utiliser updateMany direct.
        }

        // Approche Robuste : UpdateMany pour chaque base connue
        for (const [nomBase, idBase] of Object.entries(basesMap)) {
            // Met à jour tous les véhicules où la base était stockée comme string "Goma" (dans la collection brute)
            // Mongoose permet parfois de requêter sur l'ancien type si on bypass la validation, 
            // ou alors on utilise db.collection.updateMany natif.

            // On va utiliser le driver natif pour contourner le Schema strict de Mongoose temporairement
            const resultV = await mongoose.connection.collection('vehicules').updateMany(
                { base: nomBase }, // Cherche la string "Goma"
                { $set: { base: idBase } } // Remplace par l'ObjectId
            );
            console.log(`Véhicules migrés de "${nomBase}" vers ${idBase} : ${resultV.modifiedCount}`);

            // Idem pour Utilisateurs (si ils avaient un champ base, sinon on les met par défaut)
            // Le modèle Utilisateur n'avait pas de champ 'base' avant, donc on assigne par défaut ?
            // Ou on laisse vide ? D'après la demande, on assigne.
            // On va assigner "Goma" par défaut aux Admins existants pour tester.
        }

        // Assigner une base par défaut aux véhicules sans base
        const resultVDefault = await mongoose.connection.collection('vehicules').updateMany(
            { base: { $exists: false } },
            { $set: { base: defaultBaseId } }
        );
        console.log(`Véhicules sans base assignés à Goma par défaut : ${resultVDefault.modifiedCount}`);

        // Assigner une base par défaut aux Utilisateurs (S'ils n'en ont pas)
        // On met tout le monde à Goma pour l'instant pour ne bloquer personne.
        const resultU = await mongoose.connection.collection('utilisateurs').updateMany(
            { base: { $exists: false } },
            { $set: { base: defaultBaseId, pays: rdc._id } }
        );
        console.log(`Utilisateurs assignés à Goma par défaut : ${resultU.modifiedCount}`);

        // 4. Migrer les MOUVEMENTS (orphelins)
        console.log('Migration des Mouvements...');
        // Assigner une base par défaut aux mouvements sans base
        const resultM = await mongoose.connection.collection('mouvements').updateMany(
            { base: { $exists: false } },
            { $set: { base: defaultBaseId } }
        );
        console.log(`Mouvements sans base assignés à Goma par défaut : ${resultM.modifiedCount}`);

        console.log('Migration terminée avec succès !');
        process.exit(0);

    } catch (err) {
        console.error('Erreur lors de la migration:', err);
        process.exit(1);
    }
}

seedMultiTenancy();
