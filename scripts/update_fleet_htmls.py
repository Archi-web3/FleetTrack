import os

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src/app/features'

replacements = {
    'gestion-utilisateurs/gestion-utilisateurs.component.html': [
        ('Gestion des Utilisateurs', "{{ 'USERS.INFO.TITLE' | translate }}"),
        ('Cette page vous permet de gérer les accès au système. Vous pouvez créer de nouveaux utilisateurs, leur affecter un rôle défini dans la Matrice, et leur attribuer un niveau de validation sécurité. Note: la liste des rôles disponibles dépend de vos propres droits.', "{{ 'USERS.INFO.DESC' | translate }}"),
        ('Filter by Profile', "{{ 'USERS.FILTER.PROFILE_LABEL' | translate }}"),
        ('All Profiles', "{{ 'USERS.FILTER.ALL_PROFILES' | translate }}"),
        ('> Nouveau<', "> {{ 'USERS.NEW_BTN' | translate }}<"),
        ('NOM & PRÉNOM', "{{ 'USERS.TABLE.COL_NAME' | translate }}"),
        ('PROFIL', "{{ 'USERS.TABLE.COL_PROFILE' | translate }}"),
        ('PAYS & BASE', "{{ 'USERS.TABLE.COL_LOCATION' | translate }}"),
        ('SÉCURITÉ', "{{ 'USERS.TABLE.COL_SECURITY' | translate }}"),
        ('> ACTIONS <', "> {{ 'USERS.TABLE.COL_ACTIONS' | translate }} <"),
        ('Niveau {{ user.niveauValidationSecu', "{{ 'USERS.LEVEL' | translate }} {{ user.niveauValidationSecu"),
        ('>Login as User<', ">{{ 'USERS.ACTIONS.LOGIN_AS' | translate }}<"),
        ('>Log History<', ">{{ 'USERS.ACTIONS.LOG_HISTORY' | translate }}<"),
        ('>Reset Password<', ">{{ 'USERS.ACTIONS.RESET_PASSWORD' | translate }}<"),
        ('>Disable Login<', ">{{ 'USERS.ACTIONS.DISABLE_LOGIN' | translate }}<"),
        ('{{ user.profil }}', "{{ getProfileKey(user.profil) | translate }}"),
        ('>Modifier le pays<', ">{{ 'COUNTRIES.MODAL.EDIT_TITLE' | translate }}<"),
        ('>Ajouter un pays<', ">{{ 'COUNTRIES.MODAL.NEW_TITLE' | translate }}<"),
        ('>Nom du pays<', ">{{ 'COUNTRIES.MODAL.NAME' | translate }}<"),
        ('>Code (ex: RDC, RCA)<', ">{{ 'COUNTRIES.MODAL.CODE' | translate }}<"),
        ('>Devise principale<', ">{{ 'COUNTRIES.MODAL.CURRENCY' | translate }}<"),
        ('Mettre à jour', "{{ 'COUNTRIES.MODAL.BTN_UPDATE' | translate }}"),
        ('Ajouter un pays', "{{ 'COUNTRIES.MODAL.NEW_TITLE' | translate }}"),
        ("{{ selectedPays ? 'Modifier le pays' : 'Ajouter un pays' }}", "{{ selectedPays ? ('COUNTRIES.MODAL.EDIT_TITLE' | translate) : ('COUNTRIES.MODAL.NEW_TITLE' | translate) }}"),
        ("{{ selectedPays ? 'Mettre à jour' : 'Ajouter' }}", "{{ selectedPays ? ('COUNTRIES.MODAL.BTN_UPDATE' | translate) : ('COUNTRIES.MODAL.BTN_ADD' | translate) }}")
    ],
    'gestion-projets/gestion-projets.component.html': [
        ('Gestion des Projets', "{{ 'PROJECTS.INFO.TITLE' | translate }}"),
        ('Cette page vous permet de définir les différents projets en cours. Vous pourrez ensuite imputer les déplacements à ces projets pour un meilleur suivi analytique.', "{{ 'PROJECTS.INFO.DESC' | translate }}"),
        ('NOUVEAU PROJET', "{{ 'PROJECTS.NEW_BTN' | translate }}"),
        ('Colonnes affichées', "{{ 'PROJECTS.COLUMNS_LABEL' | translate }}"),
        ('Rechercher...', "{{ 'PROJECTS.SEARCH_PLACEHOLDER' | translate }}"),
        ('{{ col.label }}', "{{ 'PROJECTS.TABLE.COL_' + col.def.toUpperCase() | translate }}")
    ],
    'gestion-lieux/gestion-lieux.component.html': [
        ('Gestion des Lieux (Waypoints)', "{{ 'LOCATIONS.INFO.TITLE' | translate }}"),
        ("Créez et gérez ici la liste des lieux géographiques, villes ou points d'intérêts. Ces lieux serviront aux utilisateurs et aux chauffeurs pour définir le point de départ, de passage et d'arrivée de leurs mouvements.", "{{ 'LOCATIONS.INFO.DESC' | translate }}"),
        ("{{ showAllBasesInPays ? 'Ne voir que ma base' : 'Voir toutes les bases de mon pays' }}", "{{ showAllBasesInPays ? ('LOCATIONS.TOGGLE_MY_BASE' | translate) : ('LOCATIONS.TOGGLE_ALL_BASES' | translate) }}"),
        ('NOUVEAU LIEU', "{{ 'LOCATIONS.NEW_BTN' | translate }}"),
        ('Nom du Lieu', "{{ 'LOCATIONS.TABLE.COL_NOM' | translate }}"),
        ('Adresse', "{{ 'LOCATIONS.TABLE.COL_ADRESSE' | translate }}"),
        ('Coordonnées GPS', "{{ 'LOCATIONS.TABLE.COL_COORDONNEES' | translate }}"),
        ('Sécurité', "{{ 'LOCATIONS.TABLE.COL_SECURITE' | translate }}"),
        ('Sensible', "{{ 'LOCATIONS.TABLE.COL_SENSIBLE' | translate }}"),
        ('Pays', "{{ 'LOCATIONS.TABLE.COL_PAYS' | translate }}"),
        ('Base', "{{ 'LOCATIONS.TABLE.COL_BASE' | translate }}"),
        ('> Actions <', "> {{ 'LOCATIONS.TABLE.COL_ACTIONS' | translate }} <"),
        ("{{element.estSensible ? 'Oui' : 'Non'}}", "{{ element.estSensible ? ('LOCATIONS.SENSITIVE' | translate) : ('LOCATIONS.NOT_SENSITIVE' | translate) }}"),
        ('Lieu Sensible', "{{ 'LOCATIONS.SENSITIVE_TOOLTIP' | translate }}"),
        ("{{ selectedLieu ? 'Modifier le lieu' : 'Nouveau lieu' }}", "{{ selectedLieu ? ('LOCATIONS.MODAL.EDIT_TITLE' | translate) : ('LOCATIONS.MODAL.NEW_TITLE' | translate) }}"),
        ('Nom du lieu *', "{{ 'LOCATIONS.MODAL.NAME' | translate }}"),
        ('Adresse *', "{{ 'LOCATIONS.MODAL.ADDRESS' | translate }}"),
        ('Latitude *', "{{ 'LOCATIONS.MODAL.LATITUDE' | translate }}"),
        ('Longitude *', "{{ 'LOCATIONS.MODAL.LONGITUDE' | translate }}"),
        ('Niveau de sécurité *', "{{ 'LOCATIONS.MODAL.SECURITY' | translate }}"),
        ('Zone Sensible / Dangereuse', "{{ 'LOCATIONS.MODAL.IS_SENSITIVE' | translate }}"),
        ('-- Aucun --', "{{ 'LOCATIONS.MODAL.NONE' | translate }}"),
        ('-- Aucune --', "{{ 'LOCATIONS.MODAL.NONE_FEM' | translate }}"),
        ("{{ selectedLieu ? 'Mettre à jour' : 'Enregistrer' }}", "{{ selectedLieu ? ('COMMON.UPDATE' | translate) : ('COMMON.SAVE' | translate) }}")
    ],
    'gestion-pays/gestion-pays.component.html': [
        ('Gestion des Pays', "{{ 'COUNTRIES.TITLE' | translate }}"),
        ('NOUVEAU PAYS', "{{ 'COUNTRIES.NEW_BTN' | translate }}"),
        ('Rechercher...', "{{ 'COUNTRIES.SEARCH' | translate }}"),
        ('> Nom <', "> {{ 'COUNTRIES.TABLE.COL_NOM' | translate }} <"),
        ('> Code <', "> {{ 'COUNTRIES.TABLE.COL_CODE' | translate }} <"),
        ('> Devise <', "> {{ 'COUNTRIES.TABLE.COL_DEVISE' | translate }} <"),
        ('> Actions <', "> {{ 'COUNTRIES.TABLE.COL_ACTIONS' | translate }} <")
    ],
    'general-settings/general-settings.html': [
        ('Types de véhicules', "{{ 'SETTINGS.VEHICLE_TYPES_TAB' | translate }}"),
        ('Gérez les types de véhicules disponibles pour la flotte.', "{{ 'SETTINGS.VEHICLE_TYPES_DESC' | translate }}"),
        ('Types de Véhicules', "{{ 'SETTINGS.VEHICLE_TYPES_TAB' | translate }}"),
        ('Nouveau type...', "{{ 'SETTINGS.NEW_TYPE' | translate }}"),
        ('Facteurs CO2', "{{ 'SETTINGS.CO2_TAB' | translate }}"),
        ("Gérez les paramètres d'émission CO2 pour les différents types de trajets.", "{{ 'SETTINGS.CO2_DESC' | translate }}"),
        ('Facteurs CO2 (g/km)', "{{ 'SETTINGS.CO2_FACTORS_LABEL' | translate }}"),
        ('Trajet court', "{{ 'SETTINGS.SHORT_TRIP' | translate }}"),
        ('Trajet moyen', "{{ 'SETTINGS.MEDIUM_TRIP' | translate }}"),
        ('Trajet long', "{{ 'SETTINGS.LONG_TRIP' | translate }}"),
        ('Source', "{{ 'SETTINGS.SOURCE' | translate }}"),
        ('Save CO2', "{{ 'SETTINGS.SAVE_CO2' | translate }}")
    ],
    'gestion-maintenance/service-config/service-config.html': [
        ('Intervalles (km)', "{{ 'MAINTENANCE.CONFIG.INTERVALS' | translate }}"),
        ('Séquence des services', "{{ 'MAINTENANCE.CONFIG.SEQUENCE_LABEL' | translate }}"),
        ('Mode Prédéfini (A-B-A-C)', "{{ 'MAINTENANCE.CONFIG.SEQ_PREDEFINED' | translate }}"),
        ('Mode Personnalisé', "{{ 'MAINTENANCE.CONFIG.SEQ_CUSTOM' | translate }}"),
        ('Séquence Personnalisée', "{{ 'MAINTENANCE.CONFIG.CUSTOM_SEQ_TITLE' | translate }}"),
        ('Ajouter un service (ex: A, B, C...)', "{{ 'MAINTENANCE.CONFIG.ADD_SERVICE' | translate }}"),
        ('Ordre de répétition:', "{{ 'MAINTENANCE.CONFIG.REPEAT_ORDER' | translate }}"),
        ('➔ (Répéter)', "{{ 'MAINTENANCE.CONFIG.REPEAT_END' | translate }}"),
        ('Route mixte/urbaine', "{{ 'MAINTENANCE.CONFIG.ROAD_MIXTE_URBAINE' | translate }}"),
        ('Route goudronnée', "{{ 'MAINTENANCE.CONFIG.ROAD_GOUDRONNEE' | translate }}"),
        ('Mixte route + piste', "{{ 'MAINTENANCE.CONFIG.ROAD_MIXTE_PISTE' | translate }}"),
        ('100% piste difficile', "{{ 'MAINTENANCE.CONFIG.ROAD_PISTE_DIFFICILE' | translate }}"),
        ('>Bonne<', ">{{ 'MAINTENANCE.CONFIG.FUEL_GOOD' | translate }}<"),
        ('>Mauvaise<', ">{{ 'MAINTENANCE.CONFIG.FUEL_BAD' | translate }}<"),
        ('>Inconnue<', ">{{ 'MAINTENANCE.CONFIG.FUEL_UNKNOWN' | translate }}<")
    ]
}

for filepath, pairs in replacements.items():
    full_path = os.path.join(base_dir, filepath)
    if not os.path.exists(full_path):
        print(f"File not found: {full_path}")
        continue
        
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    for old, new in pairs:
        content = content.replace(old, new)
        
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("HTML files updated.")
