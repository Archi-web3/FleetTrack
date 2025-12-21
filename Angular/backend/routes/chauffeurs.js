const express = require('express');
const router = express.Router();
const Chauffeur = require('../models/chauffeur.model');
const auth = require('../middleware/authMiddleware');

// GET all drivers (PROTÉGÉE - Accessible à tout utilisateur connecté)
router.get('/chauffeurs', auth(), async (req, res) => { // <<< AJOUTÉ auth()
  try {
    const chauffeurs = await Chauffeur.find();
    res.json(chauffeurs);
  } catch (err) {
    console.error("Erreur GET /chauffeurs:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET one driver (PROTÉGÉE - Accessible à tout utilisateur connecté)
router.get('/chauffeurs/:id', auth(), async (req, res) => { // <<< AJOUTÉ auth()
  try {
    const chauffeur = await Chauffeur.findById(req.params.id);
    if (chauffeur == null) {
      return res.status(404).json({ message: 'Cannot find driver' });
    }
    res.json(chauffeur);
  } catch (err) {
    console.error("Erreur GET /chauffeurs/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

// CREATE one driver (PROTÉGÉE PAR RÔLE : SuperAdmin, Admin ou Superviseur)
router.post('/chauffeurs', auth(['SuperAdmin', 'Admin', 'Superviseur']), async (req, res) => { // <<< PROTECTION PAR RÔLE
  const chauffeur = new Chauffeur({
    nom: req.body.nom,
    prenom: req.body.prenom,
    telephone: req.body.telephone,
    permis: req.body.permis,
    disponible: req.body.disponible
  });
  try {
    const nouveauChauffeur = await chauffeur.save();
    console.log("Nouveau chauffeur créé:", nouveauChauffeur);
    res.status(201).json(nouveauChauffeur);
  } catch (err) {
    console.error("Erreur CREATE /chauffeurs:", err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE one driver (PROTÉGÉE PAR RÔLE : SuperAdmin, Admin ou Superviseur)
router.put('/chauffeurs/:id', auth(['SuperAdmin', 'Admin', 'Superviseur']), async (req, res) => { // <<< PROTECTION PAR RÔLE
  try {
    const chauffeur = await Chauffeur.findById(req.params.id);
    if (chauffeur == null) {
      return res.status(404).json({ message: 'Cannot find driver' });
    }
    if (req.body.nom != null) chauffeur.nom = req.body.nom;
    if (req.body.prenom != null) chauffeur.prenom = req.body.prenom;
    if (req.body.telephone != null) chauffeur.telephone = req.body.telephone;
    if (req.body.permis != null) chauffeur.permis = req.body.permis;
    if (req.body.disponible != null) chauffeur.disponible = req.body.disponible;

    const chauffeurMisAJour = await chauffeur.save();
    res.json(chauffeurMisAJour);
  } catch (err) {
    console.error("Erreur UPDATE /chauffeurs/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

// DELETE one driver (PROTÉGÉE PAR RÔLE : SuperAdmin ou Admin)
router.delete('/chauffeurs/:id', auth(['SuperAdmin', 'Admin']), async (req, res) => { // <<< PROTECTION PAR RÔLE
  try {
    const chauffeur = await Chauffeur.findById(req.params.id);
    if (chauffeur == null) {
      return res.status(404).json({ message: 'Cannot find driver' });
    }
    await chauffeur.deleteOne();
    res.json({ message: 'Chauffeur supprimé' });
  } catch (err) {
    console.error("Erreur DELETE /chauffeurs/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
