const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/utilisateur.model'); // Switch to Utilisateur model
const auth = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

// GET all drivers (Utilisateurs avec profil 'Chauffeur')
router.get('/chauffeurs', auth(), async (req, res) => {
  try {
    // On récupère uniquement les utilisateurs avec le profil 'Chauffeur' (ou 'driver' pour compatibilité)
    const chauffeurs = await Utilisateur.find({ profil: { $in: ['Chauffeur', 'driver'] } }).select('-motDePasse');
    res.json(chauffeurs);
  } catch (err) {
    console.error("Erreur GET /chauffeurs:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET one driver
router.get('/chauffeurs/:id', auth(), async (req, res) => {
  try {
    const chauffeur = await Utilisateur.findOne({ _id: req.params.id, profil: 'Chauffeur' }).select('-motDePasse');
    if (chauffeur == null) {
      return res.status(404).json({ message: 'Cannot find driver' });
    }
    res.json(chauffeur);
  } catch (err) {
    console.error("Erreur GET /chauffeurs/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

// CREATE one driver (via simple form)
router.post('/chauffeurs', auth(['SuperAdmin', 'Admin', 'Superviseur']), async (req, res) => {
  try {
    // Génération email/password par défaut car le formulaire simple ne les fournit pas
    const timestamp = Date.now();
    const defaultEmail = `driver.${timestamp}@acf.local`; // Email fictif unique
    const defaultPassword = process.env.DEFAULT_DRIVER_PASSWORD || "AcfDriver123!"; // Mot de passe par défaut configuré via env

    const chauffeur = new Utilisateur({
      nom: req.body.nom,
      prenom: req.body.prenom,
      telephone: req.body.telephone,
      permis: req.body.permis,
      disponible: req.body.disponible !== undefined ? req.body.disponible : true,
      // Champs obligatoires Utilisateur :
      email: defaultEmail,
      motDePasse: defaultPassword, // Sera hashé par le pre-save hook
      profil: 'Chauffeur',
      pays: req.user.pays, // Hérite du pays du créateur
      base: req.user.base  // Hérite de la base du créateur
    });

    const nouveauChauffeur = await chauffeur.save();
    console.log("Nouveau chauffeur (Utilisateur) créé:", nouveauChauffeur._id);

    // On ne renvoie pas le mot de passe
    const responseData = nouveauChauffeur.toObject();
    delete responseData.motDePasse;

    res.status(201).json(responseData);
  } catch (err) {
    console.error("Erreur CREATE /chauffeurs:", err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE one driver
router.put('/chauffeurs/:id', auth(['SuperAdmin', 'Admin', 'Superviseur']), async (req, res) => {
  try {
    const chauffeur = await Utilisateur.findById(req.params.id);
    if (chauffeur == null) {
      return res.status(404).json({ message: 'Cannot find driver' });
    }

    // Mise à jour des champs autorisés
    if (req.body.nom != null) chauffeur.nom = req.body.nom;
    if (req.body.prenom != null) chauffeur.prenom = req.body.prenom;
    if (req.body.telephone != null) chauffeur.telephone = req.body.telephone;
    if (req.body.permis != null) chauffeur.permis = req.body.permis;
    if (req.body.disponible != null) chauffeur.disponible = req.body.disponible;

    // Possibilité de changer le profil si envoyé, sinon reste Chauffeur
    if (req.body.profil) chauffeur.profil = req.body.profil;

    const chauffeurMisAJour = await chauffeur.save();
    res.json(chauffeurMisAJour);
  } catch (err) {
    console.error("Erreur UPDATE /chauffeurs/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

// DELETE one driver
router.delete('/chauffeurs/:id', auth(['SuperAdmin', 'Admin']), async (req, res) => {
  try {
    const chauffeur = await Utilisateur.findById(req.params.id);
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
