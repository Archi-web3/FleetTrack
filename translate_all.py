import os
import json
import re

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src'

translations = {
    'fr': {},
    'en': {}
}

def set_nested(d, key_path, value):
    keys = key_path.split('.')
    current = d
    for i, k in enumerate(keys[:-1]):
        if k not in current:
            current[k] = {}
        current = current[k]
    current[keys[-1]] = value

def add_translation(key, fr_val, en_val):
    set_nested(translations['fr'], key, fr_val)
    set_nested(translations['en'], key, en_val)

# Dashboard
add_translation('DASHBOARD.WELCOME', 'Bienvenue sur', 'Welcome to')
add_translation('DASHBOARD.WELCOME_DESC', 'Ceci est votre <strong>tableau de bord</strong> personnel. Vous y trouverez toutes les données importantes en un clin d\'œil.', 'This is your personal <strong>dashboard</strong>. Here you will find all important data at a glance.')
add_translation('DASHBOARD.QUICK_ACTIONS', 'Actions Rapides', 'Quick Actions')
add_translation('DASHBOARD.NEW_MOVEMENT', 'Nouveau Mouvement', 'New Movement')
add_translation('DASHBOARD.MY_PLANNING', 'Mon Planning', 'My Planning')
add_translation('DASHBOARD.INTERACTIVE_MAP', 'Carte Interactive', 'Interactive Map')
add_translation('DASHBOARD.PENDING_VALIDATIONS', 'Demandes en attente de validation', 'Pending Validation Requests')
add_translation('DASHBOARD.NO_PENDING_VALIDATIONS', 'Aucune demande en attente de votre validation.', 'No requests pending your validation.')
add_translation('DASHBOARD.NO_OBJECTIVE', 'Mouvement sans objectif', 'Movement without objective')
add_translation('DASHBOARD.REQUESTER', 'Demandeur', 'Requester')
add_translation('DASHBOARD.VALIDATION_TYPE', 'Type de validation', 'Validation Type')

# Demande Mouvement
add_translation('MOVEMENT.SELECT_DEPARTURE', 'Sélectionnez un lieu de départ...', 'Select a departure location...')
add_translation('MOVEMENT.SELECT_ARRIVAL', 'Sélectionnez un lieu d\'arrivée...', 'Select an arrival location...')
add_translation('MOVEMENT.RECURRENCE', 'Récurrence (Jusqu\'à 3 mois)', 'Recurrence (Up to 3 months)')
add_translation('COMMON.DELETE', 'Supprimer', 'Delete')

# Planning & Map
add_translation('STATUS.PENDING_SECURITY', 'En Attente Sécurité', 'Pending Security')
add_translation('STATUS.ALL_STATUSES', 'Tous les statuts', 'All Statuses')
add_translation('STATUS.IN_PROGRESS', 'En cours', 'In Progress')
add_translation('STATUS.VALIDATED_PENDING', 'Validé (En attente)', 'Validated (Pending)')
add_translation('STATUS.COMPLETED', 'Terminé', 'Completed')
add_translation('MAP.FILTERED_TRIPS', 'voyages filtrés', 'filtered trips')
add_translation('MAP.UNKNOWN_VEHICLE', 'Véhicule Inconnu', 'Unknown Vehicle')
add_translation('PLANNING.SHOW_PENDING', 'Afficher En Attente', 'Show Pending')

# Filters
add_translation('FILTERS.TYPE_TO_FILTER', 'Tapez pour filtrer...', 'Type to filter...')
add_translation('FILTERS.ALL_VEHICLES', 'Tous les véhicules', 'All Vehicles')
add_translation('FILTERS.SEARCH_HINT', 'Rechercher objectif, chauffeur, lieu...', 'Search objective, driver, location...')

# Maintenance
add_translation('MAINTENANCE.TRACKING_INFO', 'Cet onglet vous permet de visualiser l\'état de santé de chaque véhicule de votre flotte par rapport à ses obligations de maintenance. Il compare le kilométrage actuel avec les services configurés (A, B, C...) pour déterminer l\'écart exact. Les véhicules nécessitant une attention immédiate apparaissent avec un statut Critique ou En retard.', 'This tab allows you to visualize the health status of each vehicle in your fleet relative to its maintenance obligations. It compares current mileage with configured services (A, B, C...) to determine the exact gap. Vehicles requiring immediate attention appear with a Critical or Overdue status.')
add_translation('MAINTENANCE.HOW_IT_WORKS_KM', 'Fonctionnement du Suivi Kilométrique', 'How Mileage Tracking Works')
add_translation('MAINTENANCE.STATUS.UP_TO_DATE', 'À jour', 'Up to date')
add_translation('MAINTENANCE.STATUS.CLOSE', 'Proche', 'Close')
add_translation('MAINTENANCE.STATUS.OVERDUE', 'En retard', 'Overdue')
add_translation('MAINTENANCE.STATUS.CRITICAL', 'Critique', 'Critical')
add_translation('MAINTENANCE.HOW_IT_WORKS_PLANNED', 'Fonctionnement des Maintenances Planifiées', 'How Planned Maintenance Works')
add_translation('MAINTENANCE.HOW_IT_WORKS_SMART', 'Fonctionnement du Smart Cost & Analytics', 'How Smart Cost & Analytics Works')
add_translation('MAINTENANCE.HOW_IT_WORKS_PREDICTIVE', 'Fonctionnement des Prédictions', 'How Predictions Work')
add_translation('MAINTENANCE.GLOBAL_TRACKING', 'Suivi Global', 'Global Tracking')
add_translation('MAINTENANCE.WEEKLY_TRACKING', 'Suivi Hebdo', 'Weekly Tracking')

