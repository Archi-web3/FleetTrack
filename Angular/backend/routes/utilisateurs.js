const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/utilisateur.model');
const auth = require('../middleware/authMiddleware'); // Importez le middleware auth
const countryFilter = require('../middleware/countryFilter'); // NOUVEAU: Middleware de filtrage pays
const auditService = require('../services/audit.service');

// GET all users (Accessible à tout utilisateur connecté pour peupler les listes déroulantes)
/**
 * @swagger
 * /utilisateurs:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nom:
 *                     type: string
 *                   email:
 *                     type: string
 *                   profil:
 *                     type: string
 *       401:
 *         description: Non autorisé
 */
router.get('/utilisateurs', auth(), countryFilter, async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find(req.countryFilter).select('-motDePasse');
    res.json(utilisateurs);
  } catch (err) {
    console.error("Erreur GET /utilisateurs:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET one user (Accessible à tout utilisateur connecté)
router.get('/utilisateurs/:id', auth(), async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.params.id).select('-motDePasse');
    if (utilisateur == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    res.json(utilisateur);
  } catch (err) {
    console.error("Erreur GET /utilisateurs/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

// CREATE one user (PROTÉGÉE PAR RÔLE)
// SuperAdmin : Tout
// Admin : Uniquement profils inférieurs (pas Admin/SuperAdmin) et uniquement dans son Pays
router.post('/utilisateurs', auth(['SuperAdmin', 'Admin']), async (req, res) => {
  try {
    const creatorProfil = req.utilisateur.profil;
    const targetProfil = req.body.profil;

    // RÈGLE 1 : Un Admin ne peut créer que des sous-profils
    if (creatorProfil === 'Admin') {
      if (targetProfil === 'Admin' || targetProfil === 'SuperAdmin') {
        return res.status(403).json({ message: "Un Admin ne peut pas créer d'autres Admins." });
      }
      // RÈGLE 2 : Un Admin force le pays de l'utilisateur créé à être le sien
      req.body.pays = req.utilisateur.pays;

      // RÈGLE 3 : La base doit appartenir au pays (on suppose que le front envoie une base valide, on pourrait vérifier en base)
      // Pour l'instant on fait confiance à l'ID base envoyé, mais il faut qu'il soit cohérent avec le pays.
    }

    // RÈGLE 4 : Seul SuperAdmin peut créer un Admin
    if (creatorProfil === 'SuperAdmin') {
      // SuperAdmin a la liberté totale des champs pays/base
    }

    const utilisateur = new Utilisateur({
      nom: req.body.nom,
      email: req.body.email,
      motDePasse: req.body.motDePasse,
      profil: req.body.profil,
      pays: req.body.pays, // Assigné auto pour Admin
      base: req.body.base,
      // Info Pro
      numeroEmploye: req.body.numeroEmploye,
      niveauValidationSecu: req.body.niveauValidationSecu,
      // Champs spécifiques aux chauffeurs
      prenom: req.body.prenom,
      telephone: req.body.telephone,
      permis: req.body.permis,
      disponible: req.body.disponible
    });

    const nouvelUtilisateur = await utilisateur.save();

    auditService.logAction(req, 'CREATE_USER', 'ADMIN', `User: ${nouvelUtilisateur.nom}`, { role: nouvelUtilisateur.profil });

    console.log("Nouvel utilisateur créé:", nouvelUtilisateur);
    res.status(201).json(nouvelUtilisateur);
  } catch (err) {
    console.error("Erreur CREATE /utilisateurs:", err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE one user (PROTÉGÉE PAR RÔLE : SuperAdmin ou Admin)
router.put('/utilisateurs/:id', auth(['SuperAdmin', 'Admin']), async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.params.id);
    if (utilisateur == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    if (req.body.nom != null) utilisateur.nom = req.body.nom;
    if (req.body.email != null) utilisateur.email = req.body.email;
    if (req.body.motDePasse != null && req.body.motDePasse.trim() !== "") utilisateur.motDePasse = req.body.motDePasse;
    if (req.body.profil != null) utilisateur.profil = req.body.profil;
    if (req.body.base !== undefined) utilisateur.base = req.body.base; // Accepter null pour désassigner
    if (req.body.projet !== undefined) utilisateur.projet = req.body.projet; // Mise à jour du projet
    if (req.body.numeroEmploye !== undefined) utilisateur.numeroEmploye = req.body.numeroEmploye;
    if (req.body.niveauValidationSecu !== undefined) utilisateur.niveauValidationSecu = req.body.niveauValidationSecu;

    // Champs spécifiques aux chauffeurs
    if (req.body.prenom != null) utilisateur.prenom = req.body.prenom;
    if (req.body.telephone != null) utilisateur.telephone = req.body.telephone;
    if (req.body.permis != null) utilisateur.permis = req.body.permis;
    if (req.body.disponible != null) utilisateur.disponible = req.body.disponible;

    const utilisateurMisAJour = await utilisateur.save();
    auditService.logAction(req, 'UPDATE_USER', 'ADMIN', `User: ${utilisateurMisAJour.nom}`, { changes: req.body });
    res.json(utilisateurMisAJour);
  } catch (err) {
    console.error("Erreur UPDATE /utilisateurs/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

// DELETE one user (PROTÉGÉE PAR RÔLE : SuperAdmin ou Admin)
router.delete('/utilisateurs/:id', auth(['SuperAdmin', 'Admin']), async (req, res) => { // <<< AJOUT DE PROTECTION
  try {
    const utilisateur = await Utilisateur.findById(req.params.id);
    if (utilisateur == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    await utilisateur.deleteOne();
    auditService.logAction(req, 'DELETE_USER', 'ADMIN', `User: ${utilisateur.nom} (${utilisateur.email})`, { role: utilisateur.profil });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.error("Erreur DELETE /utilisateurs/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
