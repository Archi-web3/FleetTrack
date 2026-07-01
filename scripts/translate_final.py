import os
import json

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src'

translations = {
    'fr': {
        'VEHICLES': {
            'NEW_VEHICLE': 'NOUVEAU VÉHICULE',
            'COL_LICENSE': 'IMMATRICULATION',
            'COL_BRAND_MODEL': 'MARQUE/MODÈLE',
            'COL_FLEET_CODE': 'CODE FLOTTE',
            'COL_OWNERSHIP': 'PROPRIÉTÉ',
            'COL_STATUS': 'STATUT',
            'COL_ACTIONS': 'ACTIONS',
            'COLUMNS_HINT': 'Immatriculation, Marque/Modèle...',
            'DISPLAYED_COLUMNS': 'Colonnes affichées',
            'SEARCH': 'Rechercher...'
        },
        'VEHICLE_STATUS': {
            'IN_SERVICE': 'En Service',
            'ARCHIVED': 'Archivé',
            'BROKEN_DOWN': 'En Panne',
            'ACCIDENT': 'Accidenté'
        },
        'MAINTENANCE': {
            'IN': 'Dans',
            'KM': 'km',
            'EST': 'Est:'
        }
    },
    'en': {
        'VEHICLES': {
            'NEW_VEHICLE': 'NEW VEHICLE',
            'COL_LICENSE': 'LICENSE PLATE',
            'COL_BRAND_MODEL': 'BRAND/MODEL',
            'COL_FLEET_CODE': 'FLEET CODE',
            'COL_OWNERSHIP': 'OWNERSHIP',
            'COL_STATUS': 'STATUS',
            'COL_ACTIONS': 'ACTIONS',
            'COLUMNS_HINT': 'License Plate, Brand/Model...',
            'DISPLAYED_COLUMNS': 'Displayed Columns',
            'SEARCH': 'Search...'
        },
        'VEHICLE_STATUS': {
            'IN_SERVICE': 'In Service',
            'ARCHIVED': 'Archived',
            'BROKEN_DOWN': 'Broken Down',
            'ACCIDENT': 'Accident'
        },
        'MAINTENANCE': {
            'IN': 'In',
            'KM': 'km',
            'EST': 'Est:'
        }
    }
}

replacements = [
    {
        'file': 'app/features/gestion-vehicules/gestion-vehicules.component.html',
        'replaces': [
            ('>NOUVEAU VÉHICULE<', '>{{ \'VEHICLES.NEW_VEHICLE\' | translate }}<'),
            ('mat-sort-header> Immatriculation <', 'mat-sort-header> {{ \'VEHICLES.COL_LICENSE\' | translate }} <'),
            ('mat-sort-header> Marque/Modèle <', 'mat-sort-header> {{ \'VEHICLES.COL_BRAND_MODEL\' | translate }} <'),
            ('mat-sort-header> Code Flotte <', 'mat-sort-header> {{ \'VEHICLES.COL_FLEET_CODE\' | translate }} <'),
            ('mat-sort-header> Propriété <', 'mat-sort-header> {{ \'VEHICLES.COL_OWNERSHIP\' | translate }} <'),
            ('mat-sort-header> Statut <', 'mat-sort-header> {{ \'VEHICLES.COL_STATUS\' | translate }} <'),
            ('>Actions<', '>{{ \'VEHICLES.COL_ACTIONS\' | translate }}<'),
            ('>Colonnes affichées<', '>{{ \'VEHICLES.DISPLAYED_COLUMNS\' | translate }}<'),
            ('Immatriculation, Marque/Mo...', '{{ \'VEHICLES.COLUMNS_HINT\' | translate }}'),
            ('placeholder="Rechercher..."', '[placeholder]="\'VEHICLES.SEARCH\' | translate"'),
            ('> En Service <', '> {{ \'VEHICLE_STATUS.IN_SERVICE\' | translate }} <'),
            ('> Archivé <', '> {{ \'VEICLE_STATUS.ARCHIVED\' | translate }} <'),
            ('> En Panne <', '> {{ \'VEHICLE_STATUS.BROKEN_DOWN\' | translate }} <'),
            ('> Accidenté <', '> {{ \'VEHICLE_STATUS.ACCIDENT\' | translate }} <')
        ]
    },
    {
        'file': 'app/features/maintenance-tracking/maintenance-tracking.component.html',
        'replaces': [
            (
                "Cet onglet vous permet de visualiser l'état de santé de chaque véhicule de votre flotte par rapport à ses obligations de maintenance.",
                "{{ 'MAINTENANCE.TRACKING_INFO' | translate }}"
            ),
            (
                "Dans {{ element.gapDistance }} km",
                "{{ 'MAINTENANCE.IN' | translate }} {{ element.gapDistance }} {{ 'MAINTENANCE.KM' | translate }}"
            ),
            (
                "Est: {{ element.nextServiceDate | date:'dd/MM/yyyy' }}",
                "{{ 'MAINTENANCE.EST' | translate }} {{ element.nextServiceDate | date:'dd/MM/yyyy' }}"
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

print("Final translations applied!")
