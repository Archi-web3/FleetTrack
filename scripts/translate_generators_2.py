import os
import json

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src'

translations = {
    'fr': {
        'GENERATORS': {
            'STATUS': {
                'ACTIVE': 'Actif',
                'MAINTENANCE': 'En maintenance',
                'BROKEN': 'En panne',
                'OUT_OF_SERVICE': 'Hors service',
                'UP_TO_DATE': 'À jour',
                'DUE': 'Dû bientôt',
                'OVERDUE': 'En retard'
            },
            'PLAN': {
                'TITLE': 'Plan de Maintenance Prévisionnel (Générateurs)',
                'BANNER_TITLE': 'Planification de la Maintenance (Heures)',
                'COL_GENERATOR': 'Générateur',
                'COL_CURRENT_HOURS': 'Heures Actuelles',
                'COL_NEXT_SERVICE': 'Prochain Service',
                'COL_REMAINING_HOURS': 'Heures Restantes',
                'COL_STATUS': 'Statut',
                'COL_ACTIONS': 'Actions',
                'BTN_PLAN': 'Planifier / Effectuer',
                'LOADING': 'Chargement du plan de maintenance...'
            },
            'DETAIL': {
                'COL_HOURS': 'Heures',
                'COL_STATUS': 'Statut'
            },
            'FORM': {
                'SECTION_NOTES': 'Remarques & Notes'
            }
        }
    },
    'en': {
        'GENERATORS': {
            'STATUS': {
                'ACTIVE': 'Active',
                'MAINTENANCE': 'In Maintenance',
                'BROKEN': 'Broken down',
                'OUT_OF_SERVICE': 'Out of service',
                'UP_TO_DATE': 'Up to date',
                'DUE': 'Due soon',
                'OVERDUE': 'Overdue'
            },
            'PLAN': {
                'TITLE': 'Predictive Maintenance Plan (Generators)',
                'BANNER_TITLE': 'Maintenance Planning (Hours)',
                'COL_GENERATOR': 'Generator',
                'COL_CURRENT_HOURS': 'Current Hours',
                'COL_NEXT_SERVICE': 'Next Service',
                'COL_REMAINING_HOURS': 'Remaining Hours',
                'COL_STATUS': 'Status',
                'COL_ACTIONS': 'Actions',
                'BTN_PLAN': 'Plan / Perform',
                'LOADING': 'Loading maintenance plan...'
            },
            'DETAIL': {
                'COL_HOURS': 'Hours',
                'COL_STATUS': 'Status'
            },
            'FORM': {
                'SECTION_NOTES': 'Remarks & Notes'
            }
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

print("Dictionary extensions applied!")
