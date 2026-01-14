const express = require('express');
const router = express.Router();
const Vehicule = require('../models/vehicule.model');
const auth = require('../middleware/authMiddleware');
const countryFilter = require('../middleware/countryFilter'); // NOUVEAU: Middleware de filtrage pays

// GET all vehicles (Filtré par base)
router.get('/vehicules', auth(), countryFilter, async (req, res) => {
  try {
    let query = {
      ...req.countryFilter  // NOUVEAU: Filtre pays automatique
    };
    // Si l'utilisateur est rattaché à une base, on filtre
    if (req.utilisateur.base) {
      query.base = req.utilisateur.base;
    }
    const vehicules = await Vehicule.find(query).populate('base', 'nom code').populate('pays', 'nom code');
    res.json(vehicules);
  } catch (err) {
    console.error("Erreur GET /vehicules:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET one vehicle (PROTÉGÉE - Accessible à tout utilisateur connecté)
router.get('/vehicules/:id', auth(), async (req, res) => { // <<< AJOUTÉ auth()
  try {
    const vehicule = await Vehicule.findById(req.params.id);
    if (vehicule == null) {
      return res.status(404).json({ message: 'Cannot find vehicle' });
    }
    res.json(vehicule);
  } catch (err) {
    console.error("Erreur GET /vehicules/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

// CREATE one vehicle
router.post('/vehicules', auth(['SuperAdmin', 'Admin', 'Superviseur']), async (req, res) => {

  // ✅ AUTO-INIT: Si kilométrage initial fourni mais pas le kilométrage actuel, on l'initialise
  if (req.body.kilometrageInitial && !req.body.kilometrage) {
    req.body.kilometrage = req.body.kilometrageInitial;
  }

  const vehicule = new Vehicule({
    ...req.body // Use spread operator to include all fields from body
  });
  try {
    const nouveauVehicule = await vehicule.save();
    console.log("Nouveau véhicule créé:", nouveauVehicule);

    // 🔧 AUTO-GÉNÉRATION: Initialiser les services de maintenance
    try {
      const { generateServiceSchedules } = require('../utils/maintenance-automation');
      await generateServiceSchedules(nouveauVehicule._id, nouveauVehicule.kilometrage);
      console.log('✅ Services de maintenance initialisés pour le nouveau véhicule');
    } catch (maintenanceError) {
      console.error('⚠️ [VEHICULE CREATE] Erreur init maintenance:', maintenanceError);
    }

    res.status(201).json(nouveauVehicule);
  } catch (err) {
    console.error("Erreur CREATE /vehicules:", err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE one vehicle
router.put('/vehicules/:id', auth(['SuperAdmin', 'Admin', 'Superviseur']), async (req, res) => {
  try {
    const vehicule = await Vehicule.findById(req.params.id);
    if (vehicule == null) {
      return res.status(404).json({ message: 'Cannot find vehicle' });
    }

    // Stocker l'ancien kilométrage et km initial pour détecter les changements
    const oldKilometrage = vehicule.kilometrage;
    const oldInitialKm = vehicule.kilometrageInitial || 0;

    // STAGE 1: Update fields from body
    Object.assign(vehicule, req.body);

    // 🔧 AUTO-RESET: Si le km initial a changé et qu'on ne met pas à jour le km actuel explicitement,
    // réinitialiser le km actuel au nouveau km initial
    const initialKmHasChanged = req.body.kilometrageInitial && req.body.kilometrageInitial !== oldInitialKm;
    const kmNotExplicitlySet = !req.body.kilometrage || req.body.kilometrage === oldKilometrage;

    if (initialKmHasChanged && kmNotExplicitlySet) {
      console.log(`🔄 [AUTO-RESET] Km Initial changé (${oldInitialKm} → ${vehicule.kilometrageInitial}). Réinitialisation du Km Actuel...`);
      vehicule.kilometrage = vehicule.kilometrageInitial;
    }

    // 🔧 AUTO-CORRECTION: Kilométrage actuel ne peut jamais être inférieur au kilométrage initial
    if (vehicule.kilometrageInitial && vehicule.kilometrage < vehicule.kilometrageInitial) {
      console.log(`🚗 [AUTO-FIX] Km Actuel (${vehicule.kilometrage}) < Km Initial (${vehicule.kilometrageInitial}). Ajustement...`);
      vehicule.kilometrage = vehicule.kilometrageInitial;
    }

    const vehiculeMisAJour = await vehicule.save();

    // 🔧 AUTO-GÉNÉRATION: Si le km a changé OU si le km initial a changé
    const kmHasChanged = req.body.kilometrage && req.body.kilometrage !== oldKilometrage;
    const initialKmHasChanged = req.body.kilometrageInitial && req.body.kilometrageInitial !== oldInitialKm;

    if (kmHasChanged || initialKmHasChanged) {
      try {
        const { generateServiceSchedules, updateServiceStatuses } = require('../utils/maintenance-automation');

        console.log(`🚗 [VEHICULE UPDATE] Déclencheur: ${kmHasChanged ? 'Km Actuel' : ''} ${initialKmHasChanged ? 'Km Initial' : ''}`);
        console.log(`   - Km: ${oldKilometrage} → ${vehiculeMisAJour.kilometrage}`);
        console.log(`   - Initial: ${oldInitialKm} → ${vehiculeMisAJour.kilometrageInitial}`);

        // Générer les nouveaux services manquants (et nettoyer les anciens si kmInitial augmente)
        const createdServices = await generateServiceSchedules(vehiculeMisAJour._id, vehiculeMisAJour.kilometrage);

        // Mettre à jour les statuts des services existants
        await updateServiceStatuses(vehiculeMisAJour._id, vehiculeMisAJour.kilometrage);

        // Retourner le véhicule + info sur les services créés
        return res.json({
          vehicule: vehiculeMisAJour,
          servicesGeneres: createdServices.length,
          services: createdServices
        });
      } catch (maintenanceError) {
        console.error('⚠️ [VEHICULE UPDATE] Erreur génération maintenance:', maintenanceError);
        // On retourne quand même le véhicule mis à jour, mais avec un warning
        return res.json({
          vehicule: vehiculeMisAJour,
          maintenanceWarning: maintenanceError.message
        });
      }
    }

    res.json(vehiculeMisAJour);
  } catch (err) {
    console.error("Erreur UPDATE /vehicules/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

// DELETE one vehicle (PROTÉGÉE PAR RÔLE : SuperAdmin ou Admin)
router.delete('/vehicules/:id', auth(['SuperAdmin', 'Admin']), async (req, res) => { // <<< PROTECTION PAR RÔLE
  try {
    const vehicule = await Vehicule.findById(req.params.id);
    if (vehicule == null) {
      return res.status(404).json({ message: 'Cannot find vehicle' });
    }
    await vehicule.deleteOne();
    res.json({ message: 'Vehicule supprimé' });
  } catch (err) {
    console.error("Erreur DELETE /vehicules/:id:", err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
