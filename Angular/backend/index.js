require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const mouvementsRoute = require('./routes/mouvements');
const utilisateursRoute = require('./routes/utilisateurs');
const vehiculesRoute = require('./routes/vehicules');
const chauffeursRoute = require('./routes/chauffeurs');
const authRoute = require('./routes/auth');
const lieuxRoute = require('./routes/lieux');
const paysRoute = require('./routes/pays');
const basesRoute = require('./routes/bases');
const projetsRoute = require('./routes/projets');
const maintenanceRoute = require('./routes/maintenance'); // Route maintenance existante
const maintenanceTrackingRoute = require('./routes/maintenance-tracking'); // Nouvelle route tracking
// const auth = require('./middleware/authMiddleware'); // <<< Ne pas l'importer ici


// NOUVEAU : Importez le modèle Mouvement ici
const Mouvement = require('./models/mouvement.model'); // <<< AJOUTEZ CETTE LIGNE

const app = express();
const port = 3000;

// Middleware CORS et JSON (nécessaires)
app.use(cors());
app.use(express.json());

// NOUVEAU : Middleware de log générique global (pour voir si ça passe avant le auth)
app.use((req, res, next) => {
    console.log(`[GLOBAL MW] ${req.method} ${req.originalUrl}`);
    next();
});

// Connexion à MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/acf-logbook';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Route de test du mouvement (temporairement ici, non protégée)
app.post('/api/mouvements/test', async (req, res) => {
    console.log('Requête reçue sur /api/mouvements/test (NON PROTÉGÉE, dans index.js)');
    try {
        const nouveauMouvement = new Mouvement({ // Il faut importer Mouvement ici
            stops: [
                { lieu: '691ccf5fb73cc314cea638c8', dateDepart: new Date('2025-11-19T09:00:00Z'), dateArrivee: new Date('2025-11-19T09:05:00Z') },
                { lieu: '691ccfa5b73cc314cea638cb', dateDepart: new Date('2025-11-19T10:00:00Z'), dateArrivee: new Date('2025-11-19T10:05:00Z') }
            ],
            demandeur: '691725d3c84274956b8afba3',
            vehicule: '691727c0f7f497a0465224d1',
            chauffeur: '69172905fbfec25232433f2e',
            objectif: 'Test depuis le backend',
            statut: 'en attente'
        });
        const savedMouvement = await nouveauMouvement.save();
        console.log('Mouvement de test créé:', savedMouvement);
        res.status(201).json(savedMouvement);
    } catch (err) {
        console.error('Erreur lors de la création du mouvement de test:', err);
        res.status(500).json({ message: err.message });
    }
});


// ROUTES : AUCUN app.use(auth()) global ICI !
app.use('/api', mouvementsRoute);
app.use('/api', utilisateursRoute);
app.use('/api', vehiculesRoute);
app.use('/api', chauffeursRoute);
app.use('/api/auth', authRoute);
app.use('/api', lieuxRoute);
app.use('/api/pays', paysRoute);
app.use('/api/bases', basesRoute);
app.use('/api', projetsRoute);

// NOUVEAU : Routes pour le e-Logbook
const logbookRoute = require('./routes/logbook');
app.use('/api/logbook', logbookRoute);

// NOUVEAU : Routes pour les statistiques
const statsRoute = require('./routes/stats');
app.use('/api/stats', statsRoute);

// NOUVEAU : Routes pour l'upload de photos (Cloudinary)
const uploadRoute = require('./routes/upload');
app.use('/api', uploadRoute);

// NOUVEAU : Routes pour la maintenance
const maintenanceRoute = require('./routes/maintenance');
app.use('/api/maintenance', maintenanceRoute);
app.use('/api/maintenance-tracking', maintenanceTrackingRoute);

// NOUVEAU : Routes pour les paramètres généraux
const settingsRoute = require('./routes/settings');
app.use('/api/settings', settingsRoute);

// NOUVEAU : Démarrer les tâches CRON de maintenance
const { startCronJobs } = require('./jobs/maintenance-cron');
const { initializeTemplate } = require('./init-checklist-template');

// Initialiser le template de checklist au démarrage
mongoose.connection.once('open', async () => {
    console.log('📋 Initialisation du template de checklist...');
    await initializeTemplate();
    console.log('🚀 Démarrage des tâches CRON...');
    startCronJobs();
});



// Route de test (page d'accueil du backend)
app.get('/', (req, res) => {
    res.send('Bienvenue sur le backend de Gestion des Déplacements!');
});

// Démarrage du serveur
app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${port} (accessible depuis le réseau)`);
});
