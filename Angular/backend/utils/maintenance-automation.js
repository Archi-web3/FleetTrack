const ServiceSchedule = require('../models/service-schedule.model');
const MaintenanceConfig = require('../models/maintenance-config.model');
const Vehicule = require('../models/vehicule.model');

/**
 * Génère automatiquement les services planifiés pour un véhicule
 * basés sur le kilométrage actuel et la configuration de maintenance
 * 
 * @param {String} vehiculeId - ID du véhicule
 * @param {Number} currentKm - Kilométrage actuel du véhicule
 * @returns {Promise<Array>} - Services créés
 */
async function generateServiceSchedules(vehiculeId, currentKm) {
    try {
        // 1. Récupérer le véhicule avec ses infos
        const vehicule = await Vehicule.findById(vehiculeId);
        if (!vehicule) {
            throw new Error('Véhicule non trouvé');
        }

        // 2. Récupérer la configuration de maintenance pour ce véhicule
        const config = await MaintenanceConfig.findOne({
            typeVehicule: vehicule.type,
            conditionsRoute: vehicule.conditionsRoute || 'Route mixte/urbaine',
            actif: true
        });

        // Fallback : 5000 km si aucune config trouvée
        const serviceInterval = config ? config.intervalleService : 5000;
        const initialKm = vehicule.kilometrageInitial || 0;

        console.log(`📊 [MAINTENANCE-AUTO] Génération services pour ${vehicule.immatriculation}`);
        console.log(`   - Km initial: ${initialKm}, Km actuel: ${currentKm}`);
        console.log(`   - Intervalle: ${serviceInterval} km (${config ? 'Configuré' : 'Fallback'})`);

        // 3. Récupérer les services déjà existants
        // 3. Récupérer les services déjà existants
        // NOUVEAU: Nettoyage des services obsolètes (inférieurs au km initial)
        // ex: Si on change le km initial de 0 à 150000, on supprime les services prévus à 5000, 10000...
        if (initialKm > 0) {
            const deleted = await ServiceSchedule.deleteMany({
                vehicule: vehiculeId,
                kilometragePrevu: { $lt: initialKm }, // Strictement inférieur, car celui à "initialKm" pourrait être dû
                statut: { $ne: 'Complété' }
            });
            if (deleted.deletedCount > 0) {
                console.log(`   🧹 Nettoyage: ${deleted.deletedCount} service(s) obsolètes supprimés (< ${initialKm} km)`);
            }
        }

        const existingServices = await ServiceSchedule.find({
            vehicule: vehiculeId
        }).sort({ kilometragePrevu: 1 });

        // 4. Calculer quels services devraient exister
        const requiredServices = calculateServiceIntervals(initialKm, currentKm, serviceInterval);

        // 5. Créer les services manquants
        const createdServices = [];
        for (const requiredService of requiredServices) {
            // Vérifier si ce service existe déjà
            const exists = existingServices.find(s =>
                s.kilometragePrevu === requiredService.km &&
                s.typeService === requiredService.type
            );

            if (!exists) {
                console.log(`   ✅ Création: Service ${requiredService.type} à ${requiredService.km} km`);

                const newService = await ServiceSchedule.create({
                    vehicule: vehiculeId,
                    typeService: requiredService.type,
                    kilometragePrevu: requiredService.km,
                    kilometrageActuel: currentKm,
                    statut: determineStatut(currentKm, requiredService.km),
                    taches: [] // Les tâches seront ajoutées manuellement ou depuis un template
                });
                createdServices.push(newService);
            }
        }

        console.log(`   📋 Résultat: ${createdServices.length} service(s) créé(s)`);
        return createdServices;

    } catch (error) {
        console.error('❌ [MAINTENANCE-AUTO] Erreur génération services:', error);
        throw error;
    }
}

/**
 * Calcule les services qui devraient être planifiés
 * entre le km initial et le km actuel
 * 
 * @param {Number} initialKm - Kilométrage initial
 * @param {Number} currentKm - Kilométrage actuel
 * @param {Number} interval - Intervalle entre services (en km)
 * @returns {Array} - Liste des services requis [{type, km}]
 */
