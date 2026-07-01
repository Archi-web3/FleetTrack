import json
import os
import re

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements'

# 1. Update JSON files
fr_file = os.path.join(base_dir, 'src/assets/i18n/fr.json')
en_file = os.path.join(base_dir, 'src/assets/i18n/en.json')

with open(fr_file, 'r', encoding='utf-8') as f:
    fr_data = json.load(f)
with open(en_file, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Add USERS
fr_data['USERS'] = {
    "INFO": {
        "TITLE": "Gestion des Utilisateurs",
        "DESC": "Cette page vous permet de gérer les accès au système. Vous pouvez créer de nouveaux utilisateurs, leur affecter un rôle défini dans la Matrice, et leur attribuer un niveau de validation sécurité. Note: la liste des rôles disponibles dépend de vos propres droits."
    },
    "FILTER": {
        "PROFILE_LABEL": "Filtrer par profil",
        "ALL_PROFILES": "Tous les profils"
    },
    "NEW_BTN": "Nouveau",
    "TABLE": {
        "COL_NAME": "NOM & PRÉNOM",
        "COL_PROFILE": "PROFIL",
        "COL_LOCATION": "PAYS & BASE",
        "COL_SECURITY": "SÉCURITÉ",
        "COL_ACTIONS": "ACTIONS"
    },
    "LEVEL": "Niveau",
    "ACTIONS": {
        "UPDATE": "Modifier",
        "DELETE": "Supprimer",
        "LOGIN_AS": "Se connecter en tant que",
        "LOG_HISTORY": "Historique",
        "RESET_PASSWORD": "Réinitialiser mot de passe",
        "DISABLE_LOGIN": "Désactiver l'accès"
    },
    "LIST": {
        "TITLE": "Utilisateurs existants",
        "NO_DATA": "Aucun utilisateur trouvé"
    },
    "MODAL": {
        "EDIT_TITLE": "Modifier l'utilisateur",
        "NEW_TITLE": "Ajouter un utilisateur",
        "NAME": "Nom",
        "SURNAME": "Prénom",
        "EMAIL": "Email",
        "PASSWORD": "Mot de passe",
        "PASSWORD_HINT": "Laissez vide pour conserver l'actuel",
        "PROFILE": "Profil",
        "SECURITY_LEVEL": "Niveau de Sécurité",
        "COUNTRY": "Pays",
        "BASE": "Base",
        "GLOBAL_ACCESS": "Accès global (tous les pays)"
    },
    "PROFILES": {
        "SUPERADMIN": "Super Admin",
        "ADMIN": "Admin",
        "SUPERVISEUR SÉCURITÉ": "Superviseur Sécurité",
        "SUPERVISEUR": "Superviseur",
        "CHAUFFEUR": "Chauffeur",
        "TECHNICIEN": "Technicien",
        "UTILISATEUR": "Utilisateur"
    }
}

en_data['USERS'] = {
    "INFO": {
        "TITLE": "User Management",
        "DESC": "This page allows you to manage system access. You can create new users, assign them a role defined in the Matrix, and assign them a security validation level. Note: the list of available roles depends on your own permissions."
    },
    "FILTER": {
        "PROFILE_LABEL": "Filter by Profile",
        "ALL_PROFILES": "All Profiles"
    },
    "NEW_BTN": "New",
    "TABLE": {
        "COL_NAME": "NAME & SURNAME",
        "COL_PROFILE": "PROFILE",
        "COL_LOCATION": "COUNTRY & BASE",
        "COL_SECURITY": "SECURITY",
        "COL_ACTIONS": "ACTIONS"
    },
    "LEVEL": "Level",
    "ACTIONS": {
        "UPDATE": "Update",
        "DELETE": "Delete",
        "LOGIN_AS": "Login as User",
        "LOG_HISTORY": "Log History",
        "RESET_PASSWORD": "Reset Password",
        "DISABLE_LOGIN": "Disable Login"
    },
    "LIST": {
        "TITLE": "Existing Users",
        "NO_DATA": "No users found"
    },
    "MODAL": {
        "EDIT_TITLE": "Edit User",
        "NEW_TITLE": "Add a User",
        "NAME": "Name",
        "SURNAME": "Surname",
        "EMAIL": "Email",
        "PASSWORD": "Password",
        "PASSWORD_HINT": "Leave blank to keep current",
        "PROFILE": "Profile",
        "SECURITY_LEVEL": "Security Level",
        "COUNTRY": "Country",
        "BASE": "Base",
        "GLOBAL_ACCESS": "Global Access (all countries)"
    },
    "PROFILES": {
        "SUPERADMIN": "Super Admin",
        "ADMIN": "Admin",
        "SUPERVISEUR SÉCURITÉ": "Security Supervisor",
        "SUPERVISEUR": "Supervisor",
        "CHAUFFEUR": "Driver",
        "TECHNICIEN": "Technician",
        "UTILISATEUR": "User"
    }
}

# Add PROJECTS
fr_data['PROJECTS'] = {
    "INFO": {
        "TITLE": "Gestion des Projets",
        "DESC": "Cette page vous permet de définir les différents projets en cours. Vous pourrez ensuite imputer les déplacements à ces projets pour un meilleur suivi analytique."
    },
    "NEW_BTN": "NOUVEAU PROJET",
    "COLUMNS_LABEL": "Colonnes affichées",
    "SEARCH_PLACEHOLDER": "Rechercher...",
    "TABLE": {
        "COL_NOM": "NOM",
        "COL_CODE": "CODE",
        "COL_DESCRIPTION": "DESCRIPTION",
        "COL_ACTIF": "STATUT",
        "COL_ACTIONS": "ACTIONS"
    },
    "MODAL": {
        "EDIT_TITLE": "Modifier le projet",
        "NEW_TITLE": "Nouveau projet",
        "NAME": "Nom du projet",
        "CODE": "Code analytique",
        "DESC": "Description",
        "STATUS": "Actif"
    }
}

en_data['PROJECTS'] = {
    "INFO": {
        "TITLE": "Project Management",
        "DESC": "This page allows you to define the various ongoing projects. You can then allocate movements to these projects for better analytical tracking."
    },
    "NEW_BTN": "NEW PROJECT",
    "COLUMNS_LABEL": "Displayed Columns",
    "SEARCH_PLACEHOLDER": "Search...",
    "TABLE": {
        "COL_NOM": "NAME",
        "COL_CODE": "CODE",
        "COL_DESCRIPTION": "DESCRIPTION",
        "COL_ACTIF": "STATUS",
        "COL_ACTIONS": "ACTIONS"
    },
    "MODAL": {
        "EDIT_TITLE": "Edit Project",
        "NEW_TITLE": "New Project",
        "NAME": "Project Name",
        "CODE": "Analytical Code",
        "DESC": "Description",
        "STATUS": "Active"
    }
}

# Add LOCATIONS
fr_data['LOCATIONS'] = {
    "INFO": {
        "TITLE": "Gestion des Lieux (Waypoints)",
        "DESC": "Créez et gérez ici la liste des lieux géographiques, villes ou points d'intérêts. Ces lieux serviront aux utilisateurs et aux chauffeurs pour définir le point de départ, de passage et d'arrivée de leurs mouvements."
    },
    "TOGGLE_MY_BASE": "Ne voir que ma base",
    "TOGGLE_ALL_BASES": "Voir toutes les bases de mon pays",
    "NEW_BTN": "NOUVEAU LIEU",
    "TABLE": {
        "COL_NOM": "Nom du Lieu",
        "COL_ADRESSE": "Adresse",
        "COL_COORDONNEES": "Coordonnées GPS",
        "COL_SECURITE": "Sécurité",
        "COL_SENSIBLE": "Sensible",
        "COL_PAYS": "Pays",
        "COL_BASE": "Base",
        "COL_ACTIONS": "Actions"
    },
    "SENSITIVE": "Oui",
    "NOT_SENSITIVE": "Non",
    "SENSITIVE_TOOLTIP": "Lieu Sensible",
    "MODAL": {
        "EDIT_TITLE": "Modifier le lieu",
        "NEW_TITLE": "Nouveau lieu",
        "NAME": "Nom du lieu *",
        "ADDRESS": "Adresse *",
        "LATITUDE": "Latitude *",
        "LONGITUDE": "Longitude *",
        "SECURITY": "Niveau de sécurité *",
        "IS_SENSITIVE": "Zone Sensible / Dangereuse",
        "COUNTRY": "Pays",
        "BASE": "Base",
        "NONE": "-- Aucun --",
        "NONE_FEM": "-- Aucune --"
    }
}

en_data['LOCATIONS'] = {
    "INFO": {
        "TITLE": "Location Management (Waypoints)",
        "DESC": "Create and manage the list of geographical locations, cities, or points of interest here. These locations will be used by users and drivers to set the departure, waypoint, and arrival for their movements."
    },
    "TOGGLE_MY_BASE": "View only my base",
    "TOGGLE_ALL_BASES": "View all bases in my country",
    "NEW_BTN": "NEW LOCATION",
    "TABLE": {
        "COL_NOM": "Location Name",
        "COL_ADRESSE": "Address",
        "COL_COORDONNEES": "GPS Coordinates",
        "COL_SECURITE": "Security",
        "COL_SENSIBLE": "Sensitive",
        "COL_PAYS": "Country",
        "COL_BASE": "Base",
        "COL_ACTIONS": "Actions"
    },
    "SENSITIVE": "Yes",
    "NOT_SENSITIVE": "No",
    "SENSITIVE_TOOLTIP": "Sensitive Location",
    "MODAL": {
        "EDIT_TITLE": "Edit Location",
        "NEW_TITLE": "New Location",
        "NAME": "Location Name *",
        "ADDRESS": "Address *",
        "LATITUDE": "Latitude *",
        "LONGITUDE": "Longitude *",
        "SECURITY": "Security Level *",
        "IS_SENSITIVE": "Sensitive / Dangerous Area",
        "COUNTRY": "Country",
        "BASE": "Base",
        "NONE": "-- None --",
        "NONE_FEM": "-- None --"
    }
}

# Add COUNTRIES
if 'COUNTRIES' not in fr_data:
    fr_data['COUNTRIES'] = {}
if 'COUNTRIES' not in en_data:
    en_data['COUNTRIES'] = {}

fr_data['COUNTRIES'].update({
    "TITLE": "Gestion des Pays",
    "NEW_BTN": "NOUVEAU PAYS",
    "COLUMNS": "Colonnes affichées",
    "SEARCH": "Rechercher...",
    "TABLE": {
        "COL_NOM": "Nom",
        "COL_CODE": "Code",
        "COL_DEVISE": "Devise",
        "COL_ACTIONS": "Actions"
    },
    "MODAL": {
        "EDIT_TITLE": "Modifier le pays",
        "NEW_TITLE": "Ajouter un pays",
        "NAME": "Nom du pays",
        "CODE": "Code (ex: RDC, RCA)",
        "CURRENCY": "Devise principale",
        "BTN_UPDATE": "Mettre à jour",
        "BTN_ADD": "Ajouter"
    }
})

en_data['COUNTRIES'].update({
    "TITLE": "Country Management",
    "NEW_BTN": "NEW COUNTRY",
    "COLUMNS": "Displayed columns",
    "SEARCH": "Search...",
    "TABLE": {
        "COL_NOM": "Name",
        "COL_CODE": "Code",
        "COL_DEVISE": "Currency",
        "COL_ACTIONS": "Actions"
    },
    "MODAL": {
        "EDIT_TITLE": "Edit Country",
        "NEW_TITLE": "Add a Country",
        "NAME": "Country Name",
        "CODE": "Code (e.g. USA, UK)",
        "CURRENCY": "Main Currency",
        "BTN_UPDATE": "Update",
        "BTN_ADD": "Add"
    }
})

# Add SETTINGS (General settings)
fr_data['SETTINGS'].update({
    "VEHICLE_TYPES_TAB": "Types de véhicules",
    "VEHICLE_TYPES_DESC": "Gérez les types de véhicules disponibles pour la flotte.",
    "NEW_TYPE": "Nouveau type...",
    "CO2_TAB": "Facteurs CO2",
    "CO2_DESC": "Gérez les paramètres d'émission CO2 pour les différents types de trajets.",
    "CO2_FACTORS_LABEL": "Facteurs CO2 (g/km)",
    "SHORT_TRIP": "Trajet court",
    "MEDIUM_TRIP": "Trajet moyen",
    "LONG_TRIP": "Trajet long",
    "SOURCE": "Source",
    "SAVE_CO2": "Sauvegarder CO2"
})

en_data['SETTINGS'].update({
    "VEHICLE_TYPES_TAB": "Vehicle Types",
    "VEHICLE_TYPES_DESC": "Manage the available vehicle types for the fleet.",
    "NEW_TYPE": "New type...",
    "CO2_TAB": "CO2 Factors",
    "CO2_DESC": "Manage the CO2 emission parameters for different trip types.",
    "CO2_FACTORS_LABEL": "CO2 Factors (g/km)",
    "SHORT_TRIP": "Short trip",
    "MEDIUM_TRIP": "Medium trip",
    "LONG_TRIP": "Long trip",
    "SOURCE": "Source",
    "SAVE_CO2": "Save CO2"
})

if 'MAINTENANCE' not in fr_data:
    fr_data['MAINTENANCE'] = {}
if 'CONFIG' not in fr_data['MAINTENANCE']:
    fr_data['MAINTENANCE']['CONFIG'] = {}

fr_data['MAINTENANCE']['CONFIG'].update({
    "INTERVALS": "Intervalles (km)",
    "SEQUENCE_LABEL": "Séquence des services",
    "SEQ_PREDEFINED": "Mode Prédéfini (A-B-A-C)",
    "SEQ_CUSTOM": "Mode Personnalisé",
    "CUSTOM_SEQ_TITLE": "Séquence Personnalisée",
    "ADD_SERVICE": "Ajouter un service (ex: A, B, C...)",
    "REPEAT_ORDER": "Ordre de répétition:",
    "REPEAT_END": "➔ (Répéter)",
    "FUEL_QUALITY": "Qualité du carburant",
    "ROAD_MIXTE_URBAINE": "Route mixte/urbaine",
    "ROAD_GOUDRONNEE": "Route goudronnée",
    "ROAD_MIXTE_PISTE": "Mixte route + piste",
    "ROAD_PISTE_DIFFICILE": "100% piste difficile",
    "FUEL_GOOD": "Bonne",
    "FUEL_BAD": "Mauvaise",
    "FUEL_UNKNOWN": "Inconnue"
})

if 'MAINTENANCE' not in en_data:
    en_data['MAINTENANCE'] = {}
if 'CONFIG' not in en_data['MAINTENANCE']:
    en_data['MAINTENANCE']['CONFIG'] = {}

en_data['MAINTENANCE']['CONFIG'].update({
    "INTERVALS": "Intervals (km)",
    "SEQUENCE_LABEL": "Service Sequence",
    "SEQ_PREDEFINED": "Predefined Mode (A-B-A-C)",
    "SEQ_CUSTOM": "Custom Mode",
    "CUSTOM_SEQ_TITLE": "Custom Sequence",
    "ADD_SERVICE": "Add a service (e.g., A, B, C...)",
    "REPEAT_ORDER": "Repeat order:",
    "REPEAT_END": "➔ (Repeat)",
    "FUEL_QUALITY": "Fuel Quality",
    "ROAD_MIXTE_URBAINE": "Mixed/Urban road",
    "ROAD_GOUDRONNEE": "Paved road",
    "ROAD_MIXTE_PISTE": "Mixed road + dirt",
    "ROAD_PISTE_DIFFICILE": "100% difficult dirt road",
    "FUEL_GOOD": "Good",
    "FUEL_BAD": "Bad",
    "FUEL_UNKNOWN": "Unknown"
})

with open(fr_file, 'w', encoding='utf-8') as f:
    json.dump(fr_data, f, indent=4, ensure_ascii=False)
with open(en_file, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=4, ensure_ascii=False)

print("JSON dictionaries updated.")
