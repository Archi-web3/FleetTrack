const express = require('express');
const router = express.Router();
const Mouvement = require('../models/mouvement.model');
const Lieu = require('../models/lieu.model');
const Vehicule = require('../models/vehicule.model');
const Chauffeur = require('../models/chauffeur.model');
const Utilisateur = require('../models/utilisateur.model'); // AJOUT pour vérifier les chauffeurs
const auth = require('../middleware/authMiddleware');
const countryFilter = require('../middleware/countryFilter'); // NOUVEAU: Middleware de filtrage pays
const mongoose = require('mongoose');

// Route pour créer un nouveau mouvement (pour test - NON PROTÉGÉE PAR AUTH car c'est un test simple)
router.post('/mouvements/test', async (req, res) => {
  console.log('Requête reçue sur /mouvements/test (non protégée)');
  try {
    const nouveauMouvement = new Mouvement({
      stops: [
        {
          lieu: '691ccf5fb73cc314cea638c8', // REMPLACEZ PAR UN VRAI ID DE LIEU EXSITANT
          dateDepart: new Date('2025-11-19T09:00:00Z'),
          dateArrivee: new Date('2025-11-19T09:05:00Z')
        },
        {
          lieu: '691ccfa5b73cc314cea638cb', // REMPLACEZ PAR UN VRAI ID DE LIEU EXSITANT
          dateDepart: new Date('2025-11-19T10:00:00Z'),
          dateArrivee: new Date('2025-11-19T10:05:00Z')
        }
      ],
      demandeur: '691725d3c84274956b8afba3', // REMPLACEZ PAR UN VRAI ID D'UTILISATEUR EXSITANT
      vehicule: '691727c0f7f497a0465224d1', // REMPLACEZ PAR UN VRAI ID DE VÉHICULE EXSITANT
      chauffeur: '69172905fbfec25232433f2e', // REMPLACEZ PAR UN VRAI ID DE CHAUFFEUR EXSITANT
      objectif: 'Test depuis le backend',
      statut: 'en attente',
      isRoundTrip: false
    });
    const savedMouvement = await nouveauMouvement.save();
    console.log('Mouvement de test créé:', savedMouvement);
    res.status(201).json(savedMouvement);
  } catch (err) {
    console.error('Erreur lors de la création du mouvement de test:', err);
    res.status(500).json({ message: err.message });
  }
});

// Récupérer les mouvements pour le planning (uniquement validés ou en cours)
router.get('/mouvements/planning', auth(), countryFilter, async (req, res) => {
  try {
    let query = {
      statut: { $in: ['validé', 'pris en charge', 'en cours', 'terminé'] },
      ...req.countryFilter  // NOUVEAU: Filtre pays automatique
    };

    if (req.utilisateur.base) {
      query.base = req.utilisateur.base;
    }

    const mouvements = await Mouvement.find(query)
      .populate({
        path: 'stops.lieu',
        select: 'nom adresse coordonnees estSensible'
      })
      .populate('demandeur', 'nom email')
      .populate('vehicule', 'marque modele immatriculation')
      .populate('chauffeur', 'nom prenom telephone')
      .populate('passagers', 'nom email')
      .sort({ 'stops.0.dateDepart': 1 });

    res.json(mouvements);
  } catch (err) {
    console.error('Erreur lors de la récupération du planning des mouvements:', err);
    res.status(500).json({ message: err.message });
  }
});


