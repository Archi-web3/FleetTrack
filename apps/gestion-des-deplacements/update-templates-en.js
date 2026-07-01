const fs = require('fs');

function updateJson(filePath, newKeys) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.MAINTENANCE) data.MAINTENANCE = {};
    if (!data.MAINTENANCE.TEMPLATES) data.MAINTENANCE.TEMPLATES = {};

    Object.assign(data.MAINTENANCE.TEMPLATES.FIELDS, newKeys.FIELDS);
    Object.assign(data.MAINTENANCE.TEMPLATES.TASKS, newKeys.TASKS);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

const frKeys = {
    "FIELDS": {
        "NAME_FR": "Nom du Modèle (Français)",
        "NAME_EN": "Nom du Modèle (Anglais)"
    },
    "TASKS": {
        "DESCRIPTION_FR": "Description (Français)",
        "DESCRIPTION_EN": "Description (Anglaise)"
    }
};

const enKeys = {
    "FIELDS": {
        "NAME_FR": "Template Name (French)",
        "NAME_EN": "Template Name (English)"
    },
    "TASKS": {
        "DESCRIPTION_FR": "Description (French)",
        "DESCRIPTION_EN": "Description (English)"
    }
};

updateJson('./src/assets/i18n/fr.json', frKeys);
updateJson('./src/assets/i18n/en.json', enKeys);
console.log("TEMPLATES i18n updated!");
