import os
import json

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src'

translations = {
    'fr': {
        'PLAN_MAINTENANCE': {
            'TITLE': 'Plan de Maintenance Prévisionnel',
            'LEGEND': 'Légende :',
            'CALCULATED_SERVICE': 'Service Calculé (IA/Moyenne)',
            'CONFIRMED_MAINTENANCE': 'Maintenance Planifiée Confirmée',
            'OVERCONSUMPTION_ALERT': 'Alerte Surconsommation',
            'COL_TYPE': 'Type',
            'COL_VEHICLE': 'Véhicule',
            'COL_EXPECTED_SERVICE': 'Service Prévu',
            'COL_EXPECTED_KM': 'Km Prévu',
            'COL_REMAINING_KM': 'Km Restants',
            'COL_ESTIMATED_DATE': 'Date Estimée',
            'COL_STATUS': 'Statut',
            'PLANNED_MAINTENANCE': 'Maintenance Planifiée',
            'OVERCONSUMPTION': 'Alerte Consommation',
            'PLANNED_REVISION': 'Révision Planifiée',
            'SERVICE': 'Service',
            'EXCEEDING': 'Dépassement',
            'BTN_PREV': 'Précédent',
            'BTN_TODAY': 'Aujourd\'hui',
            'BTN_NEXT': 'Suivant',
            'BTN_MONTH': 'Mois',
            'BTN_WEEK': 'Semaine',
            'STATUS_OVERDUE': 'En retard',
            'STATUS_DUE': 'Dû',
            'STATUS_UPCOMING': 'À venir'
        },
        'WEEKLY_CHECKLIST': {
            'HOW_IT_WORKS': 'Fonctionnement du Suivi Hebdomadaire',
            'DESCRIPTION': 'Cet onglet centralise les inspections hebdomadaires de sécurité réalisées par les chauffeurs depuis leur application mobile. Vous pouvez vérifier que chaque véhicule a été contrôlé en temps et en heure. Les anomalies (problèmes de freins, pneus, fuites...) remontées par les chauffeurs y sont directement visibles pour déclencher une action de maintenance.',
            'TITLE': 'Weekly Checklist Tracking',
            'COL_VEHICLE': 'VEHICLE',
            'COL_LAST_CHECK': 'LAST CHECK',
            'COL_STATUS': 'STATUS',
            'COL_HISTORY': 'HISTORY',
            'STATUS_OK': 'À Jour',
            'STATUS_LATE': 'En Retard',
            'STATUS_NEVER': 'Jamais Fait'
        },
        'PLANNED_INTERVENTIONS': {
            'HOW_IT_WORKS': 'How Planned Maintenance Works',
            'DESCRIPTION': 'Ici sont recensées toutes les interventions manuelles et demandes spécifiques d\'indisponibilité pour réparation ou vérification. Vous pouvez créer, modifier ou supprimer ces événements. Les statuts "Terminé" indiquent que l\'intervention est clôturée et que le véhicule est de nouveau disponible.',
            'TITLE': 'Maintenance History and Forecasts',
            'SEARCH': 'Rechercher une maintenance...',
            'COL_DATE': 'DATE',
            'COL_VEHICLE': 'VEHICLE',
            'COL_TYPE': 'TYPE',
            'COL_NOTES': 'NOTES',
            'COL_STATUS': 'STATUS',
            'COL_ACTIONS': 'ACTIONS'
        },
        'SMART_COST_TAB': {
            'HOW_IT_WORKS': 'How Smart Cost & Analytics Works',
            'DESCRIPTION': 'Cette section analyse financièrement votre flotte. Elle consolide les coûts de carburant, de réparation, d\'assurance et d\'acquisition pour calculer le coût global et unitaire par véhicule et par kilomètre. Les graphiques vous aident à identifier les véhicules les plus coûteux à l\'entretien.',
            'SUBTITLE': 'Analyse financière et prédictive de votre flotte (Derniers 30 Jours)',
            'TOTAL_COST': 'Total Cost',
            'LAST_30_DAYS': '30 derniers jours',
            'FORECAST_AI': 'Forecast (AI)',
            'MONTHLY_PROJECTION': 'Projection mensuelle',
            'BASED_ON': 'Basé sur vos futurs services planifiés (Km) et coûts historiques (Services A/B/C).',
            'RELIABILITY': 'Reliability by Model',
            'BREAKDOWNS': 'pannes'
        }
    },
    'en': {
        'PLAN_MAINTENANCE': {
            'TITLE': 'Predictive Maintenance Plan',
            'LEGEND': 'Legend :',
            'CALCULATED_SERVICE': 'Calculated Service (AI/Avg)',
            'CONFIRMED_MAINTENANCE': 'Confirmed Planned Maintenance',
            'OVERCONSUMPTION_ALERT': 'Overconsumption Alert',
            'COL_TYPE': 'Type',
            'COL_VEHICLE': 'Vehicle',
            'COL_EXPECTED_SERVICE': 'Expected Service',
            'COL_EXPECTED_KM': 'Expected Km',
            'COL_REMAINING_KM': 'Remaining Km',
            'COL_ESTIMATED_DATE': 'Estimated Date',
            'COL_STATUS': 'Status',
            'PLANNED_MAINTENANCE': 'Planned Maintenance',
            'OVERCONSUMPTION': 'Consumption Alert',
            'PLANNED_REVISION': 'Planned Revision',
            'SERVICE': 'Service',
            'EXCEEDING': 'Exceeding',
            'BTN_PREV': 'Previous',
            'BTN_TODAY': 'Today',
            'BTN_NEXT': 'Next',
            'BTN_MONTH': 'Month',
            'BTN_WEEK': 'Week',
            'STATUS_OVERDUE': 'Overdue',
            'STATUS_DUE': 'Due',
            'STATUS_UPCOMING': 'Upcoming'
        },
        'WEEKLY_CHECKLIST': {
            'HOW_IT_WORKS': 'How Weekly Tracking Works',
            'DESCRIPTION': 'This tab centralizes the weekly safety inspections carried out by drivers from their mobile app. You can verify that each vehicle has been checked on time. Anomalies (brake problems, tires, leaks...) reported by drivers are directly visible to trigger a maintenance action.',
            'TITLE': 'Weekly Checklist Tracking',
            'COL_VEHICLE': 'VEHICLE',
            'COL_LAST_CHECK': 'LAST CHECK',
            'COL_STATUS': 'STATUS',
            'COL_HISTORY': 'HISTORY',
            'STATUS_OK': 'Up to Date',
            'STATUS_LATE': 'Overdue',
            'STATUS_NEVER': 'Never Done'
        },
        'PLANNED_INTERVENTIONS': {
            'HOW_IT_WORKS': 'How Planned Maintenance Works',
            'DESCRIPTION': 'This section lists all manual interventions and specific requests for unavailability for repair or verification. You can create, edit or delete these events. "Completed" statuses indicate that the intervention is closed and the vehicle is available again.',
            'TITLE': 'Maintenance History and Forecasts',
            'SEARCH': 'Search for maintenance...',
            'COL_DATE': 'DATE',
            'COL_VEHICLE': 'VEHICLE',
            'COL_TYPE': 'TYPE',
            'COL_NOTES': 'NOTES',
            'COL_STATUS': 'STATUS',
            'COL_ACTIONS': 'ACTIONS'
        },
        'SMART_COST_TAB': {
            'HOW_IT_WORKS': 'How Smart Cost & Analytics Works',
            'DESCRIPTION': 'This section analyzes your fleet financially. It consolidates fuel, repair, insurance and acquisition costs to calculate the overall and unit cost per vehicle and per kilometer. Graphs help you identify the most expensive vehicles to maintain.',
            'SUBTITLE': 'Financial and predictive analysis of your fleet (Last 30 Days)',
            'TOTAL_COST': 'Total Cost',
            'LAST_30_DAYS': 'Last 30 days',
            'FORECAST_AI': 'Forecast (AI)',
            'MONTHLY_PROJECTION': 'Monthly projection',
            'BASED_ON': 'Based on your future planned services (Km) and historical costs (Services A/B/C).',
            'RELIABILITY': 'Reliability by Model',
            'BREAKDOWNS': 'breakdowns'
        }
    }
}

