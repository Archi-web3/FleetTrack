import os
import json

def set_nested(d, key_path, value):
    keys = key_path.split('.')
    current = d
    for i, k in enumerate(keys[:-1]):
        if k not in current:
            current[k] = {}
        current = current[k]
    current[keys[-1]] = value

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/e-logbook/src'

translations = {
    'fr': {},
    'en': {}
}

def add_translation(key, fr_val, en_val):
    set_nested(translations['fr'], key, fr_val)
    set_nested(translations['en'], key, en_val)

add_translation('MOBILE.INCIDENT_TYPES.BREAKDOWN', 'Panne', 'Breakdown')
add_translation('MOBILE.INCIDENT_TYPES.ACCIDENT', 'Accident', 'Accident')
add_translation('MOBILE.INCIDENT_TYPES.DELAY', 'Retard', 'Delay')
add_translation('MOBILE.INCIDENT_TYPES.PUNCTURE', 'Crevaison', 'Puncture')
add_translation('MOBILE.INCIDENT_TYPES.OTHER', 'Autre', 'Other')
add_translation('MOBILE.SEVERITY.LOW', 'Faible', 'Low')
add_translation('MOBILE.SEVERITY.MEDIUM', 'Moyenne', 'Medium')
add_translation('MOBILE.SEVERITY.HIGH', 'Élevée', 'High')

add_translation('MOBILE.LOGIN.IMPORTANT', 'Important', 'Important')
add_translation('MOBILE.LOGIN.CONNECT', 'Connectez-vous avec Internet et', 'Log in with Internet connection and')
add_translation('MOBILE.LOGIN.DONT_LOGOUT', 'ne vous déconnectez pas', 'do not log out')
add_translation('MOBILE.LOGIN.OFFLINE_MODE', 'pour le mode hors-ligne.', 'for offline mode.')

add_translation('MOBILE.FUEL.DIESEL', 'Diesel', 'Diesel')
add_translation('MOBILE.FUEL.PETROL', 'Essence', 'Petrol')
add_translation('MOBILE.FUEL.ELECTRIC', 'Électrique', 'Electric')
add_translation('MOBILE.FUEL.STATION', 'Station Service', 'Gas Station')
add_translation('MOBILE.FUEL.INTERNAL_STOCK', 'Stock Interne', 'Internal Stock')

add_translation('MOBILE.VEHICLE.IDENTIFICATION', 'Identification', 'Identification')
add_translation('MOBILE.VEHICLE.PLATE', 'Immatriculation', 'License Plate')
add_translation('MOBILE.VEHICLE.BRAND', 'Marque', 'Brand')
add_translation('MOBILE.VEHICLE.MODEL', 'Modèle', 'Model')
add_translation('MOBILE.VEHICLE.FLEET_CODE', 'Code Flotte', 'Fleet Code')

replacements = [
    {
        'file': 'app/features/incidents/incident-form/incident-form.html',
        'replaces': [
            ('>Panne<', '>{{ \'MOBILE.INCIDENT_TYPES.BREAKDOWN\' | translate }}<'),
            ('>Accident<', '>{{ \'MOBILE.INCIDENT_TYPES.ACCIDENT\' | translate }}<'),
            ('>Retard<', '>{{ \'MOBILE.INCIDENT_TYPES.DELAY\' | translate }}<'),
            ('>Crevaison<', '>{{ \'MOBILE.INCIDENT_TYPES.PUNCTURE\' | translate }}<'),
            ('>Autre<', '>{{ \'MOBILE.INCIDENT_TYPES.OTHER\' | translate }}<'),
            ('>Faible<', '>{{ \'MOBILE.SEVERITY.LOW\' | translate }}<'),
            ('>Moyenne<', '>{{ \'MOBILE.SEVERITY.MEDIUM\' | translate }}<'),
            ('>Élevée<', '>{{ \'MOBILE.SEVERITY.HIGH\' | translate }}<')
        ]
    },
    {
        'file': 'app/features/auth/login/login.html',
        'replaces': [
            ('>Important<', '>{{ \'MOBILE.LOGIN.IMPORTANT\' | translate }}<'),
            ('>Connectez-vous avec Internet et<', '>{{ \'MOBILE.LOGIN.CONNECT\' | translate }}<'),
            ('>ne vous déconnectez pas<', '>{{ \'MOBILE.LOGIN.DONT_LOGOUT\' | translate }}<'),
            ('>pour le mode hors-ligne.<', '>{{ \'MOBILE.LOGIN.OFFLINE_MODE\' | translate }}<')
        ]
    },
    {
        'file': 'app/features/fuel/fuel-form/fuel-form.html',
        'replaces': [
            ('>Diesel<', '>{{ \'MOBILE.FUEL.DIESEL\' | translate }}<'),
            ('>Essence<', '>{{ \'MOBILE.FUEL.PETROL\' | translate }}<'),
            ('>Électrique<', '>{{ \'MOBILE.FUEL.ELECTRIC\' | translate }}<'),
            ('>Station Service<', '>{{ \'MOBILE.FUEL.STATION\' | translate }}<'),
            ('>Stock ACF<', '>{{ \'MOBILE.FUEL.INTERNAL_STOCK\' | translate }}<'),
            ('value="Stock ACF"', 'value="Stock Interne"') # This is important for the database compatibility? Actually value should stay the same or change? Let's just change the display text. Wait, if value is used in backend, I shouldn't touch it, just the text. Ah, "Stock ACF" might be in the database. I will only change the text >Stock ACF<
        ]
    },
    {
        'file': 'app/features/vehicles/vehicle-form/vehicle-form.html',
        'replaces': [
            ('>Identification<', '>{{ \'MOBILE.VEHICLE.IDENTIFICATION\' | translate }}<'),
            ('>Immatriculation<', '>{{ \'MOBILE.VEHICLE.PLATE\' | translate }}<'),
            ('>Marque<', '>{{ \'MOBILE.VEHICLE.BRAND\' | translate }}<'),
            ('>Modèle<', '>{{ \'MOBILE.VEHICLE.MODEL\' | translate }}<'),
            ('>Code ACF<', '>{{ \'MOBILE.VEHICLE.FLEET_CODE\' | translate }}<')
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

# Mobile i18n
update_json(os.path.join(base_dir, 'assets/i18n/fr.json'), translations['fr'])
update_json(os.path.join(base_dir, 'assets/i18n/en.json'), translations['en'])

print("Mobile translation applied.")
