// Script pour initialiser le template de checklist hebdomadaire
const ChecklistTemplate = require('./models/checklist-template.model');

const weeklyChecklistTemplate = {
    nom: "Checklist Hebdomadaire Standard",
    type: "Hebdomadaire",
    typeVehicule: "Tous",
    taches: [
        // Détection
        { numero: "1", categorie: "Détection", description: "Écouter bruits anormaux du moteur (grincements, vibrations)", numeroTacheManuel: "1", obligatoire: true },
        { numero: "2", categorie: "Détection", description: "Fuites sous le véhicule", numeroTacheManuel: "2", obligatoire: true },

        // Moteur
        { numero: "3", categorie: "Moteur", description: "Vérifier le niveau d'huile moteur", numeroTacheManuel: "3", obligatoire: true },
        { numero: "4", categorie: "Moteur", description: "Vérifier le niveau liquide de refroidissement", numeroTacheManuel: "4", obligatoire: true },
        { numero: "8", categorie: "Moteur", description: "Vérifier les durites, la propreté et supports du radiateur", numeroTacheManuel: "8", obligatoire: true },
        { numero: "8b", categorie: "Moteur", description: "Vérifier la tension et l'état de la courroie du ventilateur", numeroTacheManuel: "8", obligatoire: true },
        { numero: "5", categorie: "Moteur", description: "Vérifier niveau liquide de frein et d'embrayage", numeroTacheManuel: "5", obligatoire: true },
        { numero: "15", categorie: "Moteur", description: "Nettoyer et souffler le filtre à air", numeroTacheManuel: "15", obligatoire: true },
        { numero: "6", categorie: "Moteur", description: "Vérifier niveau du lave-glace et fonctionnement des gicleurs/essuie-glaces", numeroTacheManuel: "6", obligatoire: true },
        { numero: "16", categorie: "Moteur", description: "Contrôler la suspension selon le type de véhicule : ressorts (état, alignements des lames de ressorts) silentbloc (ressorts arrière, barre stabilisatrice, levier triangulaire), amortisseurs (fuites, fixation des tiges)", numeroTacheManuel: "16", obligatoire: true },

        // Pneus
        { numero: "2b", categorie: "Pneus", description: "État des pneus : contrôle visuel (craquelures/fissures, dégâts, usure normale, roues et écrous)", numeroTacheManuel: "2", obligatoire: true },
        { numero: "17", categorie: "Pneus", description: "Contrôler la pression (cf. page 1 logbook) et vérifier bouchons de valves", numeroTacheManuel: "17", obligatoire: true },

        // Électricité
        { numero: "17b", categorie: "Électricité", description: "Vérifier le niveau et eau de la batterie, casse et fixation", numeroTacheManuel: "17", obligatoire: true },
        { numero: "18", categorie: "Électricité", description: "Voyants lumineux du tableau de bord, éclairages intérieurs et extérieurs", numeroTacheManuel: "18", obligatoire: true },

        // Sécurité
        { numero: "10", categorie: "Sécurité", description: "Vérifier fonctionnement des portes, serrures, vitres et ceintures", numeroTacheManuel: "10", obligatoire: true },
        { numero: "9", categorie: "Sécurité", description: "Vérifier présence et inventaire des équipements de bord", numeroTacheManuel: "9", obligatoire: true },

        // Communication
        { numero: "12-13", categorie: "Communication", description: "Contrôle fonctionnel radio HF/VHF/Traceur avec la base", numeroTacheManuel: "12", obligatoire: true },

        // Nettoyage
        { numero: "14", categorie: "Nettoyage", description: "Nettoyer l'intérieur, l'extérieur et sous le véhicule", numeroTacheManuel: "14", obligatoire: true },

        // Finalisation
        { numero: "Final", categorie: "Finalisation", description: "Remplir le Logbook (enregistrer en propre un prochain service)", numeroTacheManuel: "", obligatoire: true }
    ],
    actif: true
};

async function initializeTemplate() {
    try {
        const existing = await ChecklistTemplate.findOne({ nom: "Checklist Hebdomadaire Standard" });
        if (!existing) {
            await ChecklistTemplate.create(weeklyChecklistTemplate);
            console.log('✅ Template checklist hebdomadaire créé avec succès');
        } else {
            console.log('ℹ️ Template déjà existant');
        }
    } catch (error) {
        console.error('❌ Erreur création template:', error);
    }
}

module.exports = { initializeTemplate, weeklyChecklistTemplate };
