import os

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src'

replacements = [
    {
        'file': 'app/features/liste-mouvements/liste-mouvements.component.html',
        'replaces': [
            ('placeholder="Tapez pour filtrer..."', '[placeholder]="\'FILTERS.TYPE_TO_FILTER\' | translate"'),
            ('Rechercher objectif, chauffeur, lieu...', '{{ \'FILTERS.SEARCH_HINT\' | translate }}'),
            ('>Tous les véhicules<', '>{{ \'FILTERS.ALL_VEHICLES\' | translate }}<')
        ]
    },
    {
        'file': 'app/features/maintenance-tracking/smart-cost-dashboard/smart-cost-dashboard.component.html',
        'replaces': [
            ('>Smart Cost & Analytics<', '>{{ \'SMART_COST.TITLE\' | translate }}<'),
            ('>Coût Total<', '>{{ \'SMART_COST.TOTAL_COST\' | translate }}<'),
            ('>Prévision (IA)<', '>{{ \'SMART_COST.FORECAST_AI\' | translate }}<'),
            ('>Fiabilité par Modèle<', '>{{ \'SMART_COST.RELIABILITY\' | translate }}<')
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

print("Remaining translations applied!")
