const express = require('express');
const router = express.Router();
const Mouvement = require('../models/mouvement.model');
const Utilisateur = require('../models/utilisateur.model');
const Vehicule = require('../models/vehicule.model');
const auth = require('../middleware/authMiddleware');

// GET /api/stats/global - Statistiques globales avec filtres
// GET /api/stats/global - Statistiques globales avec filtres
router.get('/global', auth(), async (req, res) => {
    try {
        const { dateDebut, dateFin, projet, vehicule } = req.query;

        // Construire le filtre de base
        const matchFilter = {
            statut: 'terminé' // Seulement les mouvements terminés
        };

        // Filtre par période
        if (dateDebut && dateFin) {
            const startDate = new Date(dateDebut);
            const endDate = new Date(dateFin);
            endDate.setHours(23, 59, 59, 999);

            matchFilter.$or = [
                { realDepartureTime: { $gte: startDate, $lte: endDate } },
                { dateDepart: { $gte: startDate, $lte: endDate }, realDepartureTime: null }
            ];
        }

        // Filtre par véhicule
        if (vehicule) {
            matchFilter.vehicule = vehicule;
        }

        // Filtre MULTI-PAYS : Filtrer par pays sélectionné
        if (req.selectedCountry) {
            matchFilter.pays = req.selectedCountry;
        }

        // 1. Récupérer les paramètres CO2
        const Setting = require('../models/setting.model');
        const co2Setting = await Setting.findOne({ key: 'co2Factors' });
        const co2Factors = co2Setting ? co2Setting.value : { short: 230, medium: 178, long: 152 };

        // 2. Récupérer les mouvements (Find au lieu d'Aggregate pour gérer le JS complexe air/mer/projets)
        const mouvements = await Mouvement.find(matchFilter).populate('stops.lieu');

        let kmTotauxRoutier = 0;
        let co2TotalRoutier = 0;
        let consommationTotale = 0;

        let nbRoutier = 0;
        let nbAerien = 0;
        let nbMaritime = 0;

        let co2Aerien = 0;

        mouvements.forEach(m => {
            const mode = m.modeTransport || 'Routier';

            // Fitrage Projet (Manuel car complexe avec ventilation et stats globales)
            // Si projet est spécifié, on vérifie si le mouvement est ventilé sur ce projet.
            let partPonderation = 1; // 100% par défaut
            if (projet) {
                // Vérifier ventilation
                const ventil = m.projetsVentilation && m.projetsVentilation.length > 0
                    ? m.projetsVentilation
                    : [{ projet: m.projet, percentage: 100 }];

                const targetVentil = ventil.find(v => v.projet === projet);
                if (!targetVentil) return; // Skip ce mouvement
                partPonderation = targetVentil.percentage / 100;
            }

            if (mode === 'Routier') {
                nbRoutier++;
                // Calcul Km Routier
                let dist = 0;
                if (m.startMileage != null && m.endMileage != null) {
                    dist = m.endMileage - m.startMileage;
                }
                const distPonderee = dist * partPonderation;
                kmTotauxRoutier += distPonderee;

                // CO2/Conso Routier (Formules approximatives existantes)
                // Conso: ~8L/100km, CO2: ~2.3kg/L
                const conso = (distPonderee / 100) * 8;
                consommationTotale += conso;
                co2TotalRoutier += conso * 2.3;

            } else if (mode === 'Aérien') {
                nbAerien++;
                // Calcul CO2 Aérien (ADEME)
                // 1. Distance Vol d'oiseau Total
                let totalDistAir = 0;
                if (m.stops && m.stops.length >= 2) {
                    for (let i = 0; i < m.stops.length - 1; i++) {
                        const s1 = m.stops[i].lieu;
                        const s2 = m.stops[i + 1].lieu;
                        if (s1 && s2 && s1.coordonnees && s2.coordonnees) {
                            // Gestion coord string vs object
                            const getLatLon = (l) => {
                                if (typeof l.coordonnees === 'string') {
                                    const p = l.coordonnees.split(',').map(n => parseFloat(n.trim()));
                                    return { lat: p[0], lon: p[1] };
                                }
                                return { lat: parseFloat(l.coordonnees.latitude), lon: parseFloat(l.coordonnees.longitude) };
                            }
                            const p1 = getLatLon(s1);
                            const p2 = getLatLon(s2);
                            totalDistAir += calculateDistance(p1.lat, p1.lon, p2.lat, p2.lon);
                        }
                    }
                }

                // 2. Facteur Emission (selon distance totale du vol)
                let factor = co2Factors.short; // < 1000
                if (totalDistAir >= 1000 && totalDistAir <= 3500) factor = co2Factors.medium;
                else if (totalDistAir > 3500) factor = co2Factors.long;

                // 3. Nb Passagers (Impact)
                const nbPassagers = m.passagers ? m.passagers.length : 1;

                // 4. Calcul (g -> kg)
                // CO2 = Dist * Passagers * Factor / 1000
                const co2Vol = (totalDistAir * nbPassagers * factor) / 1000;

                co2Aerien += co2Vol * partPonderation;

            } else if (mode === 'Maritime') {
                nbMaritime++;
                // Pas de calcul CO2 pour l'instant
            }
        });

        res.json({
            kmTotaux: Math.round(kmTotauxRoutier),
            co2Total: Math.round(co2TotalRoutier), // Total CO2 (Flotte Routier UNIQUEMENT, demandé par user)
            // On ajoute les nouveaux champs explicites
            co2Flotte: Math.round(co2TotalRoutier),
            co2Aerien: Math.round(co2Aerien),
            consommationTotale: Math.round(consommationTotale),
            nombreMouvements: nbRoutier + nbAerien + nbMaritime,
            repartitionModes: {
                routier: nbRoutier,
                aerien: nbAerien,
                maritime: nbMaritime
            }
        });

    } catch (error) {
        console.error('Erreur stats globales:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// GET /api/stats/par-projet - Statistiques par projet avec filtres
router.get('/par-projet', auth(), async (req, res) => {
    try {
        const { dateDebut, dateFin, vehicule, projet } = req.query; // Ajout de projet ici

        // Construire le filtre de base
        const matchFilter = {
            statut: 'terminé'
        };

        // Filtre par période
        if (dateDebut && dateFin) {
            const startDate = new Date(dateDebut);
            const endDate = new Date(dateFin);
            endDate.setHours(23, 59, 59, 999);

            matchFilter.$or = [
                { realDepartureTime: { $gte: startDate, $lte: endDate } },
                { dateDepart: { $gte: startDate, $lte: endDate }, realDepartureTime: null }
            ];
        }

        // Filtre MULTI-PAYS : Filtrer par pays sélectionné (comme pour stats globales)
        if (req.selectedCountry) {
            matchFilter.pays = req.selectedCountry;
        }

        // Filtre par véhicule
        if (vehicule) {
            matchFilter.vehicule = vehicule;
        }

        // Pipeline d'agrégation par projet
        const pipeline = [
            { $match: matchFilter },
            // Lookup pour récupérer les infos du véhicule (capacité)
            {
                $lookup: {
                    from: 'vehicules',
                    localField: 'vehicule',
                    foreignField: '_id',
                    as: 'vehiculeInfo'
                }
            },
            { $unwind: { path: '$vehiculeInfo', preserveNullAndEmptyArrays: true } },
            // NOUVEAU: Normaliser la ventilation
            // Si le tableau projetsVentilation est vide ou inexistant, on crée une entrée par défaut avec le projet principal
            {
                $addFields: {
                    effectiveVentilation: {
                        $cond: {
                            if: { $and: [{ $isArray: "$projetsVentilation" }, { $gt: [{ $size: "$projetsVentilation" }, 0] }] },
                            then: "$projetsVentilation",
                            else: [{
                                projet: { $ifNull: ["$projet", "Non assigné"] },
                                percentage: 100
                            }]
                        }
                    },
                    // Calculer le kilométrage brut du mouvement une seule fois
                    rawKm: {
                        $cond: [
                            { $and: [{ $ne: ['$startMileage', null] }, { $ne: ['$endMileage', null] }] },
                            { $subtract: ['$endMileage', '$startMileage'] },
                            0
                        ]
                    }
                }
            },
            // Dérouler (Unwind) par projet de ventilation
            { $unwind: "$effectiveVentilation" },
            {
                $group: {
                    _id: "$effectiveVentilation.projet",
                    kmTotaux: {
                        $sum: {
                            $multiply: ["$rawKm", { $divide: ["$effectiveVentilation.percentage", 100] }]
                        }
                    },
                    // NOUVEAU : Km Impliqués (Distance totale des trajets où le projet apparaît)
                    kmInvolved: {
                        $sum: "$rawKm"
                    },
                    nombreMouvements: { $sum: 1 }, // Compte le nombre de fois que ce projet est impliqué
                    // Taux de remplissage : on considère le taux du trajet, pondéré par rien (c'est une moyenne)
                    // Ou alors on veut savoir si le projet optimise ses trajets.
                    tauxRemplissageTotal: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gt: ['$vehiculeInfo.capacitePassagers', 0] },
                                        { $isArray: '$passagers' }
                                    ]
                                },
                                {
                                    $multiply: [
                                        { $divide: [{ $size: '$passagers' }, '$vehiculeInfo.capacitePassagers'] },
                                        100
                                    ]
                                },
                                0
                            ]
                        }
                    },
                    mouvementsAvecVehicule: {
                        $sum: {
                            $cond: [
                                { $gt: ['$vehiculeInfo.capacitePassagers', 0] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            { $sort: { kmTotaux: -1 } }
        ];

        // Si un projet spécifique est demandé, on filtre les résultats agrégés
        if (projet) {
            pipeline.push({
                $match: { _id: projet }
            });
        }

        const resultats = await Mouvement.aggregate(pipeline);

        // Calculer le total pour les ratios (sur la base de TOUS les résultats ou seulement filtrés ?)
        // Si filtre actif, les ratios seront 100% ou presque.
        // Si on veut les ratios par rapport au GLOBAL, il faudrait le total global séparément.
        // Pour l'instant, faisons la somme de ce qui est retourné.
        const totalKm = resultats.reduce((sum, r) => sum + r.kmTotaux, 0);
        const totalConsommation = (totalKm / 100) * 8;
        const totalCO2 = totalConsommation * 2.3;

        // Formater les résultats avec ratios
        const statsParProjet = resultats.map(r => {
            const consommation = (r.kmTotaux / 100) * 8;
            const co2 = consommation * 2.3;

            // Calculer le taux de remplissage moyen
            const tauxRemplissageMoyen = r.mouvementsAvecVehicule > 0
                ? r.tauxRemplissageTotal / r.mouvementsAvecVehicule
                : 0;

            return {
                projet: r._id,
                kmTotaux: Math.round(r.kmTotaux),
                kmInvolved: Math.round(r.kmInvolved || 0), // Ajout
                co2Total: Math.round(co2),
                consommationTotale: Math.round(consommation),
                nombreMouvements: r.nombreMouvements,
                ratioKm: totalKm > 0 ? (r.kmTotaux / totalKm * 100) : 0,
                ratioCO2: totalCO2 > 0 ? (co2 / totalCO2 * 100) : 0,
                ratioConsommation: totalConsommation > 0 ? (consommation / totalConsommation * 100) : 0,
                tauxRemplissageMoyen: Math.round(tauxRemplissageMoyen * 10) / 10, // Arrondi à 1 décimale
                isMultiProjet: false, // Désormais géré par la ventilation, chaque ligne est un projet unique
                projetsInvolves: []
            };
        });

        res.json({
            global: {
                kmTotaux: Math.round(totalKm),
                co2Total: Math.round(totalCO2),
                consommationTotale: Math.round(totalConsommation)
            },
            parProjet: statsParProjet
        });

    } catch (error) {
        console.error('Erreur stats par projet:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// GET /api/stats/vehicules - Liste des véhicules pour le filtre
router.get('/vehicules', auth(), async (req, res) => {
    try {
        const vehicules = await Vehicule.find({}, 'immatriculation marque modele').sort('immatriculation');
        res.json(vehicules);
    } catch (error) {
        console.error('Erreur liste véhicules:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// GET /api/stats/projets - Liste des projets pour le filtre
router.get('/projets', auth(), async (req, res) => {
    try {
        const projets = await Utilisateur.distinct('projet');
        res.json(projets.filter(p => p)); // Filtrer les valeurs null/undefined
    } catch (error) {
        console.error('Erreur liste projets:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// Fonction utilitaire pour calculer la distance (Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la terre en km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance en km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

module.exports = router;
