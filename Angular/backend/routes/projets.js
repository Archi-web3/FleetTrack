const express = require('express');
const router = express.Router();
const Projet = require('../models/projet.model');
const auth = require('../middleware/authMiddleware');

// GET /api/projets - Liste tous les projets
router.get('/projets', auth(), async (req, res) => {
    try {
        const { includeInactifs } = req.query;

        // Par défaut, ne montrer que les projets actifs
        const filter = includeInactifs === 'true' ? {} : { actif: true };

        // Filtre MULTI-PAYS : Filtrer par pays sélectionné
        if (req.selectedCountry) {
            filter.pays = req.selectedCountry;
        }

        const projets = await Projet.find(filter).sort({ nom: 1 });
        res.json(projets);
    } catch (err) {
        console.error('Erreur GET /projets:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET /api/projets/:id - Détails d'un projet
router.get('/projets/:id', auth(), async (req, res) => {
    try {
        const projet = await Projet.findById(req.params.id);
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
        res.json(projet);
    } catch (err) {
        console.error('Erreur GET /projets/:id:', err);
        res.status(500).json({ message: err.message });
    }
});

// POST /api/projets - Créer un projet (Admin/SuperAdmin)
router.post('/projets', auth(['SuperAdmin', 'Admin']), async (req, res) => {
    try {
        const { nom, code, description, actif } = req.body;

        // Vérifier si un projet avec ce nom existe déjà
        const existant = await Projet.findOne({ nom });
        if (existant) {
            return res.status(400).json({ message: 'Un projet avec ce nom existe déjà' });
        }

        const projet = new Projet({
            nom,
            code,
            description,
            actif: actif !== undefined ? actif : true
        });

        const nouveauProjet = await projet.save();
        console.log(`Projet créé: ${nouveauProjet.nom} par ${req.utilisateur.nom}`);
        res.status(201).json(nouveauProjet);
    } catch (err) {
        console.error('Erreur POST /projets:', err);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Un projet avec ce nom existe déjà' });
        }
        res.status(400).json({ message: err.message });
    }
});

// PUT /api/projets/:id - Modifier un projet (Admin/SuperAdmin)
router.put('/projets/:id', auth(['SuperAdmin', 'Admin']), async (req, res) => {
    try {
        const { nom, code, description, actif } = req.body;

        const projet = await Projet.findById(req.params.id);
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        // Vérifier si le nouveau nom n'est pas déjà pris par un autre projet
        if (nom && nom !== projet.nom) {
            const existant = await Projet.findOne({ nom, _id: { $ne: req.params.id } });
            if (existant) {
                return res.status(400).json({ message: 'Un projet avec ce nom existe déjà' });
            }
        }

        if (nom !== undefined) projet.nom = nom;
        if (code !== undefined) projet.code = code;
        if (description !== undefined) projet.description = description;
        if (actif !== undefined) projet.actif = actif;

        const projetMisAJour = await projet.save();
        console.log(`Projet modifié: ${projetMisAJour.nom} par ${req.utilisateur.nom}`);
        res.json(projetMisAJour);
    } catch (err) {
        console.error('Erreur PUT /projets/:id:', err);
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/projets/:id - Supprimer un projet (SuperAdmin uniquement)
router.delete('/projets/:id', auth(['SuperAdmin']), async (req, res) => {
    try {
        const projet = await Projet.findById(req.params.id);
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        await projet.deleteOne();
        console.log(`Projet supprimé: ${projet.nom} par ${req.utilisateur.nom}`);
        res.json({ message: 'Projet supprimé avec succès' });
    } catch (err) {
        console.error('Erreur DELETE /projets/:id:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
