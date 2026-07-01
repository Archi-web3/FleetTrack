import os
import json
import re

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src'

translations = {
    'fr': {
        'SECURITY_MATRIX': {
            'INFO': {
                'TITLE': 'Matrice de Sécurité',
                'DESC': 'Définissez les règles de validation requises pour chaque niveau de sécurité (de 1 à 5). Seuls les utilisateurs ayant un niveau suffisant sont affichés pour chaque palier.',
                'LEVEL_5': 'Niveau 5 : Personne du siège (HQ)',
                'LEVEL_4': 'Niveau 4 : Coordination',
                'LEVEL_2_3': 'Niveau 2 et 3 : Base',
                'LOGIC_TITLE': 'Logique de validation :',
                'LOGIC_DESC': "Lors d'un mouvement, le système vérifie d'abord la matrice spécifique à la Base de départ. Si celle-ci n'a pas de validateur défini pour le niveau de risque requis, le système se rabat automatiquement sur la matrice globale (Bureau Pays)."
            },
            'BASE_CONFIG': 'Configuration par Base :',
            'BASE_FALLBACK': 'Bureau Pays (Matrice Globale & Fallback)',
            'BASE_PREFIX': 'Base :',
            'LOADING': 'Chargement...',
            'NO_VALIDATORS': 'Aucun utilisateur éligible pour ce niveau.',
            'CASCADE_VALIDATION': 'Validation en Cascade',
            'CASCADE_TOOLTIP': 'Si coché, les validateurs des niveaux inférieurs seront également requis',
            'INCLUDE_LOWER': 'Inclure niv. <',
            'SAVE_BTN': 'Enregistrer la Configuration',
            'USER_LEVEL': 'Niveau'
        }
    },
    'en': {
        'SECURITY_MATRIX': {
            'INFO': {
                'TITLE': 'Security Matrix',
                'DESC': 'Define the required validation rules for each security level (from 1 to 5). Only users with a sufficient level are displayed for each tier.',
                'LEVEL_5': 'Level 5: Headquarters (HQ)',
                'LEVEL_4': 'Level 4: Coordination',
                'LEVEL_2_3': 'Level 2 and 3: Base',
                'LOGIC_TITLE': 'Validation logic:',
                'LOGIC_DESC': "During a movement, the system first checks the specific matrix of the departure Base. If no validator is defined for the required risk level, the system automatically falls back to the global matrix (Country Office)."
            },
            'BASE_CONFIG': 'Base Configuration:',
            'BASE_FALLBACK': 'Country Office (Global Matrix & Fallback)',
            'BASE_PREFIX': 'Base:',
            'LOADING': 'Loading...',
            'NO_VALIDATORS': 'No eligible users for this level.',
            'CASCADE_VALIDATION': 'Cascade Validation',
            'CASCADE_TOOLTIP': 'If checked, validators from lower levels will also be required',
            'INCLUDE_LOWER': 'Include lvl. <',
            'SAVE_BTN': 'Save Configuration',
            'USER_LEVEL': 'Level'
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

print("Dictionary applied!")

# Update HTML
html_path = os.path.join(base_dir, 'app/features/security-matrix/security-matrix.component.html')

replacements = [
    (r'title="Matrice de Sécurité"', r'[title]="\'SECURITY_MATRIX.INFO.TITLE\' | translate"'),
    (r'Définissez les règles de validation requises pour chaque niveau de sécurité \(de 1 à 5\)\. Seuls les utilisateurs ayant un niveau suffisant sont affichés pour chaque palier\.', r"{{ 'SECURITY_MATRIX.INFO.DESC' | translate }}"),
    (r'<strong>Niveau 5</strong> : Personne du siège \(HQ\)', r"{{ 'SECURITY_MATRIX.INFO.LEVEL_5' | translate }}"),
    (r'<strong>Niveau 4</strong> : Coordination', r"{{ 'SECURITY_MATRIX.INFO.LEVEL_4' | translate }}"),
    (r'<strong>Niveau 2 et 3</strong> : Base', r"{{ 'SECURITY_MATRIX.INFO.LEVEL_2_3' | translate }}"),
    (r'<strong>Logique de validation :</strong> Lors d\'un mouvement, le système vérifie d\'abord la matrice spécifique à la Base de départ\. Si celle-ci n\'a pas de validateur défini pour le niveau de risque requis, le système se rabat automatiquement sur la matrice globale \(Bureau Pays\)\.', r"<strong>{{ 'SECURITY_MATRIX.INFO.LOGIC_TITLE' | translate }}</strong> {{ 'SECURITY_MATRIX.INFO.LOGIC_DESC' | translate }}"),
    (r'Configuration par Base :', r"{{ 'SECURITY_MATRIX.BASE_CONFIG' | translate }}"),
    (r'🌍 Bureau Pays \(Matrice Globale & Fallback\)', r"🌍 {{ 'SECURITY_MATRIX.BASE_FALLBACK' | translate }}"),
    (r'🏢 Base : \{\{ base\.nom \}\}', r"🏢 {{ 'SECURITY_MATRIX.BASE_PREFIX' | translate }} {{ base.nom }}"),
    (r'>\s*Chargement\.\.\.\s*<', r"> {{ 'SECURITY_MATRIX.LOADING' | translate }} <"),
    (r'Aucun utilisateur éligible pour ce niveau\.', r"{{ 'SECURITY_MATRIX.NO_VALIDATORS' | translate }}"),
    (r'\(Niveau \{\{ supervisor\.niveauValidationSecu \}\}\)', r"({{ 'SECURITY_MATRIX.USER_LEVEL' | translate }} {{ supervisor.niveauValidationSecu }})"),
    (r'matTooltip="Si coché, les validateurs des niveaux inférieurs seront également requis"', r'[matTooltip]="\'SECURITY_MATRIX.CASCADE_TOOLTIP\' | translate"'),
    (r'>\s*Validation en Cascade\s*<', r"> {{ 'SECURITY_MATRIX.CASCADE_VALIDATION' | translate }} <"),
    (r'Inclure niv\. &lt; \{\{rule\.level\}\}', r"{{ 'SECURITY_MATRIX.INCLUDE_LOWER' | translate }} {{rule.level}}"),
    (r'>Enregistrer la Configuration</button>', r">{{ 'SECURITY_MATRIX.SAVE_BTN' | translate }}</button>")
]

with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

for old, new in replacements:
    html_content = re.sub(old, new, html_content)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("HTML updated!")
