import os
import json

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src'

translations = {
    'fr': {
        'PLAN_MAINTENANCE': {
            'STATUS_URGENT': 'URGENT',
            'STATUS_VALIDATED': 'VALIDÉ'
        }
    },
    'en': {
        'PLAN_MAINTENANCE': {
            'STATUS_URGENT': 'URGENT',
            'STATUS_VALIDATED': 'VALIDATED'
        }
    }
}

replacements = [
    {
        'file': 'app/features/gestion-maintenance/plan-maintenance/plan-maintenance.component.html',
        'replaces': [
            (
                '{{element.statut}}',
                '''{{
              element.statut === \'En retard\' ? (\'PLAN_MAINTENANCE.STATUS_OVERDUE\' | translate) :
              element.statut === \'Dû\' ? (\'PLAN_MAINTENANCE.STATUS_DUE\' | translate) :
              element.statut === \'À venir\' ? (\'PLAN_MAINTENANCE.STATUS_UPCOMING\' | translate) :
              element.statut === \'URGENT\' ? (\'PLAN_MAINTENANCE.STATUS_URGENT\' | translate) :
              element.statut === \'VALIDÉ\' ? (\'PLAN_MAINTENANCE.STATUS_VALIDATED\' | translate) :
              (element.statut | translate)
            }}'''
            )
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

print("Dynamic translations applied!")
