const express = require('express');
const router = express.Router();
const Mouvement = require('../models/mouvement.model');
const Fuel = require('../models/fuel.model');
const Maintenance = require('../models/maintenance.model');
const Incident = require('../models/incident.model');
const Lieu = require('../models/lieu.model'); // Import Lieu model
const Vehicule = require('../models/vehicule.model'); // Import Vehicule model
// const auth = require('../middleware/authMiddleware'); // À activer plus tard

console.log('🔹 LOGBOOK ROUTES LOADED 🔹');

// --- GET /my-trips ---
// Returns only movements assigned to the authenticated driver
// --- GET /my-trips ---
// Returns only movements assigned to the authenticated driver
router.get('/my-trips', async (req, res) => {
    try {
        console.log('--- GET /my-trips REQUEST ---');
        // Get user from token (assuming auth middleware sets req.user)
        const token = req.header('x-auth-token');
        if (!token) {
            console.warn('No token provided');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const jwt = require('jsonwebtoken');
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        } catch (jwtErr) {
            console.error('JWT Verification failed:', jwtErr.message);
            return res.status(401).json({ message: 'Invalid token' });
        }

        console.log('Token decoded payload:', JSON.stringify(decoded));

        const userId = decoded.utilisateur?.id || decoded.id; // Support both token formats
        if (!userId) {
            console.error('No userId found in token payload');
            return res.status(400).json({ message: 'Invalid token payload' });
        }
        console.log('Extracted userId:', userId);

        // Get user to verify they are a driver
        const Utilisateur = require('../models/utilisateur.model');
        let user;
        try {
            user = await Utilisateur.findById(userId);
        } catch (dbErr) {
            console.error('Error finding user by ID:', dbErr);
            return res.status(500).json({ message: 'Database error finding user' });
        }

        if (!user) {
            console.warn('User not found in DB:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify user is a driver
        if (user.profil !== 'Chauffeur') {
            // If user is not a driver, return empty array
            console.log(`User ${user.nom} is not a valid Chauffeur (${user.profil}), returning empty list.`);
            return res.json([]);
        }

        console.log(`Fetching trips for driver: ${user.nom} (${userId})`);

        // Get movements assigned to this driver (using userId directly)
        // We use try/catch specifically for the query to identify if populate fails
        let trips;
        try {
            trips = await Mouvement.find({
                chauffeur: userId,  // Use userId directly since chauffeur references Utilisateur
                statut: { $in: ['validé', 'pris en charge', 'en cours', 'terminé'] } // Added 'terminé' just in case
            })
                .populate('vehicule')
                .populate('chauffeur')
                .populate('passagers')
                .populate('stops.lieu')
                .sort({ dateDepart: 1 }); // Sort by departure date
        } catch (queryErr) {
            console.error('Error querying movements:', queryErr);
            return res.status(500).json({ message: 'Error querying movements: ' + queryErr.message });
        }

        console.log(`Found ${trips ? trips.length : 0} trips for driver ${user.nom}`);
        res.json(trips || []);
    } catch (err) {
        console.error('CRITICAL Error in /my-trips:', err);
        console.error(err.stack);
        res.status(500).json({ message: err.message });
    }
});

// --- POST /take-charge/:id ---
// Allow driver to take charge of a validated mission
router.post('/take-charge/:id', async (req, res) => {
    try {
        // Get user from token
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userId = decoded.utilisateur?.id || decoded.id; // Support both token formats

        // Get user to verify they are a driver
        const Utilisateur = require('../models/utilisateur.model');
        const user = await Utilisateur.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify user is a driver
        if (user.profil !== 'Chauffeur') {
            return res.status(403).json({ message: 'User is not a driver' });
        }

        // Find movement
        const movement = await Mouvement.findById(req.params.id);
        if (!movement) {
            return res.status(404).json({ message: 'Movement not found' });
        }

        // Verify this movement is assigned to this driver (using userId directly)
        if (movement.chauffeur.toString() !== userId) {
            return res.status(403).json({ message: 'This movement is not assigned to you' });
        }

        // Verify movement is in 'validé' status
        if (movement.statut !== 'validé') {
            return res.status(400).json({ message: 'Movement must be validated to take charge' });
        }

        // Update movement
        movement.statut = 'pris en charge';
        movement.takenInChargeAt = new Date();
        movement.takenInChargeBy = userId;  // Use userId directly

        await movement.save();

        // Return updated movement with populated fields
        const updatedMovement = await Mouvement.findById(movement._id)
            .populate('vehicule')
            .populate('chauffeur')
            .populate('passagers')
            .populate('stops.lieu');

        console.log(`Movement ${movement._id} taken in charge by ${user.nom}`);
        res.json(updatedMovement);
    } catch (err) {
        console.error('Error in /take-charge:', err);
        res.status(500).json({ message: err.message });
    }
});

// --- GET /fuels/:vehicleId ---
router.get('/fuels/:vehicleId', async (req, res) => {
    try {
        const fuels = await Fuel.find({ vehicule: req.params.vehicleId }).sort({ date: -1 });
        res.json(fuels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- GET /maintenances/:vehicleId ---
router.get('/maintenances/:vehicleId', async (req, res) => {
    try {
        const maintenances = await Maintenance.find({ vehicule: req.params.vehicleId }).sort({ date: -1 });
        res.json(maintenances);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- GET /incidents/:vehicleId ---
router.get('/incidents/:vehicleId', async (req, res) => {
    try {
        const incidents = await Incident.find({ vehicule: req.params.vehicleId }).sort({ date: -1 });
        res.json(incidents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- POST /sync ---
router.post('/sync', async (req, res) => {
    console.log("--- SYNC REQUEST RECEIVED ---");
    const { trips, fuels, maintenances, incidents, vehicles } = req.body;
    const results = {
        trips: { success: 0, failed: 0, errors: [], items: [] },
        fuels: { success: 0, failed: 0, errors: [], items: [] },
        maintenances: { success: 0, failed: 0, errors: [], items: [] },
        incidents: { success: 0, failed: 0, errors: [], items: [] },
        vehicles: { success: 0, failed: 0, errors: [], items: [] }
    };

    // 0. Sync Vehicles (First, as others depend on it)
    if (vehicles && Array.isArray(vehicles)) {
        for (const vehicleData of vehicles) {
            try {
                // Check if vehicle exists by ID or Immatriculation
                let existingVehicle = null;
                if (vehicleData.serverId) {
                    existingVehicle = await Vehicule.findById(vehicleData.serverId);
                } else if (vehicleData.immatriculation) {
                    existingVehicle = await Vehicule.findOne({ immatriculation: vehicleData.immatriculation });
                }

                if (existingVehicle) {
                    // Update existing vehicle
                    Object.assign(existingVehicle, vehicleData);
                    // Ensure we don't overwrite _id with local id
                    if (vehicleData.serverId) existingVehicle._id = vehicleData.serverId;

                    await existingVehicle.save();
                    results.vehicles.success++;
                    results.vehicles.items.push({ _id: existingVehicle._id, status: 'updated' });
                } else {
                    // Create new vehicle
                    const newVehicle = new Vehicule(vehicleData);
                    // Remove local ID if present
                    delete newVehicle._id;

                    const savedVehicle = await newVehicle.save();
                    results.vehicles.success++;
                    results.vehicles.items.push({ _id: savedVehicle._id, status: 'created' });
                }
            } catch (err) {
                console.error("Error syncing vehicle:", err);
                results.vehicles.failed++;
                results.vehicles.items.push({ error: err.message });
            }
        }
    }

    // 1. Sync Trips (Mouvements)
    if (trips && Array.isArray(trips)) {
        // Fetch a default location for fallback if needed
        let defaultLieu;
        try {
            defaultLieu = await Lieu.findOne();
            if (!defaultLieu) {
                defaultLieu = await new Lieu({ nom: 'Inconnu', adresse: 'Inconnu' }).save();
            }
        } catch (e) {
            console.error("Error fetching default lieu:", e);
        }

        for (const tripData of trips) {
            try {
                // ✅ 1. CHECK FOR PLANNED MOVEMENT (UPDATE)
                if (tripData.plannedMovementId) {
                    const plannedMvt = await Mouvement.findById(tripData.plannedMovementId);
                    if (plannedMvt) {
                        console.log(`Updating planned movement ${tripData.plannedMovementId} with real data`);

                        plannedMvt.statut = 'terminé';
                        plannedMvt.realDepartureTime = tripData.startDateTime;
                        plannedMvt.realArrivalTime = tripData.endDateTime;
                        plannedMvt.startMileage = tripData.startMileage;
                        plannedMvt.endMileage = tripData.endMileage;
                        plannedMvt.driverObservations = tripData.purpose;
                        plannedMvt.isLocked = true;

                        // NOTE: We do NOT update stops dates to preserve the original planned dates
                        // The actual dates are stored in realDepartureTime and realArrivalTime
                        // if (plannedMvt.stops && plannedMvt.stops.length > 0) {
                        //     plannedMvt.stops[0].dateDepart = tripData.startDateTime;
                        //     if (plannedMvt.stops.length > 1) {
                        //         plannedMvt.stops[plannedMvt.stops.length - 1].dateArrivee = tripData.endDateTime;
                        //     }
                        // }

                        // Populate project from demandeur if not already set
                        if (!plannedMvt.projet && plannedMvt.demandeur) {
                            try {
                                const demandeur = await Utilisateur.findById(plannedMvt.demandeur);
                                if (demandeur && demandeur.projet) {
                                    plannedMvt.projet = demandeur.projet;
                                    console.log(`Projet assigné au mouvement ${plannedMvt._id} depuis le demandeur: ${plannedMvt.projet}`);
                                }
                            } catch (err) {
                                console.error('Erreur lors de la récupération du projet du demandeur:', err);
                            }
                        }

                        // Populate projetsPassagers from all passengers
                        if (plannedMvt.passagers && plannedMvt.passagers.length > 0) {
                            try {
                                const passagers = await Utilisateur.find({ _id: { $in: plannedMvt.passagers } });
                                const projetsUniques = [...new Set(passagers.map(p => p.projet).filter(p => p))];
                                plannedMvt.projetsPassagers = projetsUniques;

                                if (projetsUniques.length > 1) {
                                    console.log(`Mouvement ${plannedMvt._id} multi-projets: ${projetsUniques.join(', ')}`);
                                }
                            } catch (err) {
                                console.error('Erreur lors de la récupération des projets des passagers:', err);
                            }
                        }

                        await plannedMvt.save();
                        results.trips.success++;
                        results.trips.items.push({ _id: plannedMvt._id, status: 'updated' });
                        continue; // Done with this one
                    }
                }

                // ✅ 2. CHECK IF TRIP ALREADY EXISTS (DUPLICATE CHECK)
                // Match by vehicleId, startMileage, and endMileage to avoid duplicates
                const existingTrip = await Mouvement.findOne({
                    vehicule: tripData.vehicleId,
                    startMileage: tripData.startMileage,
                    endMileage: tripData.endMileage
                });

                if (existingTrip) {
                    console.log(`Trip already exists for vehicle ${tripData.vehicleId} (${tripData.startMileage}km → ${tripData.endMileage}km), skipping`);
                    results.trips.success++;
                    results.trips.items.push({ _id: existingTrip._id, status: 'exists' }); // ✅ Return ID
                    continue; // Skip creation
                }

                // ✅ 3. CREATE NEW MOVEMENT (IF NOT PLANNED OR FOUND)
                // Use selected places or default if missing
                const lieuDepartId = tripData.departurePlaceId || defaultLieu._id;
                const lieuArriveeId = tripData.arrivalPlaceId || defaultLieu._id;

                // Fetch driver to get their base
                const Utilisateur = require('../models/utilisateur.model');
                let driverBase = null;
                try {
                    const driver = await Utilisateur.findById(tripData.driverId);
                    if (driver && driver.base) {
                        driverBase = driver.base;
                        console.log(`Assigning base ${driverBase} from driver ${driver.nom} to new movement`);
                    }
                } catch (err) {
                    console.error('Error fetching driver base:', err);
                }

                const newMouvement = new Mouvement({
                    vehicule: tripData.vehicleId,
                    chauffeur: tripData.driverId,
                    demandeur: tripData.driverId, // Self-assigned
                    passagers: tripData.passengerIds || [], // Add passengers
                    base: driverBase, // ✅ ADD BASE FROM DRIVER

                    // Stops are required by schema
                    stops: [
                        {
                            lieu: lieuDepartId,
                            dateDepart: tripData.startDateTime
                        },
                        {
                            lieu: lieuArriveeId,
                            dateArrivee: tripData.endDateTime
                        }
                    ],

                    datePrevue: tripData.startDateTime,
                    heureDepart: tripData.startDateTime,
                    heureArrivee: tripData.endDateTime,
                    lieuDepart: 'Non spécifié', // Could fetch name if needed, but ID is in stops
                    lieuArrivee: 'Non spécifié',
                    motif: tripData.purpose,
                    objectif: tripData.purpose, // ✅ ADD objectif field for proper sync back
                    statut: 'terminé',

                    // Real data
                    realDepartureTime: tripData.startDateTime,
                    realArrivalTime: tripData.endDateTime,
                    startMileage: tripData.startMileage,
                    endMileage: tripData.endMileage,
                    driverObservations: tripData.purpose,
                    isLocked: true
                });

                await newMouvement.save();
                console.log(`Created new trip for vehicle ${tripData.vehicleId} (${tripData.startMileage}km → ${tripData.endMileage}km)`);
                results.trips.success++;
                results.trips.items.push({ _id: newMouvement._id, status: 'created' }); // ✅ Return ID

            } catch (err) {
                console.error("Error syncing trip:", err);
                results.trips.failed++;
                results.trips.errors.push({ id: tripData._id, error: err.message });
                results.trips.items.push({ status: 'error', error: err.message }); // Keep order
            }
        }
    }

    // 2. Sync Fuels
    if (fuels && Array.isArray(fuels)) {
        for (const fuelData of fuels) {
            try {
                // ✅ CHECK IF FUEL ALREADY EXISTS
                // Match by vehicleId, date, and mileage to avoid duplicates
                const existingFuel = await Fuel.findOne({
                    vehicule: fuelData.vehicleId,
                    date: fuelData.date,
                    mileage: fuelData.mileage
                });

                if (existingFuel) {
                    console.log(`Fuel already exists for vehicle ${fuelData.vehicleId} at ${fuelData.mileage}km, skipping`);
                    results.fuels.success++;
                    results.fuels.items.push({ _id: existingFuel._id, status: 'exists' }); // ✅ Return ID
                    continue; // Skip creation
                }

                // Create new fuel only if it doesn't exist
                const newFuel = new Fuel({
                    vehicule: fuelData.vehicleId,
                    chauffeur: fuelData.driverId,
                    date: fuelData.date,
                    quantity: fuelData.quantity,
                    mileage: fuelData.mileage,
                    fuelType: fuelData.type, // Map 'type' to 'fuelType'
                    source: fuelData.source,
                    fullTank: fuelData.isFull !== undefined ? fuelData.isFull : true, // Map isFull to fullTank
                    price: fuelData.price, // Add price
                    photos: fuelData.photos || [] // NOUVEAU: Copier les photos
                });
                await newFuel.save();
                console.log(`Created new fuel for vehicle ${fuelData.vehicleId} at ${fuelData.mileage}km`);
                results.fuels.success++;
                results.fuels.items.push({ _id: newFuel._id, status: 'created' }); // ✅ Return ID
            } catch (err) {
                console.error("Error syncing fuel:", err);
                results.fuels.failed++;
                results.fuels.errors.push({ data: fuelData, error: err.message });
                results.fuels.items.push({ status: 'error', error: err.message }); // Keep order
            }
        }
    }

    // 3. Sync Maintenances
    if (maintenances && Array.isArray(maintenances)) {
        for (const maintData of maintenances) {
            try {
                // ✅ CHECK IF MAINTENANCE ALREADY EXISTS
                const existingMaint = await Maintenance.findOne({
                    vehicule: maintData.vehicleId,
                    date: maintData.date,
                    mileage: maintData.mileage
                });

                if (existingMaint) {
                    console.log(`Maintenance already exists for vehicle ${maintData.vehicleId} at ${maintData.mileage}km, skipping`);
                    results.maintenances.success++;
                    results.maintenances.items.push({ _id: existingMaint._id, status: 'exists' }); // ✅ Return ID
                    continue;
                }

                const newMaint = new Maintenance({
                    vehicule: maintData.vehicleId,
                    date: maintData.date,
                    type: maintData.type,
                    mileage: maintData.mileage,
                    garage: maintData.garage,
                    cost: maintData.cost
                });
                await newMaint.save();
                console.log(`Created new maintenance for vehicle ${maintData.vehicleId} at ${maintData.mileage}km`);
                results.maintenances.success++;
                results.maintenances.items.push({ _id: newMaint._id, status: 'created' }); // ✅ Return ID
            } catch (err) {
                console.error("Error syncing maintenance:", err);
                results.maintenances.failed++;
                results.maintenances.errors.push({ data: maintData, error: err.message });
                results.maintenances.items.push({ status: 'error', error: err.message }); // Keep order
            }
        }
    }

    // 4. Sync Incidents
    if (incidents && Array.isArray(incidents)) {
        for (const incData of incidents) {
            try {
                // ✅ CHECK IF INCIDENT ALREADY EXISTS
                const existingInc = await Incident.findOne({
                    vehicule: incData.vehicleId,
                    date: incData.date,
                    type: incData.type
                });

                if (existingInc) {
                    console.log(`Incident already exists for vehicle ${incData.vehicleId} on ${incData.date}, skipping`);
                    results.incidents.success++;
                    results.incidents.items.push({ _id: existingInc._id, status: 'exists' }); // ✅ Return ID
                    continue;
                }

                const newInc = new Incident({
                    vehicule: incData.vehicleId,
                    chauffeur: incData.driverId,
                    date: incData.date,
                    type: incData.type,
                    severity: incData.severity,
                    description: incData.description,
                    photos: incData.photos || [], // AJOUTÉ: Copier les photos depuis e-logbook
                    cost: incData.cost // AJOUTÉ: Copier le coût
                });
                await newInc.save();
                console.log(`Created new incident for vehicle ${incData.vehicleId} on ${incData.date}`);
                results.incidents.success++;
                results.incidents.items.push({ _id: newInc._id, status: 'created' }); // ✅ Return ID
            } catch (err) {
                console.error("Error syncing incident:", err);
                results.incidents.failed++;
                results.incidents.errors.push({ data: incData, error: err.message });
                results.incidents.items.push({ status: 'error', error: err.message }); // Keep order
            }
        }
    }

    res.json({ message: 'Synchronisation terminée', results });
});



// --- DELETE /fuels/:id ---
router.delete('/fuels/:id', async (req, res) => {
    try {
        const fuel = await Fuel.findById(req.params.id);
        if (!fuel) return res.status(404).json({ message: 'Fuel not found' });
        await fuel.deleteOne();
        res.json({ message: 'Fuel deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- PUT /fuels/:id ---
router.put('/fuels/:id', async (req, res) => {
    try {
        const fuel = await Fuel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!fuel) return res.status(404).json({ message: 'Fuel not found' });
        res.json(fuel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- DELETE /maintenances/:id ---
router.delete('/maintenances/:id', async (req, res) => {
    try {
        const maintenance = await Maintenance.findById(req.params.id);
        if (!maintenance) return res.status(404).json({ message: 'Maintenance not found' });
        await maintenance.deleteOne();
        res.json({ message: 'Maintenance deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- PUT /maintenances/:id ---
router.put('/maintenances/:id', async (req, res) => {
    try {
        const maintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!maintenance) return res.status(404).json({ message: 'Maintenance not found' });
        res.json(maintenance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- DELETE /incidents/:id ---
router.delete('/incidents/:id', async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);
        if (!incident) return res.status(404).json({ message: 'Incident not found' });
        await incident.deleteOne();
        res.json({ message: 'Incident deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- PUT /incidents/:id ---
router.put('/incidents/:id', async (req, res) => {
    try {
        const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!incident) return res.status(404).json({ message: 'Incident not found' });
        res.json(incident);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
