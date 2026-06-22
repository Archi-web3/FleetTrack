import os

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src'
filepath = os.path.join(base_dir, 'app/features/general-settings/general-settings.html')

replaces = [
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

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

for old, new in replaces:
    content = content.replace(old, new)
    
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("General settings translation applied.")
