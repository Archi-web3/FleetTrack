const fs = require('fs');

function updateJson(filePath, lang) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.SETTINGS) data.SETTINGS = {};

    if (lang === 'fr') {
        data.SETTINGS.BRAND_THEME = "Design & Thèmes";
        data.SETTINGS.SYSTEM_PREF = "Modules optionnels";
        data.SETTINGS.CURRENCIES = "Devises";
        data.SETTINGS.EMAILS = "Paramètres Emails";
    } else {
        data.SETTINGS.BRAND_THEME = "Brand & Themes";
        data.SETTINGS.SYSTEM_PREF = "Optional Modules";
        data.SETTINGS.CURRENCIES = "Currencies";
        data.SETTINGS.EMAILS = "Email Settings";
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

updateJson('./src/assets/i18n/fr.json', 'fr');
updateJson('./src/assets/i18n/en.json', 'en');
console.log("SETTINGS menus updated!");
