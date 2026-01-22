const express = require('express');
const router = express.Router();
const Mouvement = require('../models/mouvement.model');
const Utilisateur = require('../models/utilisateur.model');
const Vehicule = require('../models/vehicule.model');
const auth = require('../middleware/authMiddleware');

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
            const endDate = new Date(dateFin);
            endDate.setHours(23, 59, 59, 999); // Include entire end date
            matchFilter.dateDepart = {
                $gte: new Date(dateDebut),
                $lte: endDate
            };
        }

        // Filtre par véhicule
        if (vehicule) {
            matchFilter.vehicule = vehicule;
        }

        // Filtre MULTI-PAYS : Filtrer par pays sélectionné
        if (req.selectedCountry) {
            matchFilter.pays = req.selectedCountry;
        }

        // Pipeline d'agrégation
        const pipeline = [
            { $match: matchFilter },
            {
                $lookup: {
                    from: 'utilisateurs',
                    localField: 'chauffeur',
                    foreignField: '_id',
                    as: 'chauffeurInfo'
                }
            },
            { $unwind: { path: '$chauffeurInfo', preserveNullAndEmptyArrays: true } }
        ];

        // Filtre par projet (après lookup)
        if (projet) {
            pipeline.push({
                $match: { 'chauffeurInfo.projet': projet }
            });
        }

        // Agrégation des statistiques
        pipeline.push({
            $group: {
                _id: null,
                kmTotaux: {
                    $sum: {
                        $cond: [
                            { $and: [{ $ne: ['$startMileage', null] }, { $ne: ['$endMileage', null] }] },
                            { $subtract: ['$endMileage', '$startMileage'] },
                            0
                        ]
                    }
                },
                nombreMouvements: { $sum: 1 }
            }
        });

        const result = await Mouvement.aggregate(pipeline);

        // DEBUG: Compter tous les mouvements terminés
        const allTerminated = await Mouvement.countDocuments({ statut: 'terminé' });
        const terminatedWithMileage = await Mouvement.countDocuments({
            statut: 'terminé',
            startMileage: { $ne: null },
            endMileage: { $ne: null }
        });

        console.log('=== DEBUG STATS GLOBALES ===');
        console.log('Filtre appliqué:', JSON.stringify(matchFilter));
        console.log('Total mouvements terminés (tous):', allTerminated);
        console.log('Mouvements terminés avec kilométrage:', terminatedWithMileage);
        console.log('Nombre de mouvements trouvés (après filtre):', result.length);
        console.log('Résultat agrégation:', result);

        if (result.length === 0) {
            return res.json({
                kmTotaux: 0,
                co2Total: 0,
                consommationTotale: 0,
                nombreMouvements: 0
            });
        }

        const stats = result[0];

        // Calcul CO2 et consommation (formules approximatives)
        // CO2: environ 2.3 kg par litre de diesel
        // Consommation: environ 8L/100km en moyenne
        const consommationTotale = (stats.kmTotaux / 100) * 8;
        const co2Total = consommationTotale * 2.3;

        console.log('Stats calculées - Km:', stats.kmTotaux, 'CO2:', co2Total, 'Conso:', consommationTotale);

        res.json({
            kmTotaux: Math.round(stats.kmTotaux),
            co2Total: Math.round(co2Total),
            consommationTotale: Math.round(consommationTotale),
            nombreMouvements: stats.nombreMouvements
        });

    } catch (error) {
        console.error('Erreur stats globales:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});

// GET /api/stats/par-projet - Statistiques par projet avec filtres
router.get('/par-projet', auth(), async (req, res) => {
    try {
        const { dateDebut, dateFin, vehicule } = req.query;

        // Construire le filtre de base
        const matchFilter = {
            statut: 'terminé'
        };

        // Filtre par période
        if (dateDebut && dateFin) {
            const endDate = new Date(dateFin);
            endDate.setHours(23, 59, 59, 999); // Include entire end date
            matchFilter.dateDepart = {
                $gte: new Date(dateDebut),
                $lte: endDate
            };
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

        const resultats = await Mouvement.aggregate(pipeline);

        // Calculer le total pour les ratios
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

module.exports = router;
