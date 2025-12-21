const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/utilisateur.model');

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error("JWT_SECRET non défini dans les variables d'environnement !");
  process.exit(1);
}

// Middleware pour vérifier le token JWT et le rôle
module.exports = function (roles = []) { // Accepte un tableau de rôles
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    // Récupérer le token du header
    const token = req.header('x-auth-token');

    // Vérifier si pas de token
    if (!token) {
      return res.status(401).json({ message: 'Aucun token, autorisation refusée' });
    }

    // Vérifier le token
    try {
      const decoded = jwt.verify(token, jwtSecret);

      // Multi-Tenancy : On recharge l'utilisateur pour avoir sa Base à jour
      // On utilise l'ID présent dans le token pour chercher l'utilisateur complet
      const userId = decoded.utilisateur.id || decoded.utilisateur._id;

      // On sélectionne l'utilisateur sans le mot de passe, mais avec Base et Pays (par défaut s'ils sont dans le schéma)
      // Si on veut les noms des bases/pays, on pourrait populate, mais avoir les IDs est suffisant pour le filtrage
      const user = await Utilisateur.findById(userId).select('-motDePasse');

      if (!user) {
        return res.status(401).json({ message: 'Utilisateur introuvable (peut-être supprimé ?)' });
      }

      req.utilisateur = user; // req.utilisateur contient maintenant .base (ObjectId) et .pays (ObjectId)

      // ===== FILTRAGE PAR PAYS =====
      // Extraire le pays sélectionné du header (pour SuperAdmin)
      const selectedCountryHeader = req.header('X-Selected-Country');

      if (req.utilisateur.profil === 'SuperAdmin') {
        // SuperAdmin peut sélectionner n'importe quel pays
        if (selectedCountryHeader) {
          req.selectedCountry = selectedCountryHeader;
        } else {
          // Pas de pays sélectionné - on laisse null pour que les routes puissent gérer
          req.selectedCountry = null;
        }
      } else {
        // Pour les autres rôles (Admin, Superviseur, etc.), utiliser leur pays assigné
        req.selectedCountry = req.utilisateur.pays;
      }

      // Vérifier les rôles si spécifiés
      if (roles.length > 0 && !roles.includes(req.utilisateur.profil)) {
        return res.status(403).json({ message: 'Accès refusé, rôle insuffisant' });
      }

      next(); // Passer au prochain middleware/route
    } catch (err) {
      // Gérer le cas où le token est expiré ou invalide
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expiré, veuillez vous reconnecter.' });
      }
      console.error('Erreur Auth Middleware:', err.message);
      res.status(401).json({ message: 'Token non valide' });
    }
  };
};
