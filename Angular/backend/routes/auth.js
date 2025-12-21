const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/utilisateur.model');
const jwt = require('jsonwebtoken');

// Récupérer le secret JWT depuis les variables d'environnement
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error("JWT_SECRET non défini dans les variables d'environnement !");
  process.exit(1); // Arrête le processus si le secret n'est pas configuré
}

// Route d'enregistrement (inscription)
router.post('/register', async (req, res) => {
  try {
    const { nom, email, motDePasse, profil } = req.body;

    // Vérifier si l'utilisateur existe déjà
    let utilisateur = await Utilisateur.findOne({ email });
    if (utilisateur) {
      return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
    }

    utilisateur = new Utilisateur({
      nom,
      email,
      motDePasse, // Le mot de passe sera haché par le pré-hook du modèle
      profil
    });

    await utilisateur.save();

    // Générer un token pour l'utilisateur fraîchement enregistré (facultatif ici, mais utile)
    const payload = {
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom, // NOUVEAU : Ajouter le nom au payload
        profil: utilisateur.profil
      }
    };

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '24h' }, // Le token expire après 24 heures
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token, message: 'Utilisateur enregistré avec succès' });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur Serveur');
  }
});

// Route de connexion (login)
router.post('/login', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Vérifier si l'utilisateur existe
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Comparer le mot de passe fourni avec le mot de passe haché
    const isMatch = await utilisateur.comparePassword(motDePasse);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Populate pour avoir les noms du pays et de la base
    await utilisateur.populate('pays', 'nom code');
    await utilisateur.populate('base', 'nom');

    // Générer un token JWT
    const payload = {
      utilisateur: {
        id: utilisateur.id,
        nom: utilisateur.nom,
        profil: utilisateur.profil,
        pays: utilisateur.pays ? { id: utilisateur.pays._id, nom: utilisateur.pays.nom, code: utilisateur.pays.code } : null,
        base: utilisateur.base ? { id: utilisateur.base._id, nom: utilisateur.base.nom } : null
      }
    };

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '24h' }, // Le token expire après 24 heures
      (err, token) => {
        if (err) throw err;
        // Return both token and user info (without password)
        res.json({
          token,
          user: {
            _id: utilisateur._id,
            id: utilisateur.id,
            nom: utilisateur.nom,
            email: utilisateur.email,
            profil: utilisateur.profil,
            pays: utilisateur.pays ? { id: utilisateur.pays._id, nom: utilisateur.pays.nom, code: utilisateur.pays.code } : null,
            base: utilisateur.base ? { id: utilisateur.base._id, nom: utilisateur.base.nom } : null
          },
          message: 'Connexion réussie'
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur Serveur');
  }
});

module.exports = router;
