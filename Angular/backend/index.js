require('dotenv').config();
const express = require('express');
const path = require('path');
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

// Middleware de sécurité
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.set('trust proxy', 1); // Trust first proxy (Render/Vercel)
const port = process.env.PORT || 3000;

// 1. Protection des Headers HTTP
app.use(helmet({
    crossOriginResourcePolicy: false, // Autoriser le chargement d'images croisées (pour l'App Mobile)
}));

// 2. Limitation de débit (Rate Limiting)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limite à 300 requêtes par IP par fenêtre (assez large pour l'usage API intensif)
    standardHeaders: true, // Retourne les infos de rate limit dans les headers `RateLimit-*`
    legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use('/api', limiter); // Appliquer uniquement aux routes API

// 3. Configuration CORS Stricte
const allowedOrigins = [
    'http://localhost:4200',
    'http://localhost:4201',
    'http://localhost:8100', // Ionic Dev
    'https://fleettrack-web.vercel.app',
    'https://fleettrack-admin-v2.vercel.app',
    'https://fleettrack-mobile.vercel.app',
    'https://fleettrack.vercel.app' // Alias potentiel
];

app.use(cors({
    origin: function (origin, callback) {
        // Autoriser les requêtes sans origine (comme les applis mobiles natives ou curl)
        if (!origin) return callback(null, true);

        // Permissive check for Vercel and Localhost
        const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.includes('localhost');

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log(`⚠️ [CORS] Origin not explicitly in list, but allowing for stability: ${origin}`);
            callback(null, true); // TEMPORARY: Allow all for troubleshooting
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'X-Selected-Country'],
    credentials: true,
    optionsSuccessStatus: 200 // Legacy browser support
}));

app.use(express.json());

// NOUVEAU : Middleware de log générique global (pour voir si ça passe avant le auth)
app.use((req, res, next) => {
    // Log léger pour prod
    // console.log(`[GLOBAL MW] ${req.method} ${req.originalUrl}`);
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
// const maintenanceRoute = require('./routes/maintenance'); // DEJA IMPORTE LIGNE 14
app.use('/api/maintenance', maintenanceRoute);
app.use('/api/maintenance-tracking', maintenanceTrackingRoute);

// NOUVEAU : Routes pour les paramètres généraux
const settingsRoute = require('./routes/settings');
app.use('/api/settings', settingsRoute);

// NOUVEAU : Routes pour les Objectifs Environnementaux (Roadmap & IAP)
const environmentRoute = require('./routes/environment.routes');
app.use('/api/environment', environmentRoute);

// NOUVEAU : Routes pour les Alertes Sécurité
const alertsRoute = require('./routes/alerts');
app.use('/api/alerts', alertsRoute);

// NOUVEAU: Routes pour les Notifications Push
const pushRoute = require('./routes/push');
app.use('/api/push', pushRoute);

// NOUVEAU : Routes pour les Décharges Visiteurs
const waiversRoute = require('./routes/waivers');
app.use('/api/waivers', waiversRoute);

// NOUVEAU : Routes pour les Journaux d'Activité (Audit)
const auditRoute = require('./routes/audit');
app.use('/api/audit', auditRoute);

// NOUVEAU : Démarrer les tâches CRON de maintenance
const { startCronJobs } = require('./jobs/maintenance-cron');
const startMaintenanceCron = require('./jobs/maintenanceCron'); // New daily email cron
const { initializeTemplate } = require('./init-checklist-template');

// Initialiser le template de checklist au démarrage
mongoose.connection.once('open', async () => {
    console.log('📋 Initialisation du template de checklist...');
    await initializeTemplate();
    console.log('🚀 Démarrage des tâches CRON...');
    startCronJobs();
    startMaintenanceCron(); // Start daily email check
});



// Route de test (page d'accueil du backend) - Gardée pour le root / si besoin, mais le wildcard prendra le dessus pour le reste
app.get('/api', (req, res) => {
    res.send('Bienvenue sur l\'API de Gestion des Déplacements!');
});

// --- SERVING FRONTEND (Production/Monolithic) ---
// Servir les fichiers statiques du build Angular
const angularDistPath = path.join(__dirname, '../gestion-des-deplacements/dist/gestion-des-deplacements');
console.log('🔍 [DEBUG] angularDistPath resolved to:', angularDistPath);
const fs = require('fs');
if (fs.existsSync(path.join(angularDistPath, 'index.html'))) {
    console.log('✅ [DEBUG] index.html found at angularDistPath');
} else {
    console.error('❌ [DEBUG] index.html NOT FOUND at angularDistPath');
    // Debug: List contents of dist parent if possible
    try {
        const parentDist = path.join(__dirname, '../gestion-des-deplacements/dist');
        console.log('📂 [DEBUG] Contents of ' + parentDist + ':', fs.readdirSync(parentDist));
    } catch (e) { console.log('Could not list parent dist', e.message); }
}
app.use(express.static(angularDistPath));

// Pour toutes les autres requêtes (non API), renvoyer index.html (SPA)
app.get('*', (req, res) => {
    // Vérifier si c'est une requête API qui a échoué (404 API) pour éviter de renvoyer du HTML
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ message: 'API Route not found' });
    }
    res.sendFile(path.join(angularDistPath, 'index.html'));
});

// Démarrage du serveur
app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${port} (accessible depuis le réseau)`);
});
