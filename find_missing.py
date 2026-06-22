import json

def get_keys(d, prefix=''):
    keys = set()
    for k, v in d.items():
        new_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            keys.update(get_keys(v, new_key))
        else:
            keys.add(new_key)
    return keys

with open('Angular/gestion-des-deplacements/src/assets/i18n/fr.json', 'r', encoding='utf-8') as f:
    fr = json.load(f)

with open('Angular/gestion-des-deplacements/src/assets/i18n/en.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

fr_keys = get_keys(fr)
en_keys = get_keys(en)

missing_in_en = sorted(list(fr_keys - en_keys))
missing_in_fr = sorted(list(en_keys - fr_keys))

print(f"Missing in EN ({len(missing_in_en)}):")
for k in missing_in_en:
    print(k)

print(f"\nMissing in FR ({len(missing_in_fr)}):")
for k in missing_in_fr:
    print(k)
