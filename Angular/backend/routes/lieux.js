const express = require('express');
const router = express.Router();
const Lieu = require('../models/lieu.model');
const auth = require('../middleware/authMiddleware');

// GET all locations (PROTÉGÉE - Accessible à tout utilisateur connecté)
router.get('/lieux', auth(), async (req, res) => {
  try {
    let query = {};

    // Filtre MULTI-PAYS : Les lieux sont filtrés via leur base
    if (req.selectedCountry) {
      // D'abord, trouver toutes les bases du pays sélectionné
      const Base = require('../models/base.model');
      const basesInCountry = await Base.find({ pays: req.selectedCountry }).select('_id');
      const baseIds = basesInCountry.map(b => b._id);

      // Filtrer les lieux qui appartiennent à ces bases
      query.base = { $in: baseIds };
    }

    const lieux = await Lieu.find(query).populate('pays').populate('base');
    res.json(lieux);
  } catch (err) {
    console.error("Erreur GET /lieux:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET one location (PROTÉGÉE - Accessible à tout utilisateur connecté)
router.get('/lieux/:id', auth(), async (req, res) => { // <<< AJOUTÉ auth()
  try {
    const lieu = await Lieu.findById(req.params.id);
    if (lieu == null) {
      return res.status(404).json({ message: 'Cannot find location' });
    }
    res.json(lieu);
  } catch (err) {
    console.error("Erreur GET /lieux/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

// CREATE one location (PROTÉGÉE PAR RÔLE : SuperAdmin, Admin ou Superviseur)
router.post('/lieux', auth(['SuperAdmin', 'Admin', 'Superviseur']), async (req, res) => {
  try {
    // Pour Admin/Superviseur, assigner automatiquement leur pays/base si non fournis
    let pays = req.body.pays;
    let base = req.body.base;

    if (req.utilisateur.profil !== 'SuperAdmin') {
      // Si Admin ou Superviseur, forcer leur pays/base
      if (!pays && req.utilisateur.pays) {
        pays = req.utilisateur.pays;
        console.log(`Pays assigné automatiquement depuis l'utilisateur: ${pays}`);
      }
      if (!base && req.utilisateur.base) {
        base = req.utilisateur.base;
        console.log(`Base assignée automatiquement depuis l'utilisateur: ${base}`);
      }
    }

    const lieu = new Lieu({
      nom: req.body.nom,
      adresse: req.body.adresse,
      coordonnees: req.body.coordonnees,
      estSensible: req.body.estSensible,
      pays: pays,
      base: base
    });

    const nouveauLieu = await lieu.save();
    console.log("Nouveau lieu créé:", nouveauLieu);
    res.status(201).json(nouveauLieu);
  } catch (err) {
    console.error("Erreur CREATE /lieux:", err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE one location (PROTÉGÉE PAR RÔLE : SuperAdmin, Admin ou Superviseur)
router.put('/lieux/:id', auth(['SuperAdmin', 'Admin', 'Superviseur']), async (req, res) => { // <<< PROTECTION PAR RÔLE
  try {
    const lieu = await Lieu.findById(req.params.id);
    if (lieu == null) {
      return res.status(404).json({ message: 'Cannot find location' });
    }
    if (req.body.nom != null) lieu.nom = req.body.nom;
    if (req.body.adresse != null) lieu.adresse = req.body.adresse;
    if (req.body.coordonnees != null) lieu.coordonnees = req.body.coordonnees;
    if (req.body.estSensible != null) lieu.estSensible = req.body.estSensible;

    const lieuMisAJour = await lieu.save();
    res.json(lieuMisAJour);
  } catch (err) {
    console.error("Erreur UPDATE /lieux/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

// DELETE one location (PROTÉGÉE PAR RÔLE : SuperAdmin ou Admin)
router.delete('/lieux/:id', auth(['SuperAdmin', 'Admin']), async (req, res) => { // <<< PROTECTION PAR RÔLE
  try {
    const lieu = await Lieu.findById(req.params.id);
    if (lieu == null) {
      return res.status(404).json({ message: 'Cannot find location' });
    }
    await lieu.deleteOne();
    res.json({ message: 'Lieu supprimé' });
  } catch (err) {
    console.error("Erreur DELETE /lieux/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
