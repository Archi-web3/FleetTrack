const express = require('express');
const router = express.Router();
const Vehicule = require('../models/vehicule.model');
const auth = require('../middleware/authMiddleware');

// GET all vehicles (Filtré par base)
router.get('/vehicules', auth(), async (req, res) => {
  try {
    let query = {};
    // Si l'utilisateur est rattaché à une base, on filtre
    if (req.utilisateur.base) {
      query.base = req.utilisateur.base;
    }
    // Filtre MULTI-PAYS : Filtrer par pays sélectionné
    if (req.selectedCountry) {
      query.pays = req.selectedCountry;
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
  const vehicule = new Vehicule({
    ...req.body // Use spread operator to include all fields from body
  });
  try {
    const nouveauVehicule = await vehicule.save();
    console.log("Nouveau véhicule créé:", nouveauVehicule);
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

    // Update all fields from body
    Object.assign(vehicule, req.body);

    const vehiculeMisAJour = await vehicule.save();
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
