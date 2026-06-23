import os
import json

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src'

translations = {
    'fr': {
        'MAINTENANCE': {
            'TABS': {
                'GLOBAL': 'Suivi Global',
                'WEEKLY': 'Suivi Hebdo',
                'SMART_COST': 'Smart Cost & Analytics'
            },
            'CHECK_HEBDO': 'Check Hebdo',
            'SERVICE': 'Service',
            'STATUS_VALIDATED': 'Validé',
            'HOW_IT_WORKS_PREDICTIVE_TEXT': 'L\'outil analyse automatiquement la <strong>moyenne réelle de kilomètres parcourus</strong> par chaque véhicule entre ses anciens services pour prédire la date exacte de son prochain service.<br>Il surveille également en arrière-plan la consommation d\'essence réelle via le logbook, et génère une <strong>alerte de surconsommation</strong> (en violet ou rouge) si la moyenne réelle dépasse de 20% la valeur théorique du constructeur.'
        },
        'PLANNED_INTERVENTIONS': {
            'DESCRIPTION': 'Ici sont recensées toutes les interventions manuelles et demandes spécifiques d\'indisponibilité pour réparation ou vérification. Vous pouvez créer, modifier ou supprimer ces événements. Les statuts "Terminé" indiquent que l\'intervention est clôturée et que le véhicule est de nouveau disponible.'
        },
        'SMART_COST_TAB': {
            'DESCRIPTION': 'Cette section analyse financièrement votre flotte. Elle consolide les coûts de carburant, de réparation, d\'assurance et d\'acquisition pour calculer le coût global et unitaire par véhicule et par kilomètre. Les graphiques vous aident à identifier les véhicules les plus coûteux à l\'entretien.'
        },
        'WEEKLY_CHECKLIST': {
            'HOW_IT_WORKS': 'Fonctionnement du Suivi Hebdomadaire',
            'DESCRIPTION': 'Cet onglet centralise les inspections hebdomadaires de sécurité réalisées par les chauffeurs depuis leur application mobile. Vous pouvez vérifier que chaque véhicule a été contrôlé en temps et en heure. Les anomalies (problèmes de freins, pneus, fuites...) remontées par les chauffeurs y sont directement visibles pour déclencher une action de maintenance.'
        },
        'PREDICTIVE_DASHBOARD': {
            'HOW_PREDICTIONS_WORK': 'Fonctionnement des Prédictions',
            'PARK_HEALTH': 'Santé du Parc',
            'GLOBAL_SCORE': 'Score Global',
            'CRITICAL_ALERTS': 'Alertes Critiques',
            'IMMINENT_MAINTENANCE': 'Maintenance Imminente',
            'VEHICLES_NEEDING_ATTENTION': 'Véhicules nécessitant attention',
            'TRACKED_VEHICLES': 'Véhicules Suivis',
            'TOTAL_FLEET': 'Total Flotte',
            'ANALYZED_BY_ALGO': 'Analysés par l\'algorithme',
            'PRIORITY_ALERTS': 'Alertes Prioritaires',
            'MAINTENANCE_FORECASTS': 'Prévisions de Maintenance',
            'COL_VEHICLE': 'VÉHICULE',
            'COL_CURRENT_KM': 'KM ACTUEL',
            'COL_NEXT_SERVICE': 'PROCHAIN SERVICE',
            'COL_ESTIMATED_DATE': 'DATE ESTIMÉE',
            'COL_HEALTH': 'SANTÉ',
            'COL_STATUS': 'STATUT',
            'STATUS_GOOD': 'Bon',
            'STATUS_WARNING': 'Attention'
        }
    },
    'en': {
        'MAINTENANCE': {
            'TABS': {
                'GLOBAL': 'Global Tracking',
                'WEEKLY': 'Weekly Checklist',
                'SMART_COST': 'Smart Cost & Analytics'
            },
            'CHECK_HEBDO': 'Weekly Check',
            'SERVICE': 'Service',
            'STATUS_VALIDATED': 'Validated',
            'HOW_IT_WORKS_PREDICTIVE_TEXT': 'The tool automatically analyzes the <strong>actual average kilometers driven</strong> by each vehicle between previous services to predict the exact date of its next service.<br>It also monitors real fuel consumption via the logbook in the background, and generates an <strong>overconsumption alert</strong> (in purple or red) if the actual average exceeds the manufacturer\'s theoretical value by 20%.'
        },
        'PLANNED_INTERVENTIONS': {
            'DESCRIPTION': 'This section lists all manual interventions and specific requests for downtime for repair or verification. You can create, edit, or delete these events. "Completed" statuses indicate that the intervention is closed and the vehicle is available again.'
        },
        'SMART_COST_TAB': {
            'DESCRIPTION': 'This section financially analyzes your fleet. It consolidates fuel, repair, insurance, and acquisition costs to calculate the overall and unit cost per vehicle and per kilometer. Charts help you identify the most expensive vehicles to maintain.'
        },
        'WEEKLY_CHECKLIST': {
            'HOW_IT_WORKS': 'How Weekly Tracking Works',
            'DESCRIPTION': 'This tab centralizes the weekly safety inspections carried out by drivers from their mobile app. You can verify that each vehicle has been checked on time. Anomalies (brakes, tires, leaks...) reported by drivers are directly visible to trigger a maintenance action.'
        },
        'PREDICTIVE_DASHBOARD': {
            'HOW_PREDICTIONS_WORK': 'How Predictions Work',
            'PARK_HEALTH': 'Fleet Health',
            'GLOBAL_SCORE': 'Global Score',
            'CRITICAL_ALERTS': 'Critical Alerts',
            'IMMINENT_MAINTENANCE': 'Imminent Maintenance',
            'VEHICLES_NEEDING_ATTENTION': 'Vehicles needing attention',
            'TRACKED_VEHICLES': 'Tracked Vehicles',
            'TOTAL_FLEET': 'Total Fleet',
            'ANALYZED_BY_ALGO': 'Analyzed by algorithm',
            'PRIORITY_ALERTS': 'Priority Alerts',
            'MAINTENANCE_FORECASTS': 'Maintenance Forecasts',
            'COL_VEHICLE': 'VEHICLE',
            'COL_CURRENT_KM': 'CURRENT KM',
            'COL_NEXT_SERVICE': 'NEXT SERVICE',
            'COL_ESTIMATED_DATE': 'ESTIMATED DATE',
            'COL_HEALTH': 'HEALTH',
            'COL_STATUS': 'STATUS',
            'STATUS_GOOD': 'Good',
            'STATUS_WARNING': 'Warning'
        }
    }
}

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

print("Dictionary translations applied!")