# Smart Cost
add_translation('SMART_COST.TITLE', 'Smart Cost & Analytics', 'Smart Cost & Analytics')
add_translation('SMART_COST.TOTAL_COST', 'Coût Total', 'Total Cost')
add_translation('SMART_COST.FORECAST_AI', 'Prévision (IA)', 'Forecast (AI)')
add_translation('SMART_COST.RELIABILITY', 'Fiabilité par Modèle', 'Reliability by Model')

# Gestion Chauffeurs
add_translation('DRIVERS.DISPLAYED_COLUMNS', 'Colonnes affichées', 'Displayed Columns')
add_translation('DRIVERS.COLUMNS_HINT', 'Nom, Email, Pays, Base, Véhic...', 'Name, Email, Country, Base, Vehic...')
add_translation('DRIVERS.COL_NAME', 'NOM', 'NAME')
add_translation('DRIVERS.COL_EMAIL', 'EMAIL / TÉL', 'EMAIL / TEL')
add_translation('DRIVERS.COL_COUNTRY', 'PAYS', 'COUNTRY')
add_translation('DRIVERS.COL_BASE', 'BASE', 'BASE')
add_translation('DRIVERS.COL_VEHICLE', 'VÉHICULE ATTITRÉ', 'ASSIGNED VEHICLE')
add_translation('DRIVERS.COL_ACTIONS', 'ACTIONS', 'ACTIONS')
add_translation('DRIVERS.SEARCH', 'Rechercher...', 'Search...')