function calculateServiceIntervals(initialKm, currentKm, interval) {
    const services = [];
    const milestones = [50000, 100000]; // Services spéciaux

    // Générer les services réguliers (A/B/C) basés sur l'intervalle
    let nextServiceKm = Math.ceil(initialKm / interval) * interval;
    if (nextServiceKm <= initialKm) nextServiceKm += interval;

    let serviceCounter = 0;
    while (nextServiceKm <= currentKm + interval) { // Inclure le prochain service à venir
        // Vérifier si c'est un milestone (50K ou 100K)
        const isMilestone = milestones.includes(nextServiceKm);

        if (isMilestone) {
            // Service milestone
            const milestoneType = nextServiceKm === 50000 ? '50K' : '100K';
            services.push({ type: milestoneType, km: nextServiceKm });
        } else {
            // Service régulier (cycle A/B/C)
            const serviceType = getNextServiceType(serviceCounter, interval);
            services.push({ type: serviceType, km: nextServiceKm });
        }

        serviceCounter++;
        nextServiceKm += interval;
    }

    return services;
}

/**
 * Détermine le type de service (A, B ou C) basé sur le compteur
 * Pattern: A, A, B, A, A, C, A, A, B, A, A, C...
 * 
 * @param {Number} counter - Compteur de services
 * @param {Number} interval - Intervalle entre services
 * @returns {String} - Type de service (A, B ou C)
 */
function getNextServiceType(counter, interval) {
    // Pattern basé sur l'intervalle configuré
    // Si intervalle = 5000 km :
    //   - Service A : 5K, 10K, 20K, 25K, 35K, 40K... (tous sauf divisibles par 20K et 40K)
    //   - Service B : 15K, 30K, 45K... (divisibles par 20K mais pas 40K)
    //   - Service C : 40K, 80K, 120K... (divisibles par 40K, mais pas 50K/100K milestones)

    const kmValue = (counter + 1) * interval;

    // Si c'est un milestone, on ne génère pas ici (géré ailleurs)
    if (kmValue % 50000 === 0 || kmValue % 100000 === 0) {
        return 'A'; // Fallback (ne devrait pas arriver)
    }

    // Service C : Tous les 8 services (40K pour intervalle de 5K)
    if ((counter + 1) % 8 === 0) return 'C';

    // Service B : Tous les 4 services (20K pour intervalle de 5K), mais pas Service C
    if ((counter + 1) % 4 === 0) return 'B';

    // Service A : Par défaut
    return 'A';
}

/**
 * Détermine le statut d'un service en fonction du kilométrage
 * 
 * @param {Number} currentKm - Kilométrage actuel
 * @param {Number} serviceKm - Kilométrage prévu du service
 * @returns {String} - Statut (À venir, Dû, En retard)
 */
function determineStatut(currentKm, serviceKm) {
    const diff = serviceKm - currentKm;

    if (diff > 500) return 'À venir';
    if (diff >= -200) return 'Dû'; // Tolérance de 200 km
    return 'En retard';
}

/**
 * Met à jour les statuts de tous les services d'un véhicule
 * en fonction du kilométrage actuel
 * 
 * @param {String} vehiculeId - ID du véhicule
 * @param {Number} currentKm - Kilométrage actuel
 * @returns {Promise<Number>} - Nombre de services mis à jour
 */
async function updateServiceStatuses(vehiculeId, currentKm) {
    try {
        const services = await ServiceSchedule.find({
            vehicule: vehiculeId,
            statut: { $ne: 'Complété' } // Ne pas toucher aux services complétés
        });

        let updated = 0;
        for (const service of services) {
            const newStatut = determineStatut(currentKm, service.kilometragePrevu);
            if (service.statut !== newStatut) {
                service.statut = newStatut;
                service.kilometrageActuel = currentKm;
                await service.save();
                updated++;
            }
        }

        console.log(`   🔄 Statuts mis à jour: ${updated} service(s)`);
        return updated;

    } catch (error) {
        console.error('❌ [MAINTENANCE-AUTO] Erreur MAJ statuts:', error);
        throw error;
    }
}

module.exports = {
    generateServiceSchedules,
    calculateServiceIntervals,
    getNextServiceType,
    determineStatut,
    updateServiceStatuses
};
