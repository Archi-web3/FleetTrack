const fs = require('fs');

function updateJson(filePath, newKeys) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.USERS.FORM) {
        data.USERS.FORM = newKeys;
    } else {
        Object.assign(data.USERS.FORM, newKeys);
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

const frKeys = {
    "NAME": "Nom",
    "FIRSTNAME": "Prénom",
    "EMPLOYEE_ID": "ID Employé",
    "PHONE": "Téléphone",
    "EMAIL": "Email",
    "PASSWORD": "Mot de passe",
    "NEW_PASSWORD": "Nouveau mot de passe",
    "PROFILE": "Profil",
    "AUTO_MANAGE_SECURITY": "Gérer automatiquement le niveau de sécurité",
    "SECURITY_LEVEL": "Niveau de sécurité",
    "SECURITY_HINT": "Niveau requis pour valider les déplacements",
    "COUNTRY": "Pays",
    "BASE": "Base",
    "PROJECT": "Projet",
    "PROJECT_HINT": "Optionnel: Assigner l'utilisateur à un projet spécifique"
};

const enKeys = {
    "NAME": "Last Name",
    "FIRSTNAME": "First Name",
    "EMPLOYEE_ID": "Employee ID",
    "PHONE": "Phone",
    "EMAIL": "Email",
    "PASSWORD": "Password",
    "NEW_PASSWORD": "New Password",
    "PROFILE": "Profile",
    "AUTO_MANAGE_SECURITY": "Auto-manage security level",
    "SECURITY_LEVEL": "Security Level",
    "SECURITY_HINT": "Required level to validate movements",
    "COUNTRY": "Country",
    "BASE": "Base",
    "PROJECT": "Project",
    "PROJECT_HINT": "Optional: Assign user to a specific project"
};

updateJson('./src/assets/i18n/fr.json', frKeys);
updateJson('./src/assets/i18n/en.json', enKeys);
console.log("USERS.FORM updated!");