replacements = [
    {
        'file': 'app/features/gestion-maintenance/plan-maintenance/plan-maintenance.component.html',
        'replaces': [
            ('> Plan de Maintenance Prévisionnel<', '> {{ \'PLAN_MAINTENANCE.TITLE\' | translate }}<'),
            ('<strong>Légende :</strong>', '<strong>{{ \'PLAN_MAINTENANCE.LEGEND\' | translate }}</strong>'),
            ('> Service Calculé (IA/Moyenne)<', '> {{ \'PLAN_MAINTENANCE.CALCULATED_SERVICE\' | translate }}<'),
            ('> Maintenance Planifiée Confirmée<', '> {{ \'PLAN_MAINTENANCE.CONFIRMED_MAINTENANCE\' | translate }}<'),
            ('> Alerte Surconsommation<', '> {{ \'PLAN_MAINTENANCE.OVERCONSUMPTION_ALERT\' | translate }}<'),
            ('mat-header-cell *matHeaderCellDef> Type <', 'mat-header-cell *matHeaderCellDef> {{ \'PLAN_MAINTENANCE.COL_TYPE\' | translate }} <'),
            ('mat-header-cell *matHeaderCellDef> Véhicule <', 'mat-header-cell *matHeaderCellDef> {{ \'PLAN_MAINTENANCE.COL_VEHICLE\' | translate }} <'),
            ('mat-header-cell *matHeaderCellDef> Service Prévu <', 'mat-header-cell *matHeaderCellDef> {{ \'PLAN_MAINTENANCE.COL_EXPECTED_SERVICE\' | translate }} <'),
            ('mat-header-cell *matHeaderCellDef> Km Prévu <', 'mat-header-cell *matHeaderCellDef> {{ \'PLAN_MAINTENANCE.COL_EXPECTED_KM\' | translate }} <'),
            ('mat-header-cell *matHeaderCellDef> Km Restants <', 'mat-header-cell *matHeaderCellDef> {{ \'PLAN_MAINTENANCE.COL_REMAINING_KM\' | translate }} <'),
            ('mat-header-cell *matHeaderCellDef> Date Estimée <', 'mat-header-cell *matHeaderCellDef> {{ \'PLAN_MAINTENANCE.COL_ESTIMATED_DATE\' | translate }} <'),
            ('mat-header-cell *matHeaderCellDef> Statut <', 'mat-header-cell *matHeaderCellDef> {{ \'PLAN_MAINTENANCE.COL_STATUS\' | translate }} <'),
            ('\'Maintenance Planifiée\'', '\'PLAN_MAINTENANCE.PLANNED_MAINTENANCE\' | translate'),
            ('\'Alerte Consommation\'', '\'PLAN_MAINTENANCE.OVERCONSUMPTION\' | translate'),
            ('\'Révision Planifiée\'', '\'PLAN_MAINTENANCE.PLANNED_REVISION\' | translate'),
            ('>Maintenance Planifiée<', '>{{ \'PLAN_MAINTENANCE.PLANNED_MAINTENANCE\' | translate }}<'),
            ('>Service {{element.typeService}}<', '>{{ \'PLAN_MAINTENANCE.SERVICE\' | translate }} {{element.typeService}}<'),
            ('\'Dépassement \'', '\'PLAN_MAINTENANCE.EXCEEDING\' | translate | appendSpace'), # Will handle this with a custom pipe or inline logic
            ('>\\n            Précédent\\n          <', '>\\n            {{ \'PLAN_MAINTENANCE.BTN_PREV\' | translate }}\\n          <'),
            ('>\\n            Aujourd\'hui\\n          <', '>\\n            {{ \'PLAN_MAINTENANCE.BTN_TODAY\' | translate }}\\n          <'),
            ('>\\n            Suivant\\n          <', '>\\n            {{ \'PLAN_MAINTENANCE.BTN_NEXT\' | translate }}\\n          <'),
            ('>Mois<', '>{{ \'PLAN_MAINTENANCE.BTN_MONTH\' | translate }}<'),
            ('>Semaine<', '>{{ \'PLAN_MAINTENANCE.BTN_WEEK\' | translate }}<')
        ]
    },
    {
        'file': 'app/features/gestion-maintenance/weekly-checklist-tracker/weekly-checklist-tracker.html',
        'replaces': [
            ('>Fonctionnement du Suivi Hebdomadaire<', '>{{ \'WEEKLY_CHECKLIST.HOW_IT_WORKS\' | translate }}<'),
            ('Cet onglet centralise les inspections hebdomadaires de sécurité réalisées par les chauffeurs depuis leur application mobile. Vous pouvez vérifier que chaque véhicule a été contrôlé en temps et en heure. Les anomalies (problèmes de freins, pneus, fuites...) remontées par les chauffeurs y sont directement visibles pour déclencher une action de maintenance.', '{{ \'WEEKLY_CHECKLIST.DESCRIPTION\' | translate }}'),
            ('>Weekly Checklist Tracking<', '>{{ \'WEEKLY_CHECKLIST.TITLE\' | translate }}<'),
            ('mat-header-cell *matHeaderCellDef> VEHICLE <', 'mat-header-cell *matHeaderCellDef> {{ \'WEEKLY_CHECKLIST.COL_VEHICLE\' | translate }} <'),
            ('mat-header-cell *matHeaderCellDef> LAST CHECK <', 'mat-header-cell *matHeaderCellDef> {{ \'WEEKLY_CHECKLIST.COL_LAST_CHECK\' | translate }} <'),
            ('mat-header-cell *matHeaderCellDef> STATUS <', 'mat-header-cell *matHeaderCellDef> {{ \'WEEKLY_CHECKLIST.COL_STATUS\' | translate }} <'),
            ('mat-header-cell *matHeaderCellDef> HISTORY <', 'mat-header-cell *matHeaderCellDef> {{ \'WEEKLY_CHECKLIST.COL_HISTORY\' | translate }} <')
        ]
    },
    {
        'file': 'app/features/maintenance-tracking/maintenance-tracking.component.html',
        'replaces': [
            ('Ici sont recensées toutes les interventions manuelles et demandes spécifiques d\'indisponibilité pour réparation ou vérification. Vous pouvez créer, modifier ou supprimer ces événements. Les statuts "Terminé" indiquent que l\'intervention est clôturée et que le véhicule est de nouveau disponible.', '{{ \'PLANNED_INTERVENTIONS.DESCRIPTION\' | translate }}'),
            ('>Maintenance History and Forecasts<', '>{{ \'PLANNED_INTERVENTIONS.TITLE\' | translate }}<'),
            ('placeholder="Rechercher une maintenance..."', '[placeholder]="\'PLANNED_INTERVENTIONS.SEARCH\' | translate"'),
            ('mat-header-cell *matHeaderCellDef mat-sort-header> DATE <', 'mat-header-cell *matHeaderCellDef mat-sort-header> {{ \'PLANNED_INTERVENTIONS.COL_DATE\' | translate }} <'),
            ('mat-header-cell *matHeaderCellDef mat-sort-header> VEHICLE <', 'mat-header-cell *matHeaderCellDef mat-sort-header> {{ \'PLANNED_INTERVENTIONS.COL_VEHICLE\' | translate }} <'),
            ('mat-header-cell *matHeaderCellDef mat-sort-header> TYPE <', 'mat-header-cell *matHeaderCellDef mat-sort-header> {{ \'PLANNED_INTERVENTIONS.COL_TYPE\' | translate }} <'),
            ('mat-header-cell *matHeaderCellDef mat-sort-header> NOTES <', 'mat-header-cell *matHeaderCellDef mat-sort-header> {{ \'PLANNED_INTERVENTIONS.COL_NOTES\' | translate }} <'),
            ('mat-header-cell *matHeaderCellDef mat-sort-header> STATUS <', 'mat-header-cell *matHeaderCellDef mat-sort-header> {{ \'PLANNED_INTERVENTIONS.COL_STATUS\' | translate }} <'),
            ('mat-header-cell *matHeaderCellDef> ACTIONS <', 'mat-header-cell *matHeaderCellDef> {{ \'PLANNED_INTERVENTIONS.COL_ACTIONS\' | translate }} <')
        ]
    },
    {
        'file': 'app/features/maintenance-tracking/smart-cost-dashboard/smart-cost-dashboard.component.html',
        'replaces': [
            ('Cette section analyse financièrement votre flotte. Elle consolide les coûts de carburant, de réparation, d\'assurance et d\'acquisition pour calculer le coût global et unitaire par véhicule et par kilomètre. Les graphiques vous aident à identifier les véhicules les plus coûteux à l\'entretien.', '{{ \'SMART_COST_TAB.DESCRIPTION\' | translate }}'),
            ('>Analyse financière et prédictive de votre flotte (Derniers 30 Jours)<', '>{{ \'SMART_COST_TAB.SUBTITLE\' | translate }}<'),
            ('>30 derniers jours<', '>{{ \'SMART_COST_TAB.LAST_30_DAYS\' | translate }}<'),
            ('>Projection mensuelle<', '>{{ \'SMART_COST_TAB.MONTHLY_PROJECTION\' | translate }}<'),
            ('Basé sur vos futurs services planifiés (Km) et coûts historiques (Services A/B/C).', '{{ \'SMART_COST_TAB.BASED_ON\' | translate }}'),
            ('> pannes<', '> {{ \'SMART_COST_TAB.BREAKDOWNS\' | translate }}<')
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
        # Special logic for the exceeding string which has a trailing space inside the angular expression
        if old == "'Dépassement '":
            content = content.replace(old, "('PLAN_MAINTENANCE.EXCEEDING' | translate) + ' '")
            continue
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

print("Maintenance translations applied!")
