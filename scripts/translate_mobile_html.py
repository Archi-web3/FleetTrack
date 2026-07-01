import os
import json

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/e-logbook/src'

replacements = [
    {
        'file': 'app/features/incident-form/incident-form.html',
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
        'file': 'app/features/login/login.html',
        'replaces': [
            ('>Important<', '>{{ \'MOBILE.LOGIN.IMPORTANT\' | translate }}<'),
            ('>Connectez-vous avec Internet et<', '>{{ \'MOBILE.LOGIN.CONNECT\' | translate }}<'),
            ('>ne vous déconnectez pas<', '>{{ \'MOBILE.LOGIN.DONT_LOGOUT\' | translate }}<'),
            ('>pour le mode hors-ligne.<', '>{{ \'MOBILE.LOGIN.OFFLINE_MODE\' | translate }}<')
        ]
    },
    {
        'file': 'app/features/fuel-form/fuel-form.html',
        'replaces': [
            ('>Diesel<', '>{{ \'MOBILE.FUEL.DIESEL\' | translate }}<'),
            ('>Essence<', '>{{ \'MOBILE.FUEL.PETROL\' | translate }}<'),
            ('>Électrique<', '>{{ \'MOBILE.FUEL.ELECTRIC\' | translate }}<'),
            ('>Station Service<', '>{{ \'MOBILE.FUEL.STATION\' | translate }}<'),
            ('>Stock ACF<', '>{{ \'MOBILE.FUEL.INTERNAL_STOCK\' | translate }}<'),
            ('value="Stock ACF"', 'value="Stock Interne"')
        ]
    },
    {
        'file': 'app/features/vehicle-form/vehicle-form.html',
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

print("Mobile HTML files translated.")
