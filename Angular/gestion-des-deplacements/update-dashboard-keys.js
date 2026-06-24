const fs = require('fs');

function updateJson(filePath, newKeys) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.DASHBOARD) data.DASHBOARD = {};

    Object.assign(data.DASHBOARD, newKeys);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

const frKeys = {
    "WELCOME": "Bienvenue {{userName}}",
    "TYPE_LOGISTICS": "Logistique",
    "TYPE_SECURITY": "Sécurité",
    "LIST_MODE": "Vue Liste",
    "CARD_MODE": "Vue Cartes",
    "SECURITY_LEVEL": "Niveau de sécurité",
    "EXPECTED_VALIDATOR": "Attendu",
    "BACKUP_VALIDATORS": "Backups autorisés"
};

const enKeys = {
    "WELCOME": "Welcome {{userName}}",
    "TYPE_LOGISTICS": "Logistics",
    "TYPE_SECURITY": "Security",
    "LIST_MODE": "List View",
    "CARD_MODE": "Card View",
    "SECURITY_LEVEL": "Security Level",
    "EXPECTED_VALIDATOR": "Expected",
    "BACKUP_VALIDATORS": "Authorized Backups"
};

updateJson('./src/assets/i18n/fr.json', frKeys);
updateJson('./src/assets/i18n/en.json', enKeys);
console.log("DASHBOARD keys updated!");
