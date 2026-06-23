const fs = require('fs');

function updateJson(filePath, newKeys) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.MAINTENANCE) data.MAINTENANCE = {};
    if (!data.MAINTENANCE.CONFIG) data.MAINTENANCE.CONFIG = {};

    Object.assign(data.MAINTENANCE.CONFIG, newKeys);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

const frKeys = {
    "TITLE": "Types de Service de Maintenance",
    "EDIT_TITLE": "Modifier la Configuration",
    "NEW_TITLE": "Nouvelle Configuration",
    "FIELDS": {
        "VEHICLE_TYPE": "Type de Véhicule",
        "ROAD_CONDITIONS": "Conditions Routières",
        "SERVICE_INTERVAL": "Intervalle de Service Initial (Km)",
        "FUEL_QUALITY": "Qualité du Carburant"
    },
    "INTERVALS": "Définition des Intervalles & Séquence",
    "SEQUENCE_LABEL": "Type de Séquence",
    "SEQ_PREDEFINED": "Séquence Standard (A ➔ B ➔ A ➔ C)",
    "SEQ_CUSTOM": "Séquence Personnalisée",
    "CUSTOM_SEQ_TITLE": "Séquence de Services",
    "ADD_SERVICE": "Ajouter un service (ex: A, B, C)",
    "REPEAT_ORDER": "Ordre de répétition :",
    "REPEAT_END": "(Répétition)",
    "ROAD_MIXTE_URBAINE": "Route mixte/urbaine",
    "ROAD_GOUDRONNEE": "Route goudronnée",
    "ROAD_MIXTE_PISTE": "Mixte route + piste",
    "ROAD_PISTE_DIFFICILE": "100% piste difficile",
    "FUEL_GOOD": "Bonne",
    "FUEL_BAD": "Mauvaise",
    "FUEL_UNKNOWN": "Inconnue"
};

const enKeys = {
    "TITLE": "Maintenance Service Types",
    "EDIT_TITLE": "Edit Configuration",
    "NEW_TITLE": "New Configuration",
    "FIELDS": {
        "VEHICLE_TYPE": "Vehicle Type",
        "ROAD_CONDITIONS": "Road Conditions",
        "SERVICE_INTERVAL": "Initial Service Interval (Km)",
        "FUEL_QUALITY": "Fuel Quality"
    },
    "INTERVALS": "Interval Definition & Sequence",
    "SEQUENCE_LABEL": "Sequence Type",
    "SEQ_PREDEFINED": "Standard Sequence (A ➔ B ➔ A ➔ C)",
    "SEQ_CUSTOM": "Custom Sequence",
    "CUSTOM_SEQ_TITLE": "Service Sequence",
    "ADD_SERVICE": "Add service (e.g. A, B, C)",
    "REPEAT_ORDER": "Repetition order:",
    "REPEAT_END": "(Repeat)",
    "ROAD_MIXTE_URBAINE": "Mixed/Urban Road",
    "ROAD_GOUDRONNEE": "Paved Road",
    "ROAD_MIXTE_PISTE": "Mixed Paved + Dirt",
    "ROAD_PISTE_DIFFICILE": "100% Difficult Dirt",
    "FUEL_GOOD": "Good",
    "FUEL_BAD": "Bad",
    "FUEL_UNKNOWN": "Unknown"
};

updateJson('./src/assets/i18n/fr.json', frKeys);
updateJson('./src/assets/i18n/en.json', enKeys);
console.log("CONFIG updated!");
