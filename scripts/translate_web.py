import os
import re
import json

def set_nested(d, key_path, value):
    keys = key_path.split('.')
    current = d
    for i, k in enumerate(keys[:-1]):
        if k not in current:
            current[k] = {}
        current = current[k]
    current[keys[-1]] = value

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src'

# We'll maintain a dictionary of English and French translations.
translations = {
    'fr': {},
    'en': {}
}

def add_translation(key, fr_val, en_val):
    set_nested(translations['fr'], key, fr_val)
    set_nested(translations['en'], key, en_val)

add_translation('PROFILE.USER_PROFILE', 'Profil Utilisateur', 'User Profile')
add_translation('PROFILE.PERSONAL_INFO', 'Informations Personnelles', 'Personal Information')
add_translation('PROFILE.PASSWORD', 'Mot de passe', 'Password')
add_translation('PROFILE.CHANGE_PASSWORD', 'Changer le mot de passe', 'Change Password')
add_translation('PROFILE.CHANGE_PASSWORD_DESC', 'Sécurisez votre compte en changeant de mot de passe', 'Secure your account by changing your password')
add_translation('PROFILE.OLD_PASSWORD', 'Ancien mot de passe', 'Old Password')
add_translation('PROFILE.NEW_PASSWORD', 'Nouveau mot de passe', 'New Password')
add_translation('PROFILE.CONFIRM_PASSWORD', 'Confirmer le mot de passe', 'Confirm Password')
add_translation('PROFILE.DETAILS_DESC', 'Détails de votre profil utilisateur', 'Details of your user profile')
add_translation('PROFILE.CHANGE_PHOTO', 'Changer la photo', 'Change Photo')
add_translation('PROFILE.MAX_SIZE', 'Taille max: 2MB.', 'Max size: 2MB.')
add_translation('PROFILE.FULL_NAME', 'Nom Complet', 'Full Name')

add_translation('SETTINGS.SETTINGS', 'Paramètres', 'Settings')
add_translation('SETTINGS.BRAND_THEME', 'Brand & Theme Settings', 'Brand & Theme Settings')
add_translation('SETTINGS.PERSONALIZE', "Personnalisez l'identité visuelle de l'application", "Personalize the visual identity of the application")
add_translation('SETTINGS.PRIMARY_COLOR', 'Couleur Principale', 'Primary Color')
add_translation('SETTINGS.CUSTOM_COLOR', 'Couleur personnalisée :', 'Custom color:')
add_translation('SETTINGS.TEXT_INFO', 'Textes et Informations', 'Texts and Information')
add_translation('SETTINGS.DISPLAY_MODE', 'Mode d\'affichage (Page d\'accueil)', 'Display Mode (Home Page)')
add_translation('SETTINGS.APP_TITLE', 'Titre de l\'application', 'Application Title')
add_translation('SETTINGS.APP_TAGLINE', 'Tagline / Sous-titre', 'Tagline / Subtitle')
add_translation('SETTINGS.NEWS_BANNER', 'Bandeau d\'actualités', 'News Banner')
add_translation('SETTINGS.FOOTER_TEXT', 'Texte du pied de page', 'Footer Text')

add_translation('COUNTRIES.MANAGE', 'Gestion des Pays', 'Manage Countries')
add_translation('COUNTRIES.NEW', 'NOUVEAU PAYS', 'NEW COUNTRY')
add_translation('COUNTRIES.COLUMNS', 'Colonnes affichées', 'Displayed Columns')
add_translation('COUNTRIES.NAME', 'Nom', 'Name')
add_translation('COUNTRIES.CODE', 'Code', 'Code')

add_translation('CONSOLIDATION.FROM', 'De:', 'From:')
add_translation('CONSOLIDATION.TO', 'À:', 'To:')
add_translation('CONSOLIDATION.TIME', 'Horaires:', 'Time:')
add_translation('CONSOLIDATION.MILEAGE', 'Kilométrage:', 'Mileage:')


