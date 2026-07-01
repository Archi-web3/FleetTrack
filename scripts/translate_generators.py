import os
import json

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src'

translations = {
    'fr': {
        'GENERATORS': {
            'LIST': {
                'TITLE': 'Flotte de Générateurs',
                'INTERNAL_GUIDE': 'Guide de Maintenance Interne',
                'ADD_BTN': 'Ajouter un Générateur',
                'BANNER_TITLE': 'Gestion des Moteurs / Générateurs',
                'COL_BRAND': 'Marque',
                'COL_MODEL': 'Modèle',
                'COL_KVA': 'KVA',
                'COL_SERIAL': 'Numéro Série',
                'COL_SITE': 'Site / Base',
                'COL_HOURS': 'Heures',
                'COL_STATUS': 'Statut',
                'COL_ACTIONS': 'Actions',
                'TOOLTIP_VIEW': 'Voir détails & Logbook',
                'TOOLTIP_EDIT': 'Modifier',
                'TOOLTIP_INTERVENTION': 'Nouvelle intervention',
                'TOOLTIP_DELETE': 'Supprimer',
                'LOADING': 'Chargement...',
                'EMPTY': 'Aucun générateur trouvé dans la flotte.'
            },
            'DETAIL': {
                'TITLE': 'Détails du Générateur :',
                'EDIT_BTN': 'Modifier',
                'INTERVENTION_BTN': 'Nouvelle Intervention',
                'BANNER_TITLE': 'Détails et Historique du Générateur',
                'HOURS': 'Heures de fonctionnement',
                'AVG_CONSUMPTION': 'Consommation Théorique Moyenne',
                'STATUS': 'Statut',
                'TAB_LOGBOOK': 'Logbook Horaire & Carburant',
                'TAB_INTERVENTIONS': 'Historique des Interventions',
                'LOGBOOK_NEW_TITLE': 'Nouveau relevé Logbook',
                'LOGBOOK_DATE': 'Date Relevé',
                'LOGBOOK_START': 'Heure Début',
                'LOGBOOK_END': 'Heure Fin',
                'LOGBOOK_FUEL': 'Carburant Ajouté (L)',
                'LOGBOOK_SAVE': 'Enregistrer',
                'COL_DATE': 'Date',
                'COL_START': 'Hr Début',
                'COL_END': 'Hr Fin',
                'COL_DURATION': 'Durée (h)',
                'COL_ADDED': 'Ajout (L)',
                'COL_CONSUMPTION': 'Conso (L/h)',
                'COL_BY': 'Par',
                'COL_TYPE': 'Type',
                'COL_FREQUENCY': 'Fréquence',
                'COL_TECHNICIAN': 'Intervenant',
                'LOADING': 'Chargement des données du générateur...'
            },
            'FORM': {
                'TITLE_EDIT': 'Modifier le générateur',
                'TITLE_ADD': 'Ajouter un générateur',
                'BANNER_TITLE': 'Formulaire d\'enregistrement du Moteur',
                'SECTION_IDENTIFICATION': 'Identification du Moteur / Générateur',
                'CODE': 'Code Interne',
                'BRAND': 'Marque',
                'MODEL': 'Modèle',
                'OWNER': 'Propriétaire',
                'OWNER_PH': 'Ex: Interne, Location, etc.',
                'CATEGORY': 'Catégorie Moteur',
                'SERIAL_GEN': 'Numéro de Série (Générateur)',
                'SERIAL_ENGINE': 'Numéro de Moteur',
                'SECTION_SPECS': 'Spécifications techniques',
                'KVA': 'Puissance (KVA)',
                'FUEL_TYPE': 'Type de Carburant',
                'SECTION_LOCATION': 'Localisation et Statut',
                'BASE': 'Base / Site',
                'COUNTRY': 'Pays',
                'SPECIFIC_SITE': 'Site spécifique d\'installation',
                'SPECIFIC_SITE_PH': 'Ex: Compound 2, Hopital',
                'STATUS': 'Statut',
                'SECTION_HISTORY': 'Historique, Coûts et Heures',
                'YEAR_MFG': 'Année de Fabrication',
                'YEAR_USAGE': 'Année de 1ère Utilisation',
                'INSURANCE_COST': 'Coût d\'assurance annuel',
                'START_DATE': 'Date de commencement (au 1er Janvier)',
                'INITIAL_HOURS': 'Nombre d\'heures initiales',
                'CURRENT_HOURS': 'Heures totales actuelles',
                'SECTION_NOTES': 'Remarques & Notes',
                'CANCEL': 'Annuler',
                'SAVE': 'Enregistrer'
            },
            'INTERVENTION': {
                'TITLE': 'Fiche d\'intervention / Maintenance',
                'SECTION_GENERAL': 'Données Générales',
                'TECHNICIAN': 'Nom de l\'intervenant',
                'DATE': 'Date d\'intervention',
                'TYPE': 'Type d\'intervention',
                'TYPE_PREV': 'Préventive',
                'TYPE_CUR': 'Curative',
                'FREQUENCY': 'Fréquence',
                'FREQ_EACH': 'Chaque',
                'FREQ_HRS': 'Hrs',
                'CURRENT_HOURS': 'Nb d\'heures de fonctionnement (actuel)',
                'NEXT_MAINTENANCE': 'Prochaine maintenance à (heures)',
                'SECTION_CURATIVE': 'Description de la panne',
                'SECTION_PREVENTIVE': 'Checklist des tâches effectuées',
                'SECTION_OBSERVATIONS': 'Observation(s)',
                'SECTION_PARTS': 'Pièce(s) utilisée(s)',
                'ADD_PART': 'Ajouter une pièce',
                'PART_REF': 'Référence',
                'PART_DETAILS': 'Détails',
                'PART_QTY': 'Qté',
                'SECTION_TEST': 'Test du groupe durant 5 mn après intervention',
                'TEST_CONDITION': 'Condition de fonctionnement',
                'TEST_NORMAL': 'Fonctionnement normal',
                'TEST_NOISE': 'Bruit suspect détecté',
                'TEST_BAD': 'Mauvais fonctionnement, le groupe ne peut plus être utilisé.',
                'CANCEL': 'Annuler',
                'SAVE': 'Enregistrer l\'intervention',
                'LOADING': 'Chargement du générateur...'
            },
            'GUIDE': {
                'TITLE': 'Guide de Maintenance Interne des Générateurs',
                'INFO': 'Ce guide liste l\'ensemble des tâches de maintenance à effectuer sur les générateurs et moteurs en fonction de leurs heures de fonctionnement. Lors de la création d\'une intervention préventive, ces tâches seront automatiquement proposées sous forme de checklist à valider par le technicien.',
                'SERVICES': {
                    'A_TITLE': 'Service A (250 Heures)',
                    'A_DESC': 'Maintenance préventive de base, incluant la vérification visuelle, les ajustements et la vidange primaire.',
                    'A_TASKS': {
                        '0': 'Nettoyer le moteur (poussière/huile/échappement)',
                        '1': 'Ajuster les cosses batterie et fixation batterie',
                        '2': 'Ajuster les durites et collier de serrage',
                        '3': 'Vérifier l\'état général, propreté, nettoyage de tâche de liquide',
                        '4': 'Vérifier le niveau de liquide de refroidissement',
                        '5': 'Vérifier les fuites d\'huiles, essence, liquide de refroidissement',
                        '6': 'Vidanger le filtre d\'essence primaire (& secondaire) séparateur d\'eau',
                        '7': 'Vérifier la courroie d\'alternateur & ventilateur',
                        '8': 'Vérifier le niveau d\'électrolyte batterie (et faire l\'appoint si nécessaire)',
                        '9': 'Vidanger l\'huile moteur & remplissage avec de l\'huile neuve adaptée',
                        '10': 'Vidanger les condensats du silencieux d\'échappement',
                        '11': 'Nettoyer le système de refroidissement (Faisceau radiateur)',
                        '12': 'Nettoyer le tuyau ou bac reniflards d\'huile'
                    },
                    'B_TITLE': 'Service B (500 Heures)',
                    'B_DESC': 'Maintenance préventive intermédiaire, incluant le remplacement complet des filtres et vérification des tuyaux.',
                    'B_TASKS': {
                        '0': 'Toutes les tâches du Service A (250 Heures)',
                        '1': 'Changer les filtres (huile, essence, liquide de refroidissement, air)',
                        '2': 'Vérifier l\'intégralité des tuyaux et durites (huile/essence/liquide/air)'
                    },
                    'C_TITLE': 'Service C (1000 Heures)',
                    'C_DESC': 'Maintenance préventive approfondie, ciblant les soupapes et le système de refroidissement.',
                    'C_TASKS': {
                        '0': 'Toutes les tâches du Service A & B (250h et 500h)',
                        '1': 'Controler et ajuster le calage des soupapes (si nécessaire)',
                        '2': 'Vidange Liquide de refroidissement (Rinçage & Nettoyage du circuit)'
                    },
                    'D_TITLE': 'Service D (3000 Heures)',
                    'D_DESC': 'Maintenance préventive majeure, intervention sur les pièces d\'usure et chambres de combustion.',
                    'D_TASKS': {
                        '0': 'Toutes les tâches du Service A, B & C (250h, 500h et 1000h)',
                        '1': 'Tester et/ou changer les injecteurs d\'essence / Changer toutes les courroies',
                        '2': 'Ouvrir et nettoyer les chambres de combustion'
                    }
                }
            }
        }
    },
    'en': {
        'GENERATORS': {
            'LIST': {
                'TITLE': 'Generators Fleet',
                'INTERNAL_GUIDE': 'Internal Maintenance Guide',
                'ADD_BTN': 'Add a Generator',
                'BANNER_TITLE': 'Engines / Generators Management',
                'COL_BRAND': 'Brand',
                'COL_MODEL': 'Model',
                'COL_KVA': 'KVA',
                'COL_SERIAL': 'Serial Number',
                'COL_SITE': 'Site / Base',
                'COL_HOURS': 'Hours',
                'COL_STATUS': 'Status',
                'COL_ACTIONS': 'Actions',
                'TOOLTIP_VIEW': 'View Details & Logbook',
                'TOOLTIP_EDIT': 'Edit',
                'TOOLTIP_INTERVENTION': 'New intervention',
                'TOOLTIP_DELETE': 'Delete',
                'LOADING': 'Loading...',
                'EMPTY': 'No generator found in the fleet.'
            },
            'DETAIL': {
                'TITLE': 'Generator Details :',
                'EDIT_BTN': 'Edit',
                'INTERVENTION_BTN': 'New Intervention',
                'BANNER_TITLE': 'Generator Details and History',
                'HOURS': 'Operating hours',
                'AVG_CONSUMPTION': 'Average Theoretical Consumption',
                'STATUS': 'Status',
                'TAB_LOGBOOK': 'Hourly & Fuel Logbook',
                'TAB_INTERVENTIONS': 'Interventions History',
                'LOGBOOK_NEW_TITLE': 'New Logbook Entry',
                'LOGBOOK_DATE': 'Entry Date',
                'LOGBOOK_START': 'Start Hour',
                'LOGBOOK_END': 'End Hour',
                'LOGBOOK_FUEL': 'Fuel Added (L)',
                'LOGBOOK_SAVE': 'Save',
                'COL_DATE': 'Date',
                'COL_START': 'Start Hr',
                'COL_END': 'End Hr',
                'COL_DURATION': 'Duration (h)',
                'COL_ADDED': 'Added (L)',
                'COL_CONSUMPTION': 'Cons. (L/h)',
                'COL_BY': 'By',
                'COL_TYPE': 'Type',
                'COL_FREQUENCY': 'Frequency',
                'COL_TECHNICIAN': 'Technician',
                'LOADING': 'Loading generator data...'
            },
            'FORM': {
                'TITLE_EDIT': 'Edit generator',
                'TITLE_ADD': 'Add a generator',
                'BANNER_TITLE': 'Engine Registration Form',
                'SECTION_IDENTIFICATION': 'Engine / Generator Identification',
                'CODE': 'Internal Code',
                'BRAND': 'Brand',
                'MODEL': 'Model',
                'OWNER': 'Owner',
                'OWNER_PH': 'Ex: Internal, Rental, etc.',
                'CATEGORY': 'Engine Category',
                'SERIAL_GEN': 'Serial Number (Generator)',
                'SERIAL_ENGINE': 'Engine Number',
                'SECTION_SPECS': 'Technical Specifications',
                'KVA': 'Power (KVA)',
                'FUEL_TYPE': 'Fuel Type',
                'SECTION_LOCATION': 'Location and Status',
                'BASE': 'Base / Site',
                'COUNTRY': 'Country',
                'SPECIFIC_SITE': 'Specific installation site',
                'SPECIFIC_SITE_PH': 'Ex: Compound 2, Hospital',
                'STATUS': 'Status',
                'SECTION_HISTORY': 'History, Costs and Hours',
                'YEAR_MFG': 'Manufacturing Year',
                'YEAR_USAGE': '1st Use Year',
                'INSURANCE_COST': 'Annual insurance cost',
                'START_DATE': 'Start date (as of Jan 1st)',
                'INITIAL_HOURS': 'Initial hours number',
                'CURRENT_HOURS': 'Current total hours',
                'SECTION_NOTES': 'Remarks & Notes',
                'CANCEL': 'Cancel',
                'SAVE': 'Save'
            },
            'INTERVENTION': {
                'TITLE': 'Intervention / Maintenance form',
                'SECTION_GENERAL': 'General Data',
                'TECHNICIAN': 'Technician Name',
                'DATE': 'Intervention Date',
                'TYPE': 'Intervention Type',
                'TYPE_PREV': 'Preventive',
                'TYPE_CUR': 'Curative',
                'FREQUENCY': 'Frequency',
                'FREQ_EACH': 'Every',
                'FREQ_HRS': 'Hrs',
                'CURRENT_HOURS': 'Operating hours (current)',
                'NEXT_MAINTENANCE': 'Next maintenance at (hours)',
                'SECTION_CURATIVE': 'Breakdown description',
                'SECTION_PREVENTIVE': 'Performed tasks checklist',
                'SECTION_OBSERVATIONS': 'Observation(s)',
                'SECTION_PARTS': 'Used part(s)',
                'ADD_PART': 'Add a part',
                'PART_REF': 'Reference',
                'PART_DETAILS': 'Details',
                'PART_QTY': 'Qty',
                'SECTION_TEST': 'Group test for 5 mins after intervention',
                'TEST_CONDITION': 'Operating condition',
                'TEST_NORMAL': 'Normal operation',
                'TEST_NOISE': 'Suspicious noise detected',
                'TEST_BAD': 'Malfunction, the group can no longer be used.',
                'CANCEL': 'Cancel',
                'SAVE': 'Save intervention',
                'LOADING': 'Loading generator...'
            },
            'GUIDE': {
                'TITLE': 'Generators Internal Maintenance Guide',
                'INFO': 'This guide lists all maintenance tasks to be performed on generators and engines based on their operating hours. When creating a preventive intervention, these tasks will be automatically proposed as a checklist for the technician to validate.',
                'SERVICES': {
                    'A_TITLE': 'Service A (250 Hours)',
                    'A_DESC': 'Basic preventive maintenance, including visual inspection, adjustments, and primary oil change.',
                    'A_TASKS': {
                        '0': 'Clean the engine (dust/oil/exhaust)',
                        '1': 'Adjust battery terminals and battery securing',
                        '2': 'Adjust hoses and clamps',
                        '3': 'Check overall condition, cleanliness, cleaning of liquid stains',
                        '4': 'Check coolant level',
                        '5': 'Check for oil, fuel, coolant leaks',
                        '6': 'Drain primary fuel filter (& secondary) water separator',
                        '7': 'Check alternator & fan belt',
                        '8': 'Check battery electrolyte level (and top up if necessary)',
                        '9': 'Drain engine oil & fill with adapted new oil',
                        '10': 'Drain exhaust silencer condensates',
                        '11': 'Clean cooling system (Radiator core)',
                        '12': 'Clean oil breather hose or tray'
                    },
                    'B_TITLE': 'Service B (500 Hours)',
                    'B_DESC': 'Intermediate preventive maintenance, including full replacement of filters and hoses check.',
                    'B_TASKS': {
                        '0': 'All tasks from Service A (250 Hours)',
                        '1': 'Change filters (oil, fuel, coolant, air)',
                        '2': 'Check all hoses and pipes (oil/fuel/liquid/air)'
                    },
                    'C_TITLE': 'Service C (1000 Hours)',
                    'C_DESC': 'Extensive preventive maintenance, targeting valves and cooling system.',
                    'C_TASKS': {
                        '0': 'All tasks from Service A & B (250h and 500h)',
                        '1': 'Check and adjust valve clearance (if necessary)',
                        '2': 'Drain Coolant (Flushing & Cleaning the circuit)'
                    },
                    'D_TITLE': 'Service D (3000 Hours)',
                    'D_DESC': 'Major preventive maintenance, intervention on wearing parts and combustion chambers.',
                    'D_TASKS': {
                        '0': 'All tasks from Service A, B & C (250h, 500h and 1000h)',
                        '1': 'Test and/or change fuel injectors / Change all belts',
                        '2': 'Open and clean combustion chambers'
                    }
                }
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

print("Dictionary generators applied!")