// Obtenir les statistiques des mouvements par statut
router.get('/mouvements/stats-by-status', auth(['SuperAdmin', 'Admin', 'Superviseur']), async (req, res) => {
  try {
    const stats = await Mouvement.aggregate([
      {
        $match: req.utilisateur.base ? { base: mongoose.Types.ObjectId.createFromHexString(req.utilisateur.base) } : {}
      },
      {
        $group: {
          _id: '$statut',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          statut: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    res.json(stats);
  } catch (err) {
    console.error('Erreur lors de la récupération des statistiques par statut:', err);
    res.status(500).json({ message: err.message });
  }
});


// Récupérer tous les mouvements (Accès pour tout utilisateur connecté)
router.get('/mouvements', auth(), countryFilter, async (req, res) => {
  try {
    console.log('📥 [GET MOUVEMENTS] Récupération des mouvements...');
    console.log('📥 [GET MOUVEMENTS] Utilisateur:', req.utilisateur.id, 'Profil:', req.utilisateur.profil);
    console.log('📥 [GET MOUVEMENTS] Base utilisateur:', req.utilisateur.base);
    console.log('📥 [GET MOUVEMENTS] Pays utilisateur:', req.utilisateur.pays);
    console.log('📥 [GET MOUVEMENTS] Filtre pays automatique:', req.countryFilter);

    let query = {
      ...req.countryFilter  // NOUVEAU: Filtre pays automatique
    };
    let demandeurQuery = {}; // Pour stocker la condition demandeur séparément

    if (req.utilisateur.profil === 'Technicien' || req.utilisateur.profil === 'Guest') {
      if (!mongoose.Types.ObjectId.isValid(req.utilisateur.id)) {
        return res.status(400).json({ message: 'ID utilisateur invalide' });
      }
      demandeurQuery = { demandeur: req.utilisateur.id };
    } else if (req.query.demandeurId && mongoose.Types.ObjectId.isValid(req.query.demandeurId)) {
      demandeurQuery = { demandeur: req.query.demandeurId };
    }

    // Filtre MULTI-SITES : On ne voit que les mouvements de sa base (sauf SuperAdmin)
    // CORRECTION : Inclure aussi les mouvements sans base assignée pour éviter de les perdre
    if (req.utilisateur.base && req.utilisateur.profil !== 'SuperAdmin') {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { base: req.utilisateur.base },
          { base: null },
          { base: { $exists: false } }
        ]
      });
      console.log('📥 [GET MOUVEMENTS] Filtre par base avec fallback pour mouvements sans base');
    }

    // Ajouter la condition demandeur à la query finale
    if (Object.keys(demandeurQuery).length > 0) {
      query.$and = query.$and || [];
      query.$and.push(demandeurQuery);
    }

    // Si $and n'a qu'un seul élément, le déballer pour éviter un $and inutile
    if (query.$and && query.$and.length === 1) {
      query = query.$and[0];
    } else if (query.$and && query.$and.length === 0) {
      query = {}; // Si $and est vide, pas de filtre spécifique
    }


    console.log('📥 [GET MOUVEMENTS] Query MongoDB:', JSON.stringify(query, null, 2));

    const mouvements = await Mouvement.find(query)
      .populate({
        path: 'stops.lieu',
        select: 'nom adresse coordonnees estSensible'
      })
      .populate('demandeur', 'nom email')
      .populate('vehicule', 'marque modele immatriculation')
      .populate('chauffeur', 'nom prenom telephone')
      .populate('passagers', 'nom email');

    console.log('📥 [GET MOUVEMENTS] Mouvements trouvés:', mouvements.length);
    console.log('📥 [GET MOUVEMENTS] Mouvements récupérés:', mouvements);

    res.json(mouvements);
  } catch (err) {
    console.error('❌ [GET MOUVEMENTS] Erreur lors de la récupération des mouvements:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET one movement (Accès pour tout utilisateur connecté)
router.get('/mouvements/:id', auth(), async (req, res) => {
  try {
    const mouvement = await Mouvement.findById(req.params.id)
      .populate({
        path: 'stops.lieu',
        select: 'nom adresse coordonnees estSensible'
      })
      .populate('demandeur', 'nom email')
      .populate('vehicule', 'marque modele immatriculation')
      .populate('chauffeur', 'nom prenom telephone')
      .populate('passagers', 'nom email');
    if (mouvement == null) {
      return res.status(404).json({ message: 'Cannot find movement' });
    }
    res.json(mouvement);
  } catch (err) {
    console.error("Erreur GET /mouvements/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

// Créer un nouveau mouvement (Accès pour tout utilisateur connecté)
router.post('/mouvements', auth(), countryFilter, async (req, res) => {
  try {
    console.log('🆕 [CREATE MOUVEMENT] Création d\'un nouveau mouvement...');
    console.log('🆕 [CREATE MOUVEMENT] Utilisateur:', req.utilisateur.id, 'Profil:', req.utilisateur.profil);
    console.log('🆕 [CREATE MOUVEMENT] Base utilisateur:', req.utilisateur.base);
    console.log('🆕 [CREATE MOUVEMENT] Pays utilisateur:', req.utilisateur.pays);

    // --- NOUVELLE LOGIQUE DE VALIDATION SÉCURITÉ ---
    let statutInitial = 'en attente';
    const stopLieuIds = req.body.stops.map((stop) => stop.lieu);
    console.log('🆕 [CREATE MOUVEMENT] Lieux impliqués (IDs):', stopLieuIds);

    // Vérifier si les lieux sont sensibles
    const lieuxImpliques = await Lieu.find({
      _id: { $in: stopLieuIds }
    });
    console.log('🆕 [CREATE MOUVEMENT] Lieux trouvés:', lieuxImpliques.length);
    lieuxImpliques.forEach(lieu => {
      console.log(`  - Lieu: ${lieu.nom}, Sensible: ${lieu.estSensible}`);
    });

    // --- NOUVELLE LOGIQUE DE VALIDATION SÉCURITÉ (Module 2) ---
    // Calculer le niveau de risque maximum du trajet
    let maxSecurityLevel = 0;
    lieuxImpliques.forEach(lieu => {
      // Si niveauSecurite n'existe pas encore sur le lieu, on assume 1 (Stable)
      const niveau = lieu.niveauSecurite || (lieu.estSensible ? 3 : 1);
      if (niveau > maxSecurityLevel) {
        maxSecurityLevel = niveau;
      }
    });

    console.log(`🔒 [CREATE MOUVEMENT] Niveau de sécurité MAX du trajet: ${maxSecurityLevel}`);

    // Si niveau > 1 (Stable), ça nécessite une validation sécurité spécifique si configuré ainsi. 
    // Pour l'instant, on garde la logique que tout ce qui est sensible (>1 ?) nécessite validation secu.
    // Ou alors on stocke le niveau requis et le flow dépendra de ça.

    // Si le niveau est élevé (> 1), on peut forcer un statut spécial ou juste stocker le niveau.
    const validationLevelRequired = maxSecurityLevel;

    // Logique simplifiée temporaire compatible avec l'existant :
    // Si niveau >= 3 (Difficile/Sensible ancien), on met en attente validation sécu
    if (validationLevelRequired >= 3) { // 3 correspond à "Difficile" ou ancien "Sensible"
      statutInitial = 'en attente validation sécurité';
      console.log('🔒 [CREATE MOUVEMENT] Risque élevé détecté -> Statut: "en attente validation sécurité"');
    } else {
      console.log('✅ [CREATE MOUVEMENT] Risque faible/moyen -> Statut: "en attente"');
    }
    // --- FIN NOUVELLE LOGIQUE ---

    const mouvement = new Mouvement({
      stops: req.body.stops, // Utiliser le tableau stops
      demandeur: req.body.demandeur,
      vehicule: req.body.vehicule,
      chauffeur: req.body.chauffeur,
      passagers: req.body.passagers,
      materiel: req.body.materiel,
      objectif: req.body.objectif,
      projet: req.body.projet,
      statut: statutInitial, // Utiliser le statut déterminé par la logique de sécurité
      isRoundTrip: req.body.isRoundTrip, // Récupérer l'information aller-retour
      // Nouveaux champs Module 2
      modeTransport: req.body.modeTransport,
      validationLevelRequired: maxSecurityLevel, // On stocke le niveau max calculé
      projetsVentilation: req.body.projetsVentilation
    });

    if (!mouvement.demandeur) {
      mouvement.demandeur = req.utilisateur.id;
      console.log('🆕 [CREATE MOUVEMENT] Demandeur assigné depuis le token:', mouvement.demandeur);
    }

    // Assigner la base du créateur au mouvement
    if (req.utilisateur.base) {
      mouvement.base = req.utilisateur.base;
      console.log('🆕 [CREATE MOUVEMENT] Base assignée:', mouvement.base);
    } else {
      console.warn('⚠️ [CREATE MOUVEMENT] Aucune base assignée à l\'utilisateur!');
    }

    // Assigner le pays depuis l'utilisateur si disponible
    if (req.utilisateur.pays) {
      mouvement.pays = req.utilisateur.pays;
      console.log('🆕 [CREATE MOUVEMENT] Pays assigné:', mouvement.pays);
    } else {
      console.warn('⚠️ [CREATE MOUVEMENT] Aucun pays assigné à l\'utilisateur!');
    }

    // Si le projet n'est pas fourni, le récupérer depuis le demandeur
    if (!mouvement.projet && mouvement.demandeur) {
      try {
        const demandeur = await Utilisateur.findById(mouvement.demandeur);
        if (demandeur && demandeur.projet) {
          mouvement.projet = demandeur.projet;
          console.log(`🆕 [CREATE MOUVEMENT] Projet assigné au mouvement depuis le demandeur: ${mouvement.projet}`);
        }
      } catch (err) {
        console.error('❌ [CREATE MOUVEMENT] Erreur lors de la récupération du projet du demandeur:', err);
      }
    }

    // Récupérer les projets de tous les passagers pour détecter les mouvements multi-projets
    if (mouvement.passagers && mouvement.passagers.length > 0) {
      try {
        const passagers = await Utilisateur.find({ _id: { $in: mouvement.passagers } });
        const projetsUniques = [...new Set(passagers.map(p => p.projet).filter(p => p))];
        mouvement.projetsPassagers = projetsUniques;

        if (projetsUniques.length > 1) {
          console.log(`🆕 [CREATE MOUVEMENT] Mouvement multi-projets détecté: ${projetsUniques.join(', ')}`);
        }

        // --- CALCUL VENTILATION FINANCIÈRE (Module 2) ---
        // Algorithme : Répartition équitable basée sur le nombre de passagers par projet
        const totalPassagers = passagers.length;
        if (totalPassagers > 0) {
          const ventilation = [];
          const projectCounts = {};

          // Compter les occurrences de chaque projet
          passagers.forEach(p => {
            const proj = p.projet || 'NON_AFFECTÉ';
            projectCounts[proj] = (projectCounts[proj] || 0) + 1;
          });

          // Calculer les pourcentages
          for (const [proj, count] of Object.entries(projectCounts)) {
            ventilation.push({
              projet: proj,
              percentage: parseFloat(((count / totalPassagers) * 100).toFixed(2))
            });
          }

          console.log('💰 [CREATE MOUVEMENT] Ventilation calculée:', ventilation);
          mouvement.projetsVentilation = ventilation;
        }
      } catch (err) {
        console.error('❌ [CREATE MOUVEMENT] Erreur lors de la récupération des projets des passagers:', err);
      }
    }

    const nouveauMouvement = await mouvement.save();
    console.log('✅ [CREATE MOUVEMENT] Mouvement créé avec succès!');
    console.log('✅ [CREATE MOUVEMENT] ID:', nouveauMouvement._id);
    console.log('✅ [CREATE MOUVEMENT] Statut final:', nouveauMouvement.statut);
    console.log('✅ [CREATE MOUVEMENT] Base finale:', nouveauMouvement.base);
    console.log('✅ [CREATE MOUVEMENT] Pays final:', nouveauMouvement.pays);

    res.status(201).json(nouveauMouvement);
  } catch (err) {
    console.error('❌ [CREATE MOUVEMENT] Erreur lors de la création du mouvement:', err);
    res.status(400).json({ message: err.message });
  }
});


// MISE À JOUR D'UN MOUVEMENT (PROTÉGÉE PAR RÔLE : Admin ou Superviseur peuvent valider/refuser/AFFECTER)
router.put('/mouvements/:id', auth(['SuperAdmin', 'Admin', 'Superviseur', 'Superviseur Sécurité']), countryFilter, async (req, res) => {
  try {
    console.log('=== DEBUG: PUT /mouvements/:id ===');
    console.log('Body reçu:', JSON.stringify(req.body, null, 2));
    const mouvement = await Mouvement.findById(req.params.id);
    if (mouvement == null) {
      return res.status(404).json({ message: 'Cannot find movement' });
    }
    console.log('Mouvement trouvé:', mouvement._id);
    console.log('Stops du mouvement:', JSON.stringify(mouvement.stops, null, 2));

    // --- LOGIQUE : Si le statut devient 'regroupé-enfant', désaffecter vehicule/chauffeur ---
    if (req.body.statut === 'regroupé-enfant') {
      mouvement.vehicule = null;
      mouvement.chauffeur = null;
    }

    // --- CONTRÔLES DE DISPONIBILITÉ ---
    // Les dates de départ/arrivée globales sont dérivées des stops par le hook pre-save.
    // Nous allons utiliser ces dates pour les contrôles de disponibilité.
    // Donc, nous devons récupérer les dates du premier et dernier stop après la mise à jour des stops.
    // newDateDepart et newDateArrivee seront définis par le body si stops sont modifiés, ou par l'objet mouvement existant.
    let newDateDepart;
    let newDateArrivee;

    // Déterminer les dates à utiliser pour le conflit
    if (req.body.stops && req.body.stops.length > 0) {
      console.log('Utilisation des stops du body');
      newDateDepart = new Date(req.body.stops[0].dateDepart);
      newDateArrivee = new Date(req.body.stops[req.body.stops.length - 1].dateArrivee);
    } else if (mouvement.stops && mouvement.stops.length > 0) {
      console.log('Utilisation des stops existants du mouvement');
      // Utiliser les stops existants du mouvement
      newDateDepart = new Date(mouvement.stops[0].dateDepart);
      newDateArrivee = new Date(mouvement.stops[mouvement.stops.length - 1].dateArrivee);
    } else {
      console.error('ERREUR: Aucun stop valide trouvé');
      return res.status(400).json({ message: 'Le mouvement doit avoir au moins un stop avec des dates valides.' });
    }

    console.log('Dates calculées - Départ:', newDateDepart, 'Arrivée:', newDateArrivee);

    // Validation si des dates sont manquantes
    if (!newDateDepart || !newDateArrivee || isNaN(newDateDepart.getTime()) || isNaN(newDateArrivee.getTime())) {
      console.error('ERREUR: Dates invalides - Départ:', newDateDepart, 'Arrivée:', newDateArrivee);
      return res.status(400).json({ message: 'Dates de mouvement invalides pour les vérifications de disponibilité.' });
    }


    const newVehiculeId = req.body.vehicule;
    const newChauffeurId = req.body.chauffeur;

    // Seulement si une tentative d'affectation est faite ET que les dates sont valides
    if ((newVehiculeId || newChauffeurId) && newDateDepart && newDateArrivee) {
      // 1. Vérifier si le chauffeur existe et a le bon profil
      if (newChauffeurId) {
        console.log('Vérification du chauffeur ID:', newChauffeurId);
        const chauffeur = await Utilisateur.findById(newChauffeurId);
        if (!chauffeur) {
          console.error('ERREUR: Chauffeur introuvable');
          return res.status(400).json({ message: 'Chauffeur sélectionné introuvable.' });
        }
        console.log('Chauffeur trouvé:', chauffeur.nom, 'Profil:', chauffeur.profil);
        if (chauffeur.profil !== 'Chauffeur') {
          console.error('ERREUR: Utilisateur n\'est pas un chauffeur');
          return res.status(400).json({ message: 'L\'utilisateur sélectionné n\'est pas un chauffeur.' });
        }

        // Vérifier les conflits d'horaire pour le chauffeur
        // Chevauchement si (A < D ET C < B)
        // A = newDateDepart, B = newDateArrivee (le mouvement que l'on veut affecter)
        // C = dateDepart d'un autre mouvement, D = dateArrivee d'un autre mouvement
        console.log('Vérification des conflits pour le chauffeur...');
        console.log('Dates du mouvement - Départ:', newDateDepart, 'Arrivée:', newDateArrivee);

        try {
          const conflitChauffeur = await Mouvement.findOne({
            _id: { $ne: mouvement._id }, // Exclure le mouvement actuel
            chauffeur: newChauffeurId,
            statut: { $in: ['en attente', 'validé', 'en cours'] }, // Statuts où le chauffeur est "occupé"
            dateDepart: { $lt: newDateArrivee }, // Le mouvement existant commence avant que le nouveau ne finisse
            dateArrivee: { $gt: newDateDepart }   // Et le mouvement existant se termine après que le nouveau ne commence
          });

          console.log('Résultat recherche conflit chauffeur:', conflitChauffeur ? 'CONFLIT TROUVÉ' : 'Pas de conflit');

          if (conflitChauffeur) {
            const conflitDepart = conflitChauffeur.stops[0].dateDepart.toLocaleString();
            const conflitArrivee = conflitChauffeur.stops[conflitChauffeur.stops.length - 1].dateArrivee.toLocaleString();
            return res.status(400).json({ message: `Le chauffeur est déjà affecté au mouvement du ${conflitDepart} au ${conflitArrivee}.` });
          }
        } catch (conflictErr) {
          console.error('ERREUR lors de la vérification des conflits chauffeur:', conflictErr);
          // Continuer sans vérification de conflit pour l'instant
        }
      }

      // 2. Vérifier les conflits d'horaire pour le véhicule
      if (newVehiculeId) {
        const vehicule = await Vehicule.findById(newVehiculeId);
        if (!vehicule) {
          return res.status(400).json({ message: 'Véhicule sélectionné introuvable.' });
        }

        const conflitVehicule = await Mouvement.findOne({
          _id: { $ne: mouvement._id },
          vehicule: newVehiculeId,
          statut: { $in: ['en attente', 'validé', 'en cours'] },
          dateDepart: { $lt: newDateArrivee },
          dateArrivee: { $gt: newDateDepart }
        });

        if (conflitVehicule) {
          const conflitDepart = conflitVehicule.stops[0].dateDepart.toLocaleString();
          const conflitArrivee = conflitVehicule.stops[conflitVehicule.stops.length - 1].dateArrivee.toLocaleString();
          return res.status(400).json({ message: `Le véhicule est déjà affecté au mouvement du ${conflitDepart} au ${conflitArrivee}.` });
        }
      }
    }


    // Mettre à jour les champs si présents dans le body
    if (req.body.stops != null) mouvement.stops = req.body.stops;
    if (req.body.demandeur != null) mouvement.demandeur = req.body.demandeur;
    // Ne pas affecter vehicule/chauffeur si le mouvement devient regroupé-enfant
    if (req.body.statut !== 'regroupé-enfant') {
      if (req.body.vehicule != null) mouvement.vehicule = newVehiculeId;
      if (req.body.chauffeur != null) mouvement.chauffeur = newChauffeurId;
    }
    if (req.body.passagers != null) mouvement.passagers = req.body.passagers;
    if (req.body.materiel != null) mouvement.materiel = req.body.materiel;
    if (req.body.objectif != null) mouvement.objectif = req.body.objectif;
    if (req.body.statut != null) mouvement.statut = req.body.statut;
    if (req.body.motifRefus != null) mouvement.motifRefus = req.body.motifRefus;
    if (req.body.parentMouvement != null) mouvement.parentMouvement = req.body.parentMouvement;
    if (req.body.enfantsMouvements != null) mouvement.enfantsMouvements = req.body.enfantsMouvements;
    if (req.body.isRoundTrip != null) mouvement.isRoundTrip = req.body.isRoundTrip; // NOUVEAU
    if (req.body.projetsVentilation != null) mouvement.projetsVentilation = req.body.projetsVentilation; // NOUVEAU : Correction manuelle ventilation

    const mouvementMisAJour = await mouvement.save();
    res.json(mouvementMisAJour);
  } catch (err) {
    console.error("Erreur UPDATE /mouvements/:id:", err);
    if (err.message.includes('validation failed')) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
});

// DÉMARRER UN MOUVEMENT (Chauffeur commence le trajet)
router.put('/mouvements/:id/start', auth(), countryFilter, async (req, res) => {
  try {
    console.log('🚗 [START MOUVEMENT] Démarrage du mouvement:', req.params.id);
    console.log('🚗 [START MOUVEMENT] Données reçues:', req.body);

    const mouvement = await Mouvement.findById(req.params.id);
    if (!mouvement) {
      return res.status(404).json({ message: 'Mouvement non trouvé' });
    }

    // Vérifier que le mouvement est dans un statut approprié
    if (!['validé', 'pris en charge'].includes(mouvement.statut)) {
      return res.status(400).json({
        message: `Le mouvement doit être validé ou pris en charge pour être démarré (statut actuel: ${mouvement.statut})`
      });
    }

    // Mettre à jour le statut et les données de démarrage
    mouvement.statut = 'en cours';
    mouvement.realDepartureTime = req.body.realDepartureTime || new Date();

    if (req.body.startMileage) {
      mouvement.startMileage = req.body.startMileage;
    }

    const mouvementMisAJour = await mouvement.save();
    console.log('✅ [START MOUVEMENT] Mouvement démarré avec succès');
    console.log('✅ [START MOUVEMENT] Nouveau statut:', mouvementMisAJour.statut);

    res.json(mouvementMisAJour);
  } catch (err) {
    console.error('❌ [START MOUVEMENT] Erreur:', err);
    return res.status(500).json({ message: err.message });
  }
});

// VALIDATION SÉCURISÉE (MODULE 2)
router.put('/mouvements/:id/validate', auth(), countryFilter, async (req, res) => {
  try {
    console.log('🛡️ [VALIDATE MOUVEMENT] Tentative de validation:', req.params.id);
    console.log('🛡️ [VALIDATE MOUVEMENT] Valideur:', req.utilisateur.nom, 'Niveau:', req.utilisateur.niveauValidationSecu);

    const mouvement = await Mouvement.findById(req.params.id);
    if (!mouvement) {
      return res.status(404).json({ message: 'Mouvement non trouvé' });
    }

    // 1. Vérifier si le mouvement nécessite une validation spéciale
    const requiredLevel = mouvement.validationLevelRequired || 1; // Défaut à 1 (Stable)
    console.log('🛡️ [VALIDATE MOUVEMENT] Niveau requis:', requiredLevel);

    // 2. Vérifier si l'utilisateur a le droit de valider ce niveau
    // Le niveau de l'utilisateur doit être >= au niveau de risque du trajet
    if (req.utilisateur.niveauValidationSecu < requiredLevel) {
      console.warn('⛔ [VALIDATE MOUVEMENT] Accès refusé: Niveau insuffisant.');
      return res.status(403).json({
        message: `Validation impossible. Ce trajet de niveau ${requiredLevel} nécessite une habilitation de sécurité supérieure à la vôtre (${req.utilisateur.niveauValidationSecu}).`
      });
    }

    // 3. Procéder à la validation
    mouvement.statut = 'validé';

    // Historique de validation (Tracing)
    mouvement.validationHistory.push({
      validatedBy: req.utilisateur.id,
      validatedAt: new Date(),
      level: requiredLevel,
      status: 'validé'
    });

    const mouvementValide = await mouvement.save();
    console.log('✅ [VALIDATE MOUVEMENT] Validé avec succès par:', req.utilisateur.nom);

    res.json(mouvementValide);
  } catch (err) {
    console.error('❌ [VALIDATE MOUVEMENT] Erreur:', err);
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/mouvements/suggestions/:id - Suggestions de regroupement (placeholder)
router.get('/mouvements/suggestions/:id', auth(), async (req, res) => {
  try {
    // Pour l'instant, retourner un tableau vide
    // Cette fonctionnalité pourrait être implémentée plus tard pour suggérer
    // des mouvements similaires à regrouper
    res.json([]);
  } catch (err) {
    console.error("Erreur GET /mouvements/suggestions/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

// SUPPRESSION D'UN MOUVEMENT (PROTÉGÉE PAR RÔLE : Admin et SuperAdmin peuvent supprimer)
router.delete('/mouvements/:id', auth(['SuperAdmin', 'Admin']), countryFilter, async (req, res) => {
  try {
    const mouvement = await Mouvement.findById(req.params.id);
    if (mouvement == null) {
      return res.status(404).json({ message: 'Cannot find movement' });
    }
    const vehiculeId = mouvement.vehicule;
    await mouvement.deleteOne();

    // Recalculer le kilométrage du véhicule après suppression
    if (vehiculeId) {
      try {
        const { recalculateVehicleMileage } = require('../utils/mileage-sync');
        await recalculateVehicleMileage(vehiculeId);
      } catch (syncErr) {
        console.error('Erreur lors de la synchro kilométrage après suppression:', syncErr);
      }
    }

    res.json({ message: 'Mouvement supprimé' });
  } catch (err) {
    console.error("Erreur DELETE /mouvements/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

// NETTOYAGE DES MOUVEMENTS FANTÔMES (Mouvements 'regroupé' sans parent valide)
router.delete('/mouvements/cleanup/ghosts', auth(['SuperAdmin', 'Admin']), async (req, res) => {
  try {
    console.log('🧹 [CLEANUP GHOSTS] Démarrage du nettoyage des mouvements regroupés orphelins...');

    // 1. Trouver les mouvements potentiellement orphelins (statut 'regroupé')
    // Populating parentMouvement permet de voir s'il est null (car supprimé) ou présent
    const mouvementsGroupes = await Mouvement.find({ statut: 'regroupé' }).populate('parentMouvement');

    console.log(`🧹 [CLEANUP GHOSTS] ${mouvementsGroupes.length} mouvements regroupés trouvés au total.`);

    const ghostsToDelete = [];

    for (const m of mouvementsGroupes) {
      // Un mouvement est orphelin si:
      // - Il a un parentMouvement ID défini
      // - MAIS le document parent n'a pas été trouvé par le populate (donc null)
      // - OU s'il n'a carrément pas de parentMouvement alors qu'il est 'regroupé'

      // Note: mongoose populate retourne null si l'ID référencé n'existe plus
      if (!m.parentMouvement && m.parentMouvement !== undefined) {
        // Double vérification par ID brut au cas où populate n'a pas été demandé explicitement pour certains champs
        // Mais ici on l'a demandé donc m.parentMouvement est l'objet ou null.

        /* Cas subtil: si le champ parentMouvement n'existe pas du tout sur le doc, c'est aussi un fantôme
           car un 'regroupé' doit avoir un parent.
        */

        ghostsToDelete.push(m._id);
      }
    }

    console.log(`🧹 [CLEANUP GHOSTS] ${ghostsToDelete.length} orphelins détectés (fantômes) à supprimer.`);

    if (ghostsToDelete.length > 0) {
      const result = await Mouvement.deleteMany({ _id: { $in: ghostsToDelete } });
      console.log(`✅ [CLEANUP GHOSTS] ${result.deletedCount} mouvements supprimés.`);
      return res.json({
        message: 'Nettoyage terminé',
        deletedCount: result.deletedCount,
        ghostsFound: ghostsToDelete.length
      });
    } else {
      console.log('✅ [CLEANUP GHOSTS] Aucun fantôme trouvé.');
      return res.json({ message: 'Aucun mouvement fantôme trouvé', deletedCount: 0 });
    }

  } catch (err) {
    console.error("❌ [CLEANUP GHOSTS] Erreur:", err);
    return res.status(500).json({ message: err.message });
  }
});


// FIX: Route de réparation automatique des pays manquants
router.post('/mouvements/fix-countries', auth(), async (req, res) => {
  try {
    console.log('🔧 [FIX COUNTRIES] Démarrage de la réparation des pays manquants...');

    // Trouver les mouvements sans pays
    const orphanMovements = await Mouvement.find({
      pays: { $exists: false }
    }).populate('chauffeur'); // On a besoin du chauffeur pour déduire le pays

    console.log(`🔧 [FIX COUNTRIES] ${orphanMovements.length} mouvements sans pays trouvés.`);

    let fixedCount = 0;
    const errors = [];

    for (const mvt of orphanMovements) {
      if (mvt.chauffeur) {
        // Récupérer le pays du chauffeur (si populated n'a pas tout ramené)
        // Note: mvt.chauffeur est l'objet Utilisateur car populated

        // Si le chauffeur object n'a pas le pays populated, on doit le fetcher
        let chauffeurPaysId = null;

        // Check if chauffeur is an object and has pays
        if (mvt.chauffeur.pays) {
          chauffeurPaysId = mvt.chauffeur.pays; // Might be ID or Object depending on Utilisateur schema populate
        } else {
          // Fetch fresh user to be sure
          const user = await Utilisateur.findById(mvt.chauffeur._id);
          chauffeurPaysId = user ? user.pays : null;
        }

        if (chauffeurPaysId) {
          mvt.pays = chauffeurPaysId;
          await mvt.save();
          fixedCount++;
          console.log(`✅ [FIX COUNTRIES] Mouvement ${mvt._id} assigné au pays ${chauffeurPaysId}`);
        } else {
          console.warn(`⚠️ [FIX COUNTRIES] Mouvement ${mvt._id}: Chauffeur ${mvt.chauffeur.nom} n'a pas de pays.`);
        }
      } else {
        // Fallback: Use Current User's country if user triggered it and no chauffeur
        if (req.utilisateur.pays) {
          mvt.pays = req.utilisateur.pays;
          await mvt.save();
          fixedCount++;
          console.log(`✅ [FIX COUNTRIES] Mouvement ${mvt._id} assigné au pays de l'admin (fallback) ${req.utilisateur.pays}`);
        } else {
          console.warn(`⚠️ [FIX COUNTRIES] Mouvement ${mvt._id}: Pas de chauffeur et admin sans pays.`);
        }
      }
    }

    res.json({
      message: 'Réparation terminée',
      found: orphanMovements.length,
      fixed: fixedCount
    });

  } catch (err) {
    console.error('❌ [FIX COUNTRIES] Erreur:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
