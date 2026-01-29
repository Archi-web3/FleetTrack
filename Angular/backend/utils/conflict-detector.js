const Mouvement = require('../models/mouvement.model');

/**
 * Vérifie si un créneau horaire chevauche un autre.
 * @param {Date} start1 
 * @param {Date} end1 
 * @param {Date} start2 
 * @param {Date} end2 
 * @returns {boolean}
 */
const isOverlapping = (start1, end1, start2, end2) => {
    return start1 < end2 && end1 > start2;
};

/**
 * Vérifie les conflits pour un chauffeur.
 * @param {string} chauffeurId 
 * @param {Date} dateDepart 
 * @param {Date} dateArrivee 
 * @param {string} excludeMouvementId (Optionnel) ID du mouvement à exclure (update)
 * @returns {Promise<Object|null>} Le mouvement en conflit ou null
 */
const checkDriverConflict = async (chauffeurId, dateDepart, dateArrivee, excludeMouvementId = null) => {
    if (!chauffeurId || !dateDepart || !dateArrivee) return null;

    const query = {
        chauffeur: chauffeurId,
        statut: { $in: ['validé', 'pris en charge', 'en cours', 'terminé'] }, // On exclut "en attente" ? -> User veut Warning, donc incluons "en attente" aussi pour prévenir
        // UPDATE: Inclure 'en attente' pour éviter double booking dès la demande
        // MAIS 'terminé' ne devrait pas bloquer si c'est dans le passé ?
        // L'algo se base sur les dates. Si "Terminé" chevauche (dates réelles ou prévues), c'est un conflit historique ou actuel.
        // Si c'est pour le futur, 'terminé' n'existe pas encore.
        // Donc status actif ou finalisé.
        // ATTENTION: Si un vieux mouvement est "en attente" et non traité, il bloque ? Oui, c'est le but.
        dateDepart: { $lt: dateArrivee },
        dateArrivee: { $gt: dateDepart }
    };

    // Ajustement statuts : 'terminé' est-il un conflit ? Si je veux planifier un truc alors que le chauffeur était censé avoir fini ?
    // Si dates chevauchent, c'est physique.
    // On va garder : 'en attente', 'validé', 'pris en charge', 'en cours', 'terminé'
    query.statut = { $in: ['en attente', 'validé', 'pris en charge', 'en cours'] }; // On retire terminé pour l'instant pour être souple sur l'historique

    if (excludeMouvementId) {
        query._id = { $ne: excludeMouvementId };
    }

    const conflict = await Mouvement.findOne(query)
        .populate('stops.lieu')
        .populate('demandeur', 'nom prenom');

    return conflict;
};

/**
 * Vérifie les conflits pour un véhicule.
 * @param {string} vehiculeId 
 * @param {Date} dateDepart 
 * @param {Date} dateArrivee 
 * @param {string} excludeMouvementId 
 * @returns {Promise<Object|null>}
 */
const checkVehicleConflict = async (vehiculeId, dateDepart, dateArrivee, excludeMouvementId = null) => {
    if (!vehiculeId || !dateDepart || !dateArrivee) return null;

    const query = {
        vehicule: vehiculeId,
        statut: { $in: ['en attente', 'validé', 'pris en charge', 'en cours'] },
        dateDepart: { $lt: dateArrivee },
        dateArrivee: { $gt: dateDepart }
    };

    if (excludeMouvementId) {
        query._id = { $ne: excludeMouvementId };
    }

    const conflict = await Mouvement.findOne(query)
        .populate('stops.lieu')
        .populate('demandeur', 'nom prenom');

    return conflict;
};

module.exports = {
    checkDriverConflict,
    checkVehicleConflict
};
