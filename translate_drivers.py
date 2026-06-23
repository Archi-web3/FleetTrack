import os
import json

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src'

translations = {
    'fr': {
        'DRIVERS': {
            'TITLE': 'Gestion des Chauffeurs',
            'DISPLAYED_COLUMNS': 'Colonnes affichées',
            'SEARCH': 'Rechercher...',
            'NOT_AVAILABLE': 'Non dispo',
            'EDIT_TITLE': 'Modifier le Chauffeur',
            'COL_NAME': 'Nom',
            'COL_EMAIL': 'Email / Tél',
            'COL_COUNTRY': 'Pays',
            'COL_BASE': 'Base',
            'COL_ASSIGNED_VEHICLE': 'Véhicule Attitré',
            'COL_ACTIONS': 'Actions',
            'PROFILE': {
                'TITLE': 'Profil Chauffeur',
                'BACK': 'Retour à la liste',
                'STATUS': 'Statut',
                'STATUS_AVAILABLE': 'Disponible',
                'STATUS_UNAVAILABLE': 'Indisponible',
                'NOT_PROVIDED': 'Non renseigné',
                'NOT_ASSIGNED': 'Non assigné',
                'TABS': {
                    'HISTORY': 'Ses déplacements (Historique)',
                    'FUTURE': 'Ses futurs trajets',
                    'ATTACHMENTS': 'Pièces jointes',
                    'SCHEDULE': 'Disponibilités (Planning)'
                },
                'HISTORY_TITLE': 'Historique des déplacements',
                'NO_HISTORY': 'Aucun déplacement enregistré pour ce chauffeur.',
                'FUTURE_TITLE': 'Planning à venir',
                'NO_FUTURE': 'Aucun trajet planifié pour ce chauffeur.',
                'ATTACHMENTS_TITLE': 'Documents du chauffeur',
                'DOC_NAME': 'Nom du document (ex: Permis de conduire)',
                'DOC_URL': 'Lien Sharepoint / Drive',
                'OR': 'OU',
                'UPLOAD': 'Uploader',
                'ADDED_ON': 'Ajouté le',
                'NO_ATTACHMENTS': 'Aucune pièce jointe pour le moment.',
                'SCHEDULE_TITLE': 'Ajouter un horaire',
                'SCHEDULE_STATUS': 'Statut *',
                'SCHEDULE_ON_DUTY': 'En Service (On Duty)',
                'SCHEDULE_OFF_DUTY': 'Repos (Off Duty)',
                'SCHEDULE_SICK': 'Maladie',
                'SCHEDULE_VACATION': 'Congés (Vacation)',
                'SCHEDULE_OTHER': 'Autre',
                'START_DATE': 'Date / Heure de début *',
                'END_DATE': 'Date / Heure de fin *',
                'NOTES': 'Notes',
                'ADD_NOTE': 'Ajouter une note',
                'SAVE': 'Enregistrer',
                'PLANNED_ENTRIES': 'Entrées planifiées',
                'NO_DATA': 'Aucune donnée trouvée',
                'LOADING': 'Chargement du profil...',
                'TODAY': 'Aujourd\'hui',
                'MONTH': 'Mois',
                'WEEK': 'Semaine',
                'DAY': 'Jour',
                'COL_DEPARTURE': 'Date de départ',
                'COL_VEHICLE': 'Véhicule',
                'COL_OBJECTIVE': 'Objectif',
                'COL_STATUS': 'Statut',
                'COL_DATE': 'Date'
            }
        }
    },
    'en': {
        'DRIVERS': {
            'TITLE': 'Driver Management',
            'DISPLAYED_COLUMNS': 'Displayed Columns',
            'SEARCH': 'Search...',
            'NOT_AVAILABLE': 'Not avail.',
            'EDIT_TITLE': 'Edit Driver',
            'COL_NAME': 'Name',
            'COL_EMAIL': 'Email / Phone',
            'COL_COUNTRY': 'Country',
            'COL_BASE': 'Base',
            'COL_ASSIGNED_VEHICLE': 'Assigned Vehicle',
            'COL_ACTIONS': 'Actions',
            'PROFILE': {
                'TITLE': 'Driver Profile',
                'BACK': 'Back to list',
                'STATUS': 'Status',
                'STATUS_AVAILABLE': 'Available',
                'STATUS_UNAVAILABLE': 'Unavailable',
                'NOT_PROVIDED': 'Not provided',
                'NOT_ASSIGNED': 'Not assigned',
                'TABS': {
                    'HISTORY': 'Trips History',
                    'FUTURE': 'Future Trips',
                    'ATTACHMENTS': 'Attachments',
                    'SCHEDULE': 'Schedule'
                },
                'HISTORY_TITLE': 'Trips History',
                'NO_HISTORY': 'No trips recorded for this driver.',
                'FUTURE_TITLE': 'Upcoming Planning',
                'NO_FUTURE': 'No upcoming trips for this driver.',
                'ATTACHMENTS_TITLE': 'Driver Documents',
                'DOC_NAME': 'Document name (e.g., Driver\'s license)',
                'DOC_URL': 'Sharepoint / Drive Link',
                'OR': 'OR',
                'UPLOAD': 'Upload',
                'ADDED_ON': 'Added on',
                'NO_ATTACHMENTS': 'No attachments yet.',
                'SCHEDULE_TITLE': 'Add Schedule',
                'SCHEDULE_STATUS': 'Status *',
                'SCHEDULE_ON_DUTY': 'On Duty',
                'SCHEDULE_OFF_DUTY': 'Off Duty',
                'SCHEDULE_SICK': 'Sick',
                'SCHEDULE_VACATION': 'Vacation',
                'SCHEDULE_OTHER': 'Other',
                'START_DATE': 'Start Date / Time *',
                'END_DATE': 'End Date / Time *',
                'NOTES': 'Notes',
                'ADD_NOTE': 'Add a note',
                'SAVE': 'Save',
                'PLANNED_ENTRIES': 'Planned entries',
                'NO_DATA': 'No data found',
                'LOADING': 'Loading profile...',
                'TODAY': 'Today',
                'MONTH': 'Month',
                'WEEK': 'Week',
                'DAY': 'Day',
                'COL_DEPARTURE': 'Departure Date',
                'COL_VEHICLE': 'Vehicle',
                'COL_OBJECTIVE': 'Objective',
                'COL_STATUS': 'Status',
                'COL_DATE': 'Date'
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

print("Dictionary drivers applied!")