replacements = [
    {
        'file': 'app/features/profile/profile/profile.html',
        'replaces': [
            ('>Profil Utilisateur<', '>{{ \'PROFILE.USER_PROFILE\' | translate }}<'),
            ('>Informations Personnelles<', '>{{ \'PROFILE.PERSONAL_INFO\' | translate }}<'),
            ('>Mot de passe<', '>{{ \'PROFILE.PASSWORD\' | translate }}<'),
        ]
    },
    {
        'file': 'app/features/profile/personal-info/personal-info.html',
        'replaces': [
            ('>Informations Personnelles<', '>{{ \'PROFILE.PERSONAL_INFO\' | translate }}<'),
            ('>Détails de votre profil utilisateur<', '>{{ \'PROFILE.DETAILS_DESC\' | translate }}<'),
            ('>Changer la photo<', '>{{ \'PROFILE.CHANGE_PHOTO\' | translate }}<'),
            ('>Taille max: 2MB.<', '>{{ \'PROFILE.MAX_SIZE\' | translate }}<'),
            ('>Nom Complet<', '>{{ \'PROFILE.FULL_NAME\' | translate }}<'),
        ]
    },
    {
        'file': 'app/features/profile/change-password/change-password.html',
        'replaces': [
            ('>Changer le mot de passe<', '>{{ \'PROFILE.CHANGE_PASSWORD\' | translate }}<'),
            ('>Sécurisez votre compte en changeant de mot de passe<', '>{{ \'PROFILE.CHANGE_PASSWORD_DESC\' | translate }}<'),
            ('placeholder="Ancien mot de passe"', '[placeholder]="\'PROFILE.OLD_PASSWORD\' | translate"'),
            ('placeholder="Nouveau mot de passe"', '[placeholder]="\'PROFILE.NEW_PASSWORD\' | translate"'),
            ('placeholder="Confirmer le mot de passe"', '[placeholder]="\'PROFILE.CONFIRM_PASSWORD\' | translate"'),
        ]
    },
    {
        'file': 'app/features/gestion-pays/gestion-pays.component.html',
        'replaces': [
            ('>Gestion des Pays<', '>{{ \'COUNTRIES.MANAGE\' | translate }}<'),
            ('>NOUVEAU PAYS<', '>{{ \'COUNTRIES.NEW\' | translate }}<'),
            ('>Colonnes affichées<', '>{{ \'COUNTRIES.COLUMNS\' | translate }}<'),
            ('mat-sort-header>Nom<', 'mat-sort-header>{{ \'COUNTRIES.NAME\' | translate }}<'),
            ('mat-sort-header>Code<', 'mat-sort-header>{{ \'COUNTRIES.CODE\' | translate }}<'),
        ]
    },
    {
        'file': 'app/features/consolidation-mouvements/consolidation-mouvements.component.html',
        'replaces': [
            ('>De:<', '>{{ \'CONSOLIDATION.FROM\' | translate }}<'),
            ('>À:<', '>{{ \'CONSOLIDATION.TO\' | translate }}<'),
            ('>⏱️ Horaires:<', '>⏱️ {{ \'CONSOLIDATION.TIME\' | translate }}<'),
            ('>🚗 Kilométrage:<', '>🚗 {{ \'CONSOLIDATION.MILEAGE\' | translate }}<'),
        ]
    },
    {
        'file': 'app/features/admin/settings/general-settings/general-settings.html',
        'replaces': [
            ('>Paramètres<', '>{{ \'SETTINGS.SETTINGS\' | translate }}<'),
            ('>Brand & Theme Settings<', '>{{ \'SETTINGS.BRAND_THEME\' | translate }}<'),
            (">Personnalisez l'identité visuelle de l'application FleetTrack.<", ">{{ 'SETTINGS.PERSONALIZE' | translate }}<"),
            ('>Couleur Principale (Theme Customizer)<', '>{{ \'SETTINGS.PRIMARY_COLOR\' | translate }}<'),
            ('>Couleur personnalisée :<', '>{{ \'SETTINGS.CUSTOM_COLOR\' | translate }}<'),
            ('>Textes et Informations<', '>{{ \'SETTINGS.TEXT_INFO\' | translate }}<'),
            ('>Mode d\'affichage (Page d\'accueil)<', '>{{ \'SETTINGS.DISPLAY_MODE\' | translate }}<'),
            ('>Titre de l\'application (Web)<', '>{{ \'SETTINGS.APP_TITLE\' | translate }} (Web)<'),
            ('>Titre de l\'application (Mobile)<', '>{{ \'SETTINGS.APP_TITLE\' | translate }} (Mobile)<'),
            ('>Tagline / Sous-titre (Web)<', '>{{ \'SETTINGS.APP_TAGLINE\' | translate }} (Web)<'),
            ('>Tagline / Sous-titre (Mobile)<', '>{{ \'SETTINGS.APP_TAGLINE\' | translate }} (Mobile)<'),
            ('>Bandeau d\'actualités (Accueil)<', '>{{ \'SETTINGS.NEWS_BANNER\' | translate }}<'),
            ('>Texte du pied de page (Footer)<', '>{{ \'SETTINGS.FOOTER_TEXT\' | translate }}<'),
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
        
# Inject TranslateModule into TS files
ts_files = [
    'app/features/profile/profile/profile.ts',
    'app/features/profile/personal-info/personal-info.ts',
    'app/features/profile/change-password/change-password.ts'
]

for ts_file in ts_files:
    filepath = os.path.join(base_dir, ts_file)
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'TranslateModule' not in content:
        content = content.replace("from '@angular/core';", "from '@angular/core';\nimport { TranslateModule } from '@ngx-translate/core';")
        content = content.replace("imports: [", "imports: [\n    TranslateModule,")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

# Update i18n JSON files
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

print("Web translation applied.")