replacements = [
    {
        'file': 'app/features/demande-mouvement/demande-mouvement.component.html',
        'replaces': [
            ('>Sélectionnez un lieu de départ...<', '>{{ \'MOVEMENT.SELECT_DEPARTURE\' | translate }}<'),
            ('>Sélectionnez un lieu d\'arrivée...<', '>{{ \'MOVEMENT.SELECT_ARRIVAL\' | translate }}<'),
            ('>Récurrence (Jusqu\'à 3 mois)<', '>{{ \'MOVEMENT.RECURRENCE\' | translate }}<'),
            ('>Supprimer<', '>{{ \'COMMON.DELETE\' | translate }}<'),
        ]
    },
    {
        'file': 'app/features/planning-mouvements/planning-mouvements.component.html',
        'replaces': [
            ('>En Attente Sécurité<', '>{{ \'STATUS.PENDING_SECURITY\' | translate }}<'),
            ('>Afficher En Attente<', '>{{ \'PLANNING.SHOW_PENDING\' | translate }}<')
        ]
    },
    {
        'file': 'app/features/mes-mouvements/mes-mouvements.component.html',
        'replaces': [
            ('placeholder="Tapez pour filtrer..."', '[placeholder]="\'FILTERS.TYPE_TO_FILTER\' | translate"'),
            ('Rechercher objectif, chauffeur, lieu...', '{{ \'FILTERS.SEARCH_HINT\' | translate }}'),
            ('>Tous les véhicules<', '>{{ \'FILTERS.ALL_VEHICLES\' | translate }}<')
        ]
    },
    {
        'file': 'app/features/map/map.html',
        'replaces': [
            ('placeholder="Rechercher objectif, chauffeur, lieu..."', '[placeholder]="\'FILTERS.SEARCH_HINT\' | translate"'),
            ('>Tous les véhicules<', '>{{ \'FILTERS.ALL_VEHICLES\' | translate }}<'),
            ('>Tous les statuts<', '>{{ \'STATUS.ALL_STATUSES\' | translate }}<'),
            ('>En cours<', '>{{ \'STATUS.IN_PROGRESS\' | translate }}<'),
            ('>Validé (En attente)<', '>{{ \'STATUS.VALIDATED_PENDING\' | translate }}<'),
            ('>Terminé<', '>{{ \'STATUS.COMPLETED\' | translate }}<'),
            ('>filtered trips<', '>{{ \'MAP.FILTERED_TRIPS\' | translate }}<'),
            ('>Véhicule Inconnu<', '>{{ \'MAP.UNKNOWN_VEHICLE\' | translate }}<')
        ]
    },
    {
        'file': 'app/features/maintenance-tracking/maintenance-tracking.component.html',
        'replaces': [
            ('>Fonctionnement du Suivi Kilométrique<', '>{{ \'MAINTENANCE.HOW_IT_WORKS_KM\' | translate }}<'),
            ('>Cet onglet vous permet de visualiser l\'état de santé de chaque véhicule de votre flotte par rapport à ses obligations de maintenance.<', '>{{ \'MAINTENANCE.TRACKING_INFO\' | translate }}<'),
            ('Il compare le kilométrage actuel avec les services configurés (A, B, C...) pour déterminer l\'écart exact. \n            Les véhicules nécessitant une attention immédiate apparaissent avec un statut Critique ou En retard.', ''),
            ('>À jour<', '>{{ \'MAINTENANCE.STATUS.UP_TO_DATE\' | translate }}<'),
            ('>Proche<', '>{{ \'MAINTENANCE.STATUS.CLOSE\' | translate }}<'),
            ('>En retard<', '>{{ \'MAINTENANCE.STATUS.OVERDUE\' | translate }}<'),
            ('>Critique<', '>{{ \'MAINTENANCE.STATUS.CRITICAL\' | translate }}<'),
            ('>Fonctionnement des Maintenances Planifiées<', '>{{ \'MAINTENANCE.HOW_IT_WORKS_PLANNED\' | translate }}<'),
            ('>Fonctionnement du Smart Cost & Analytics<', '>{{ \'MAINTENANCE.HOW_IT_WORKS_SMART\' | translate }}<'),
            ('>Fonctionnement des Prédictions<', '>{{ \'MAINTENANCE.HOW_IT_WORKS_PREDICTIVE\' | translate }}<')
        ]
    },
    {
        'file': 'app/features/smart-cost-dashboard/smart-cost-dashboard.component.html',
        'replaces': [
            ('>Smart Cost & Analytics<', '>{{ \'SMART_COST.TITLE\' | translate }}<'),
            ('>Coût Total<', '>{{ \'SMART_COST.TOTAL_COST\' | translate }}<'),
            ('>Prévision (IA)<', '>{{ \'SMART_COST.FORECAST_AI\' | translate }}<'),
            ('>Fiabilité par Modèle<', '>{{ \'SMART_COST.RELIABILITY\' | translate }}<')
        ]
    },
    {
        'file': 'app/features/gestion-chauffeurs/gestion-chauffeurs.component.html',
        'replaces': [
            ('>Colonnes affichées<', '>{{ \'DRIVERS.DISPLAYED_COLUMNS\' | translate }}<'),
            ('>Nom, Email, Pays, Base, Véhic...<', '>{{ \'DRIVERS.COLUMNS_HINT\' | translate }}<'),
            ('mat-sort-header>NOM<', 'mat-sort-header>{{ \'DRIVERS.COL_NAME\' | translate }}<'),
            ('mat-sort-header>EMAIL / TÉL<', 'mat-sort-header>{{ \'DRIVERS.COL_EMAIL\' | translate }}<'),
            ('mat-sort-header>PAYS<', 'mat-sort-header>{{ \'DRIVERS.COL_COUNTRY\' | translate }}<'),
            ('mat-sort-header>BASE<', 'mat-sort-header>{{ \'DRIVERS.COL_BASE\' | translate }}<'),
            ('mat-sort-header>VÉHICULE ATTITRÉ<', 'mat-sort-header>{{ \'DRIVERS.COL_VEHICLE\' | translate }}<'),
            ('>ACTIONS<', '>{{ \'DRIVERS.COL_ACTIONS\' | translate }}<'),
            ('placeholder="Rechercher..."', '[placeholder]="\'DRIVERS.SEARCH\' | translate"')
        ]
    }
]

for item in replacements:
    filepath = os.path.join(base_dir, item['file'])
    if not os.path.exists(filepath):
        print(f"NOT FOUND: {filepath}")
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in item['replaces']:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def update_json(lang_file, new_keys):
    with open(lang_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    def merge(d, u):
        for k, v in u.items():
            if isinstance(v, dict):
                d[k] = merge(d.get(k, {}), v)
            else:
                d[k] = v
        return d
        
    data = merge(data, new_keys)
    with open(lang_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

update_json(os.path.join(base_dir, 'assets/i18n/fr.json'), translations['fr'])
update_json(os.path.join(base_dir, 'assets/i18n/en.json'), translations['en'])

print("All translations applied!")
