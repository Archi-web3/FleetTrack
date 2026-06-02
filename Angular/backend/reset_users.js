const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Utilisateur = require('./models/utilisateur.model');
const Base = require('./models/base.model');
const Pays = require('./models/pays.model');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';

async function resetUsers() {
    try {
        console.log('Connexion à MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté. Attention : Suppression de TOUS les utilisateurs...');

        // 1. SUPPRIMER les utilisateurs existants
        await Utilisateur.deleteMany({});
        console.log('Utilisateurs supprimés.');

        // 2. RÉCUPÉRER le contexte (Pays/Base)
        const baseGoma = await Base.findOne({ nom: 'Goma' });
        const paysRDC = await Pays.findOne({ code: 'RDC' });

        if (!baseGoma || !paysRDC) {
            // Si pas de base/pays, on crée juste le SuperAdmin pour bootstrap
            console.log("Attention: Goma/RDC introuvables. Seul SuperAdmin sera créé.");
        }

        // 3. RECRÉER les comptes par défaut
        console.log('Création des comptes (mdp: 123456)...');

        // SUPER ADMIN
        const superAdmin = new Utilisateur({
            nom: 'Super Admin',
            email: 'superadmin@acf.org',
            motDePasse: '123456',
            profil: 'SuperAdmin'
        });
        await superAdmin.save();
        console.log(`- Compte créé : ${superAdmin.email} (SuperAdmin)`);

        if (baseGoma && paysRDC) {
            // Admin RDC (Goma)
            const adminRDC = new Utilisateur({
                nom: 'Admin RDC',
                email: 'admin@acf-rdc.org',
                motDePasse: '123456',
                profil: 'Admin',
                base: baseGoma._id,
                pays: paysRDC._id
            });
            await adminRDC.save();
            console.log(`- Compte créé : ${adminRDC.email} (Base: Goma)`);

            // Superviseur Charroi
            const superviseur = new Utilisateur({
                nom: 'Chef Charroi',
                email: 'charroi@acf-rdc.org',
                motDePasse: '123456',
                profil: 'Superviseur',
                base: baseGoma._id,
                pays: paysRDC._id
            });
            await superviseur.save();
            console.log(`- Compte créé : ${superviseur.email} (Base: Goma)`);

            // Chauffeur 1
            const chauffeur1 = new Utilisateur({
                nom: 'Chauffeur Muhindo',
                email: 'muhindo@acf-rdc.org',
                motDePasse: '123456',
                profil: 'Chauffeur',
                base: baseGoma._id,
                pays: paysRDC._id,
                prenom: 'Paul',
                telephone: '0999999999',
                permis: 'B, C',
                disponible: true
            });
            await chauffeur1.save();
            console.log(`- Compte créé : ${chauffeur1.email} (Base: Goma)`);
        }

        console.log('Réinitialisation terminée.');
        process.exit(0);

    } catch (err) {
        console.error('Erreur:', err);
        process.exit(1);
    }
}

resetUsers();
