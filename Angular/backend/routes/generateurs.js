const express = require('express');
const router = express.Router();
const Generateur = require('../models/generateur.model');
const GenerateurLogbook = require('../models/generateur-logbook.model');
const GenerateurIntervention = require('../models/generateur-intervention.model');
const auth = require('../middleware/authMiddleware');

// ==========================================
// CRUD GÉNÉRATEURS
// ==========================================

// Obtenir tous les générateurs
router.get('/', auth(), async (req, res) => {
    try {
        const generateurs = await Generateur.find()
            .populate('base', 'nom')
            .populate('pays', 'nom');
        res.json(generateurs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Créer un générateur
router.post('/', auth(), async (req, res) => {
    try {
        const nouveauGenerateur = new Generateur(req.body);
        const saved = await nouveauGenerateur.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Obtenir un générateur par ID
router.get('/:id', auth(), async (req, res) => {
    try {
        const gen = await Generateur.findById(req.params.id)
            .populate('base', 'nom')
            .populate('pays', 'nom');
        if (!gen) return res.status(404).json({ message: 'Générateur introuvable' });
        res.json(gen);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mettre à jour un générateur
router.put('/:id', auth(), async (req, res) => {
    try {
        const updated = await Generateur.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Générateur introuvable' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Supprimer un générateur
router.delete('/:id', auth(), async (req, res) => {
    try {
        const deleted = await Generateur.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Générateur introuvable' });
        res.json({ message: 'Générateur supprimé' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ==========================================
// LOGBOOK HORAIRE
// ==========================================

// Obtenir les logbooks d'un générateur
router.get('/:id/logbooks', auth(), async (req, res) => {
    try {
        const logs = await GenerateurLogbook.find({ generateur: req.params.id })
            .populate('utilisateur', 'nom prenom')
            .sort({ dateReleve: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ajouter un relevé de logbook
router.post('/:id/logbooks', auth(), async (req, res) => {
    try {
        const gen = await Generateur.findById(req.params.id);
        if (!gen) return res.status(404).json({ message: 'Générateur introuvable' });

        const log = new GenerateurLogbook({
            generateur: gen._id,
            utilisateur: req.user.id,
            dateReleve: req.body.dateReleve,
            heureDebut: req.body.heureDebut,
            heureFin: req.body.heureFin,
            carburantAjoute: req.body.carburantAjoute,
            observations: req.body.observations
        });

        const savedLog = await log.save();

        // Mettre à jour les heures de fonctionnement du générateur
        if (log.heureFin > gen.heuresFonctionnement) {
            gen.heuresFonctionnement = log.heureFin;
        }

        // Calculer la nouvelle consommation théorique moyenne si possible
        const duree = log.heureFin - log.heureDebut;
        if (duree > 0 && log.carburantAjoute > 0) {
            const lph = log.carburantAjoute / duree;
            // Moyenne mobile simple ou écrasement (ici on fait une moyenne pondérée simple pour l'exemple)
            if (gen.consommationTheorique === 0) {
                gen.consommationTheorique = lph;
            } else {
                gen.consommationTheorique = (gen.consommationTheorique + lph) / 2;
            }
        }

        await gen.save();

        res.status(201).json(savedLog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// ==========================================
// INTERVENTIONS (MAINTENANCE ACF)
// ==========================================

// Obtenir les interventions d'un générateur
router.get('/:id/interventions', auth(), async (req, res) => {
    try {
        const interventions = await GenerateurIntervention.find({ generateur: req.params.id })
            .sort({ dateIntervention: -1 });
        res.json(interventions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Enregistrer une intervention
router.post('/:id/interventions', auth(), async (req, res) => {
    try {
        const gen = await Generateur.findById(req.params.id);
        if (!gen) return res.status(404).json({ message: 'Générateur introuvable' });

        const intervention = new GenerateurIntervention({
            generateur: gen._id,
            ...req.body
        });

        const saved = await intervention.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Modifier une intervention
router.put('/interventions/:interventionId', auth(), async (req, res) => {
    try {
        const updated = await GenerateurIntervention.findByIdAndUpdate(req.params.interventionId, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Intervention introuvable' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// ==========================================
// PRÉDICTION & CALENDRIER
// ==========================================

router.get('/maintenance/overview', auth(), async (req, res) => {
    try {
        const generateurs = await Generateur.find();
        
        // Logique de prédiction très simplifiée pour l'instant
        const overview = generateurs.map(gen => {
            const h = gen.heuresFonctionnement;
            let prochainService = 250;
            if (h >= 250 && h < 500) prochainService = 500;
            else if (h >= 500 && h < 1000) prochainService = 1000;
            else if (h >= 1000 && h < 3000) prochainService = 3000;
            else prochainService = Math.ceil((h + 1) / 250) * 250; // Approximatif

            const heuresRestantes = prochainService - h;
            
            return {
                _id: gen._id,
                marque: gen.marque,
                modele: gen.modele,
                numeroSerie: gen.numeroSerie,
                heuresActuelles: h,
                prochainService: prochainService,
                heuresRestantes: heuresRestantes,
                statut: heuresRestantes <= 0 ? 'En retard' : (heuresRestantes <= 50 ? 'Dû bientôt' : 'À jour')
            };
        });

        res.json(overview);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
