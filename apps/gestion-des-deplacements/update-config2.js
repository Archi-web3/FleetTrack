const fs = require('fs');

function updateJson(filePath, newKeys) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.MAINTENANCE) data.MAINTENANCE = {};
    if (!data.MAINTENANCE.CONFIG) data.MAINTENANCE.CONFIG = {};

    Object.assign(data.MAINTENANCE.CONFIG, {
        ...data.MAINTENANCE.CONFIG,
        ...newKeys
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

const frKeys = {
    "LIST_TITLE": "Configurations Actuelles",
    "TABLE": {
        "TYPE": "Type Véhicule",
        "CONDITIONS": "Conditions",
        "INTERVAL": "Intervalle Init.",
        "ACTIONS": "Actions"
    }
};

const enKeys = {
    "LIST_TITLE": "Current Configurations",
    "TABLE": {
        "TYPE": "Vehicle Type",
        "CONDITIONS": "Conditions",
        "INTERVAL": "Init. Interval",
        "ACTIONS": "Actions"
    }
};

updateJson('./src/assets/i18n/fr.json', frKeys);
updateJson('./src/assets/i18n/en.json', enKeys);
console.log("CONFIG updated again!");
