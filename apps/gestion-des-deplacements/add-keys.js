const fs = require('fs');

function updateJson(filePath, newKeys) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Add COUNTRIES keys if not exists
    if (!data.COUNTRIES) {
        data.COUNTRIES = newKeys.COUNTRIES;
    } else {
        Object.assign(data.COUNTRIES, newKeys.COUNTRIES);
    }

    if (!data.ADMIN_PAYS_BASES) {
        data.ADMIN_PAYS_BASES = newKeys.ADMIN_PAYS_BASES;
    } else {
        Object.assign(data.ADMIN_PAYS_BASES, newKeys.ADMIN_PAYS_BASES);
    }
    
    // Add common search if missing
    if (!data.COMMON) data.COMMON = {};
    if (!data.COMMON.SEARCH) data.COMMON.SEARCH = newKeys.COMMON.SEARCH;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

const frKeys = {
    COUNTRIES: {
        TITLE: "Gestion des Pays",
        NEW_BTN: "NOUVEAU PAYS",
        SEARCH: "Rechercher...",
        TABLE: {
            COL_NOM: "Nom",
            COL_CODE: "Code",
            COL_DEVISE: "Devise",
            COL_ACTIONS: "Actions"
        },
        MODAL: {
            EDIT_TITLE: "Modifier le pays",
            NEW_TITLE: "Ajouter un pays",
            NAME: "Nom du pays",
            CODE: "Code (ex: RDC, RCA)",
            CURRENCY: "Devise principale",
            BTN_UPDATE: "Mettre à jour",
            BTN_ADD: "Ajouter"
        }
    },
    ADMIN_PAYS_BASES: {
        TITLE: "Gestion des Pays & Bases",
        DESC: "Gérez ici l'arborescence géographique de la plateforme. Vous pouvez ajouter de nouveaux pays et définir les bases opérationnelles qui y sont rattachées.",
        PAYS_TITLE: "Pays (Missions)",
        BTN_PAYS: "PAYS",
        SEARCH_PAYS: "Rechercher un pays...",
        TABLE_PAYS: {
            NOM: "Nom",
            CODE: "Code",
            DEVISE: "Devise",
            ACTIONS: "Actions"
        },
        BASES_TITLE: "Bases pour",
        BTN_BASE: "BASE",
        SEARCH_BASE: "Rechercher une base...",
        TABLE_BASES: {
            NOM: "Nom de la Base",
            CODE: "Code Interne",
            ACTIONS: "Actions"
        },
        NO_PAYS_TITLE: "Aucun Pays Sélectionné",
        NO_PAYS_DESC: "Sélectionnez un pays dans le tableau de gauche pour voir et gérer ses bases.",
        MODAL_PAYS: {
            EDIT: "Modifier le pays",
            NEW: "Nouveau pays",
            NAME: "Nom du pays",
            CODE: "Code (ex: RDC)",
            CURRENCY: "Devise"
        },
        MODAL_BASE: {
            EDIT: "Modifier la base",
            NEW: "Nouvelle base",
            NAME: "Nom de la base",
            CODE: "Code Interne (Optionnel)"
        }
    },
    COMMON: {
        SEARCH: "Rechercher"
    }
};

const enKeys = {
    COUNTRIES: {
        TITLE: "Countries Management",
        NEW_BTN: "NEW COUNTRY",
        SEARCH: "Search...",
        TABLE: {
            COL_NOM: "Name",
            COL_CODE: "Code",
            COL_DEVISE: "Currency",
            COL_ACTIONS: "Actions"
        },
        MODAL: {
            EDIT_TITLE: "Edit country",
            NEW_TITLE: "Add country",
            NAME: "Country Name",
            CODE: "Code (ex: RDC, RCA)",
            CURRENCY: "Main Currency",
            BTN_UPDATE: "Update",
            BTN_ADD: "Add"
        }
    },
    ADMIN_PAYS_BASES: {
        TITLE: "Countries & Bases Management",
        DESC: "Manage the platform's geographical structure here. You can add new countries and define the operational bases attached to them.",
        PAYS_TITLE: "Countries (Missions)",
        BTN_PAYS: "COUNTRY",
        SEARCH_PAYS: "Search a country...",
        TABLE_PAYS: {
            NOM: "Name",
            CODE: "Code",
            DEVISE: "Currency",
            ACTIONS: "Actions"
        },
        BASES_TITLE: "Bases for",
        BTN_BASE: "BASE",
        SEARCH_BASE: "Search a base...",
        TABLE_BASES: {
            NOM: "Base Name",
            CODE: "Internal Code",
            ACTIONS: "Actions"
        },
        NO_PAYS_TITLE: "No Country Selected",
        NO_PAYS_DESC: "Select a country from the table on the left to view and manage its bases.",
        MODAL_PAYS: {
            EDIT: "Edit Country",
            NEW: "New Country",
            NAME: "Country Name",
            CODE: "Code (ex: RDC)",
            CURRENCY: "Currency"
        },
        MODAL_BASE: {
            EDIT: "Edit Base",
            NEW: "New Base",
            NAME: "Base Name",
            CODE: "Internal Code (Optional)"
        }
    },
    COMMON: {
        SEARCH: "Search"
    }
};

updateJson('./src/assets/i18n/fr.json', frKeys);
updateJson('./src/assets/i18n/en.json', enKeys);
console.log("JSON files updated!");
