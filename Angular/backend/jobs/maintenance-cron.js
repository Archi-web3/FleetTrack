const cron = require('node-cron');
const WeeklyChecklist = require('../models/weekly-checklist.model');
const ServiceSchedule = require('../models/service-schedule.model');
const ChecklistTemplate = require('../models/checklist-template.model');
const Vehicule = require('../models/vehicule.model');

// Fonction pour calculer la semaine de l'année
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Tâche CRON : Créer checklists hebdomadaires chaque lundi à 6h00
const createWeeklyChecklists = cron.schedule('0 6 * * 1', async () => {
    console.log('🔄 Création des checklists hebdomadaires...');

    try {
        const now = new Date();
        const semaine = getWeekNumber(now);
        const annee = now.getFullYear();

        // Récupérer tous les véhicules actifs
        const vehicules = await Vehicule.find({ enService: true });
        const template = await ChecklistTemplate.findOne({ type: 'Hebdomadaire', actif: true });

        if (!template) {
            console.error('❌ Template checklist hebdomadaire non trouvé');
            return;
        }

        let created = 0;
        for (const vehicule of vehicules) {
            // Vérifier si checklist existe déjà
            const existing = await WeeklyChecklist.findOne({
                vehicule: vehicule._id,
                semaine: semaine,
                annee: annee
            });

            if (!existing) {
                // Trouver le chauffeur principal du véhicule (dernier utilisateur)
                // Pour l'instant, on laisse null, sera assigné au premier login
                await WeeklyChecklist.create({
                    vehicule: vehicule._id,
                    semaine: semaine,
                    annee: annee,
                    chauffeur: null, // Sera assigné au premier accès
                    taches: template.taches.map(t => ({
                        numero: t.numero,
                        categorie: t.categorie,
                        description: t.description,
                        numeroTacheManuel: t.numeroTacheManuel,
                        validee: false
                    })),
                    completee: false,
                    tauxCompletion: 0
                });
                created++;
            }
        }

        console.log(`✅ ${created} checklists hebdomadaires créées`);
    } catch (error) {
        console.error('❌ Erreur création checklists:', error);
    }
}, {
    scheduled: false // Ne démarre pas automatiquement
});

// Tâche CRON : Vérifier services dus chaque jour à 7h00
const checkServicesDus = cron.schedule('0 7 * * *', async () => {
    console.log('🔄 Vérification des services dus...');

    try {
        const vehicules = await Vehicule.find({ enService: true });
        let alertes = 0;

        for (const vehicule of vehicules) {
            const service = await ServiceSchedule.findOne({
                vehicule: vehicule._id,
                statut: { $ne: 'Complété' }
            }).sort({ kilometragePrevu: 1 });

            if (service) {
                const kmActuel = vehicule.kilometrage || 0;
                service.kilometrageActuel = kmActuel;

                const oldStatut = service.statut;

                if (kmActuel >= service.kilometragePrevu + 200) {
                    service.statut = 'En retard';
                } else if (kmActuel >= service.kilometragePrevu) {
                    service.statut = 'Dû';
                } else if (kmActuel >= service.kilometragePrevu - 500) {
                    service.statut = 'À venir';
                    if (!service.dateAlerte) {
                        service.dateAlerte = new Date();
                    }
                }

                if (oldStatut !== service.statut) {
                    await service.save();
                    alertes++;
                    console.log(`⚠️ Service ${service.typeService} pour véhicule ${vehicule.immatriculation}: ${service.statut}`);
                }
            }
        }

        console.log(`✅ ${alertes} alertes de service mises à jour`);
    } catch (error) {
        console.error('❌ Erreur vérification services:', error);
    }
}, {
    scheduled: false
});

// Tâche CRON : Notifications checklists mercredi et vendredi à 16h00
const notifyIncompleteChecklists = cron.schedule('0 16 * * 3,5', async () => {
    console.log('🔄 Vérification checklists incomplètes...');

    try {
        const now = new Date();
        const semaine = getWeekNumber(now);
        const annee = now.getFullYear();

        const checklists = await WeeklyChecklist.find({
            semaine: semaine,
            annee: annee,
            completee: false
        }).populate('vehicule').populate('chauffeur');

        console.log(`⚠️ ${checklists.length} checklists incomplètes trouvées`);

        // TODO: Envoyer notifications aux chauffeurs
        // Pour l'instant, juste logger
        for (const checklist of checklists) {
            console.log(`  - Véhicule ${checklist.vehicule?.immatriculation}: ${checklist.tauxCompletion}% complété`);
        }
    } catch (error) {
        console.error('❌ Erreur notifications checklists:', error);
    }
}, {
    scheduled: false
});

// Fonction pour démarrer toutes les tâches CRON
function startCronJobs() {
    console.log('🚀 Démarrage des tâches CRON de maintenance...');
    createWeeklyChecklists.start();
    checkServicesDus.start();
    notifyIncompleteChecklists.start();
    console.log('✅ Tâches CRON démarrées');
}

// Fonction pour arrêter toutes les tâches CRON
function stopCronJobs() {
    createWeeklyChecklists.stop();
    checkServicesDus.stop();
    notifyIncompleteChecklists.stop();
    console.log('⏹️ Tâches CRON arrêtées');
}

module.exports = {
    startCronJobs,
    stopCronJobs,
    createWeeklyChecklists,
    checkServicesDus,
    notifyIncompleteChecklists
};
