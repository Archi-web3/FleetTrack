const fs = require('fs');

function updateJson(filePath, newKeys) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.MAINTENANCE) data.MAINTENANCE = {};
    if (!data.MAINTENANCE.TEMPLATES) data.MAINTENANCE.TEMPLATES = {};

    Object.assign(data.MAINTENANCE.TEMPLATES, newKeys);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

const frKeys = {
    "TITLE": "Gestion des Modèles de Checklists",
    "NEW_BTN": "Nouveau Modèle",
    "LIST_TITLE": "Modèles Disponibles",
    "FIELDS": {
        "NAME": "Nom du Modèle",
        "TYPE": "Type",
        "ESTIMATED_COST": "Coût estimé",
        "TASKS": "Tâches",
        "ACTIVE": "Actif"
    },
    "EDIT_TITLE": "Modifier le Modèle",
    "NEW_TITLE": "Nouveau Modèle",
    "MODAL": {
        "GENERAL_INFO": "INFORMATIONS GÉNÉRALES"
    },
    "TASKS": {
        "TITLE": "TÂCHES",
        "ADD": "Ajouter une tâche",
        "CATEGORY": "Catégorie",
        "DESCRIPTION": "Description de la tâche",
        "REF_PAGE": "Page Réf.",
        "DELETE": "Supprimer cette tâche",
        "EMPTY": "Aucune tâche pour le moment."
    }
};

const enKeys = {
    "TITLE": "Checklist Template Management",
    "NEW_BTN": "New Template",
    "LIST_TITLE": "Available Templates",
    "FIELDS": {
        "NAME": "Template Name",
        "TYPE": "Type",
        "ESTIMATED_COST": "Estimated Cost",
        "TASKS": "Tasks",
        "ACTIVE": "Active"
    },
    "EDIT_TITLE": "Edit Template",
    "NEW_TITLE": "New Template",
    "MODAL": {
        "GENERAL_INFO": "GENERAL INFORMATION"
    },
    "TASKS": {
        "TITLE": "TASKS",
        "ADD": "Add a task",
        "CATEGORY": "Category",
        "DESCRIPTION": "Task description",
        "REF_PAGE": "Ref. Page",
        "DELETE": "Delete this task",
        "EMPTY": "No task for the moment."
    }
};

updateJson('./src/assets/i18n/fr.json', frKeys);
updateJson('./src/assets/i18n/en.json', enKeys);
console.log("TEMPLATES updated!");
