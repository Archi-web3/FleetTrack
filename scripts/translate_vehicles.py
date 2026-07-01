import os
import json

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src'

translations = {
    'fr': {
        'VEHICLES': {
            'CATEGORY': {
                'VOITURE': 'Voiture',
                'CAMION': 'Camion',
                'MOTO': 'Moto'
            },
            'COL_LICENSE': 'Immatriculation',
            'COL_BRAND_MODEL': 'Marque/Modèle',
            'COL_FLEET_CODE': 'Code Flotte',
            'COL_OWNERSHIP': 'Propriété',
            'COL_STATUS': 'Statut',
            'COL_ACTIONS': 'Actions',
            'NEW_VEHICLE': 'Nouveau Véhicule',
            'STATUS': {
                'EN SERVICE': 'En Service',
                'HORS SERVICE': 'Hors Service',
                'VENDU': 'Vendu',
                'ARCHIVÉ': 'Archivé',
                'RESTITUÉ': 'Restitué'
            },
            'FORM': {
                'PERMANENT_DRIVER': 'Chauffeur assigné en permanence',
                'TOTAL_KM_SO_FAR': 'Total kilomètres parcourus jusqu\'à présent',
                'TOTAL_KM_AUTO': 'Calcul auto : Kilométrage initial + Logbooks'
            }
        },
        'COMMON': {
            'YES': 'Oui',
            'ADD': 'Ajouter',
            'UPDATE': 'Mettre à jour',
            'CANCEL': 'Annuler'
        }
    },
    'en': {
        'VEHICLES': {
            'CATEGORY': {
                'VOITURE': 'Car',
                'CAMION': 'Truck',
                'MOTO': 'Motorcycle'
            },
            'COL_LICENSE': 'License Plate',
            'COL_BRAND_MODEL': 'Brand/Model',
            'COL_FLEET_CODE': 'Fleet Code',
            'COL_OWNERSHIP': 'Ownership',
            'COL_STATUS': 'Status',
            'COL_ACTIONS': 'Actions',
            'NEW_VEHICLE': 'New Vehicle',
            'STATUS': {
                'EN SERVICE': 'In Service',
                'HORS SERVICE': 'Out of Service',
                'VENDU': 'Sold',
                'ARCHIVÉ': 'Archived',
                'RESTITUÉ': 'Returned'
            },
            'FORM': {
                'PERMANENT_DRIVER': 'Permanently assigned driver',
                'TOTAL_KM_SO_FAR': 'Total kilometers driven so far',
                'TOTAL_KM_AUTO': 'Auto calc: Initial Mileage + Logbooks'
            }
        },
        'COMMON': {
            'YES': 'Yes',
            'ADD': 'Add',
            'UPDATE': 'Update',
            'CANCEL': 'Cancel'
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

print("Dictionary vehicles applied!")
