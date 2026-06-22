import os
import json

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src'

translations = {
    'fr': {
        'PAGINATOR': {
            'ITEMS_PER_PAGE': 'Éléments par page :',
            'NEXT_PAGE': 'Page suivante',
            'PREVIOUS_PAGE': 'Page précédente',
            'FIRST_PAGE': 'Première page',
            'LAST_PAGE': 'Dernière page',
            'OF': 'sur'
        }
    },
    'en': {
        'PAGINATOR': {
            'ITEMS_PER_PAGE': 'Items per page:',
            'NEXT_PAGE': 'Next page',
            'PREVIOUS_PAGE': 'Previous page',
            'FIRST_PAGE': 'First page',
            'LAST_PAGE': 'Last page',
            'OF': 'of'
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

print("Paginator translations applied!")
