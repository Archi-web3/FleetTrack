const fs = require('fs');

function updateJson(filePath, newKeys) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.USERS.DRIVER_INFO) {
        data.USERS.DRIVER_INFO = newKeys;
    } else {
        Object.assign(data.USERS.DRIVER_INFO, newKeys);
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

const frKeys = {
    "TITLE": "Informations Chauffeur",
    "LICENSE": "Numéro de Permis",
    "ECO_DRIVING": "Formation Eco-Conduite",
    "DATE": "Date de formation",
    "ASSIGNED_VEHICLE": "Véhicule Attitré",
    "AVAILABLE": "Disponible"
};

const enKeys = {
    "TITLE": "Driver Information",
    "LICENSE": "License Number",
    "ECO_DRIVING": "Eco-Driving Training",
    "DATE": "Training Date",
    "ASSIGNED_VEHICLE": "Assigned Vehicle",
    "AVAILABLE": "Available"
};

updateJson('./src/assets/i18n/fr.json', frKeys);
updateJson('./src/assets/i18n/en.json', enKeys);
console.log("USERS.DRIVER_INFO updated!");
