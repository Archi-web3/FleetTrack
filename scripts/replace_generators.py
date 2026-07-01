import os
import re

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src/app/features/gestion-generateurs'

def add_translate_module(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'TranslateModule' not in content:
        # Import TranslateModule
        content = re.sub(
            r"(import\s+{[^}]*}\s+from\s+'@angular/common';)",
            r"\1\nimport { TranslateModule } from '@ngx-translate/core';",
            content
        )
        
        # Add to imports array
        content = re.sub(
            r"imports:\s*\[([\s\S]*?)\]",
            lambda m: f"imports: [{m.group(1).rstrip()},\n    TranslateModule\n  ]",
            content
        )
        
        # In case the regex didn't find comma correctly
        content = content.replace(",\n    TranslateModule", ",\n    TranslateModule").replace("Module\n    TranslateModule", "Module,\n    TranslateModule")

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Added TranslateModule to {file_path}")

components = [
    'generateur-detail/generateur-detail.ts',
    'generateur-form/generateur-form.ts',
    'generateur-guide/generateur-guide.ts',
    'intervention-form/intervention-form.ts'
]

for comp in components:
    add_translate_module(os.path.join(base_dir, comp))

# HTML replacements dictionary
html_replacements = {
    'generateur-detail/generateur-detail.html': [
        (r'Détails du Générateur : \{\{generateur.marque\}\} \{\{generateur.modele\}\} \(\{\{generateur.numeroSerie\}\}\)', 
         r"{{ 'GENERATORS.DETAIL.TITLE' | translate }} {{generateur.marque}} {{generateur.modele}} ({{generateur.numeroSerie}})"),
        (r'<mat-icon>edit</mat-icon> Modifier', r"<mat-icon>edit</mat-icon> {{ 'GENERATORS.DETAIL.EDIT_BTN' | translate }}"),
        (r'<mat-icon>build</mat-icon> Nouvelle Intervention', r"<mat-icon>build</mat-icon> {{ 'GENERATORS.DETAIL.INTERVENTION_BTN' | translate }}"),
        (r'title="Détails et Historique du Générateur"', r'[title]="\'GENERATORS.DETAIL.BANNER_TITLE\' | translate"'),
        (r'<div class="stat-title">Heures de fonctionnement</div>', r'<div class="stat-title">{{ \'GENERATORS.DETAIL.HOURS\' | translate }}</div>'),
        (r'<div class="stat-title">Consommation Théorique Moyenne</div>', r'<div class="stat-title">{{ \'GENERATORS.DETAIL.AVG_CONSUMPTION\' | translate }}</div>'),
        (r'<div class="stat-title">Statut</div>', r'<div class="stat-title">{{ \'GENERATORS.DETAIL.STATUS\' | translate }}</div>'),
        (r'label="Logbook Horaire &amp; Carburant"', r'[label]="\'GENERATORS.DETAIL.TAB_LOGBOOK\' | translate"'),
        (r'label="Historique des Interventions"', r'[label]="\'GENERATORS.DETAIL.TAB_INTERVENTIONS\' | translate"'),
        (r'<mat-card-title>Nouveau relevé Logbook</mat-card-title>', r'<mat-card-title>{{ \'GENERATORS.DETAIL.LOGBOOK_NEW_TITLE\' | translate }}</mat-card-title>'),
        (r'<mat-label>Date Relevé</mat-label>', r'<mat-label>{{ \'GENERATORS.DETAIL.LOGBOOK_DATE\' | translate }}</mat-label>'),
        (r'<mat-label>Heure Début</mat-label>', r'<mat-label>{{ \'GENERATORS.DETAIL.LOGBOOK_START\' | translate }}</mat-label>'),
        (r'<mat-label>Heure Fin</mat-label>', r'<mat-label>{{ \'GENERATORS.DETAIL.LOGBOOK_END\' | translate }}</mat-label>'),
        (r'<mat-label>Carburant Ajouté \(L\)</mat-label>', r'<mat-label>{{ \'GENERATORS.DETAIL.LOGBOOK_FUEL\' | translate }}</mat-label>'),
        (r'<mat-icon>save</mat-icon> Enregistrer', r'<mat-icon>save</mat-icon> {{ \'GENERATORS.DETAIL.LOGBOOK_SAVE\' | translate }}'),
        (r'<th mat-header-cell \*matHeaderCellDef> Date </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.DETAIL.COL_DATE\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Hr Début </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.DETAIL.COL_START\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Hr Fin </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.DETAIL.COL_END\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Durée \(h\) </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.DETAIL.COL_DURATION\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Ajout \(L\) </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.DETAIL.COL_ADDED\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Conso \(L/h\) </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.DETAIL.COL_CONSUMPTION\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Par </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.DETAIL.COL_BY\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Type </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.DETAIL.COL_TYPE\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Fréquence </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.DETAIL.COL_FREQUENCY\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Heures </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.DETAIL.COL_HOURS\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Intervenant </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.DETAIL.COL_TECHNICIAN\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Statut </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.DETAIL.COL_STATUS\' | translate }} </th>'),
        (r'<p>Chargement des données du générateur...</p>', r'<p>{{ \'GENERATORS.DETAIL.LOADING\' | translate }}</p>')
    ],
    'generateur-form/generateur-form.html': [
        (r"\{\{ generateurId \? 'Modifier le générateur' : 'Ajouter un générateur' \}\}", r"{{ generateurId ? ('GENERATORS.FORM.TITLE_EDIT' | translate) : ('GENERATORS.FORM.TITLE_ADD' | translate) }}"),
        (r'title="Formulaire d\'enregistrement du Moteur"', r'[title]="\'GENERATORS.FORM.BANNER_TITLE\' | translate"'),
        (r'<div class="section-title">Identification du Moteur / Générateur</div>', r'<div class="section-title">{{ \'GENERATORS.FORM.SECTION_IDENTIFICATION\' | translate }}</div>'),
        (r'<mat-label>Code Interne</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.CODE\' | translate }}</mat-label>'),
        (r'<mat-label>Marque</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.BRAND\' | translate }}</mat-label>'),
        (r'<mat-label>Modèle</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.MODEL\' | translate }}</mat-label>'),
        (r'<mat-label>Propriétaire</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.OWNER\' | translate }}</mat-label>'),
        (r'placeholder="Ex: Interne, Location, etc."', r'[placeholder]="\'GENERATORS.FORM.OWNER_PH\' | translate"'),
        (r'<mat-label>Catégorie Moteur</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.CATEGORY\' | translate }}</mat-label>'),
        (r'<mat-label>Numéro de Série \(Générateur\)</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.SERIAL_GEN\' | translate }}</mat-label>'),
        (r'<mat-label>Numéro de Moteur</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.SERIAL_ENGINE\' | translate }}</mat-label>'),
        (r'<div class="section-title">Spécifications techniques</div>', r'<div class="section-title">{{ \'GENERATORS.FORM.SECTION_SPECS\' | translate }}</div>'),
        (r'<mat-label>Puissance \(KVA\)</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.KVA\' | translate }}</mat-label>'),
        (r'<mat-label>Type de Carburant</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.FUEL_TYPE\' | translate }}</mat-label>'),
        (r'<div class="section-title">Localisation et Statut</div>', r'<div class="section-title">{{ \'GENERATORS.FORM.SECTION_LOCATION\' | translate }}</div>'),
        (r'<mat-label>Base / Site</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.BASE\' | translate }}</mat-label>'),
        (r'<mat-label>Pays</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.COUNTRY\' | translate }}</mat-label>'),
        (r'<mat-label>Site spécifique d\'installation</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.SPECIFIC_SITE\' | translate }}</mat-label>'),
        (r'placeholder="Ex: Compound 2, Hopital"', r'[placeholder]="\'GENERATORS.FORM.SPECIFIC_SITE_PH\' | translate"'),
        (r'<mat-label>Statut</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.STATUS\' | translate }}</mat-label>'),
        (r'<div class="section-title">Historique, Coûts et Heures</div>', r'<div class="section-title">{{ \'GENERATORS.FORM.SECTION_HISTORY\' | translate }}</div>'),
        (r'<mat-label>Année de Fabrication</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.YEAR_MFG\' | translate }}</mat-label>'),
        (r'<mat-label>Année de 1ère Utilisation</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.YEAR_USAGE\' | translate }}</mat-label>'),
        (r'<mat-label>Coût d\'assurance annuel</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.INSURANCE_COST\' | translate }}</mat-label>'),
        (r'<mat-label>Date de commencement \(au 1er Janvier\)</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.START_DATE\' | translate }}</mat-label>'),
        (r'<mat-label>Nombre d\'heures initiales</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.INITIAL_HOURS\' | translate }}</mat-label>'),
        (r'<mat-label>Heures totales actuelles</mat-label>', r'<mat-label>{{ \'GENERATORS.FORM.CURRENT_HOURS\' | translate }}</mat-label>'),
        (r'<div class="section-title">Remarques &amp; Notes</div>', r'<div class="section-title">{{ \'GENERATORS.FORM.SECTION_NOTES\' | translate }}</div>'),
        (r'>Annuler</button>', r">{{ 'GENERATORS.FORM.CANCEL' | translate }}</button>"),
        (r'<mat-icon>save</mat-icon> Enregistrer', r"<mat-icon>save</mat-icon> {{ 'GENERATORS.FORM.SAVE' | translate }}")
    ],
    'intervention-form/intervention-form.html': [
        (r"<h2>Fiche d'intervention / Maintenance \(\{\{generateur.marque\}\} \{\{generateur.modele\}\}\)</h2>", r"<h2>{{ 'GENERATORS.INTERVENTION.TITLE' | translate }} ({{generateur.marque}} {{generateur.modele}})</h2>"),
        (r'<div class="section-title">Données Générales</div>', r'<div class="section-title">{{ \'GENERATORS.INTERVENTION.SECTION_GENERAL\' | translate }}</div>'),
        (r'<mat-label>Nom de l\'intervenant</mat-label>', r'<mat-label>{{ \'GENERATORS.INTERVENTION.TECHNICIAN\' | translate }}</mat-label>'),
        (r'<mat-label>Date d\'intervention</mat-label>', r'<mat-label>{{ \'GENERATORS.INTERVENTION.DATE\' | translate }}</mat-label>'),
        (r'<mat-label>Type d\'intervention</mat-label>', r'<mat-label>{{ \'GENERATORS.INTERVENTION.TYPE\' | translate }}</mat-label>'),
        (r'>Préventive<', r">{{ 'GENERATORS.INTERVENTION.TYPE_PREV' | translate }}<"),
        (r'>Curative<', r">{{ 'GENERATORS.INTERVENTION.TYPE_CUR' | translate }}<"),
        (r'<mat-label>Fréquence</mat-label>', r'<mat-label>{{ \'GENERATORS.INTERVENTION.FREQUENCY\' | translate }}</mat-label>'),
        (r'>Chaque \{\{f\}\} Hrs<', r">{{ 'GENERATORS.INTERVENTION.FREQ_EACH' | translate }} {{f}} {{ 'GENERATORS.INTERVENTION.FREQ_HRS' | translate }}<"),
        (r'<mat-label>Nb d\'heures de fonctionnement \(actuel\)</mat-label>', r'<mat-label>{{ \'GENERATORS.INTERVENTION.CURRENT_HOURS\' | translate }}</mat-label>'),
        (r'<mat-label>Prochaine maintenance à \(heures\)</mat-label>', r'<mat-label>{{ \'GENERATORS.INTERVENTION.NEXT_MAINTENANCE\' | translate }}</mat-label>'),
        (r'<div class="section-title">Description de la panne</div>', r'<div class="section-title">{{ \'GENERATORS.INTERVENTION.SECTION_CURATIVE\' | translate }}</div>'),
        (r'<div class="section-title">Checklist des tâches effectuées \(\{\{intervention.frequence\}\}hrs\)</div>', r'<div class="section-title">{{ \'GENERATORS.INTERVENTION.SECTION_PREVENTIVE\' | translate }} ({{intervention.frequence}}hrs)</div>'),
        (r'<div class="section-title">Observation\(s\)</div>', r'<div class="section-title">{{ \'GENERATORS.INTERVENTION.SECTION_OBSERVATIONS\' | translate }}</div>'),
        (r'<span>Pièce\(s\) utilisée\(s\)</span>', r'<span>{{ \'GENERATORS.INTERVENTION.SECTION_PARTS\' | translate }}</span>'),
        (r'<mat-icon>add</mat-icon> Ajouter une pièce', r'<mat-icon>add</mat-icon> {{ \'GENERATORS.INTERVENTION.ADD_PART\' | translate }}'),
        (r'<mat-label>Référence</mat-label>', r'<mat-label>{{ \'GENERATORS.INTERVENTION.PART_REF\' | translate }}</mat-label>'),
        (r'<mat-label>Détails</mat-label>', r'<mat-label>{{ \'GENERATORS.INTERVENTION.PART_DETAILS\' | translate }}</mat-label>'),
        (r'<mat-label>Qté</mat-label>', r'<mat-label>{{ \'GENERATORS.INTERVENTION.PART_QTY\' | translate }}</mat-label>'),
        (r'<div class="section-title">Test du groupe durant 5 mn après intervention</div>', r'<div class="section-title">{{ \'GENERATORS.INTERVENTION.SECTION_TEST\' | translate }}</div>'),
        (r'<mat-label>Condition de fonctionnement</mat-label>', r'<mat-label>{{ \'GENERATORS.INTERVENTION.TEST_CONDITION\' | translate }}</mat-label>'),
        (r'>Fonctionnement normal<', r">{{ 'GENERATORS.INTERVENTION.TEST_NORMAL' | translate }}<"),
        (r'>Bruit suspect détecté<', r">{{ 'GENERATORS.INTERVENTION.TEST_NOISE' | translate }}<"),
        (r'>Mauvais fonctionnement, le groupe ne peut plus être utilisé.<', r">{{ 'GENERATORS.INTERVENTION.TEST_BAD' | translate }}<"),
        (r'>Annuler<', r">{{ 'GENERATORS.INTERVENTION.CANCEL' | translate }}<"),
        (r'>\s*Enregistrer l\'intervention\s*<', r"> {{ 'GENERATORS.INTERVENTION.SAVE' | translate }} <"),
        (r'<p>Chargement du générateur...</p>', r'<p>{{ \'GENERATORS.INTERVENTION.LOADING\' | translate }}</p>')
    ],
    'generateur-guide/generateur-guide.html': [
        (r'<h2>Guide de Maintenance Interne des Générateurs</h2>', r'<h2>{{ \'GENERATORS.GUIDE.TITLE\' | translate }}</h2>'),
        (r"<p>\s*Ce guide liste l'ensemble.*?</p>", r"<p>{{ 'GENERATORS.GUIDE.INFO' | translate }}</p>"),
        (r'label="Logbook Horaire &amp; Carburant"', r'[label]="\'GENERATORS.DETAIL.TAB_LOGBOOK\' | translate"') # just in case
    ]
}

for rel_path, replacements in html_replacements.items():
    file_path = os.path.join(base_dir, rel_path)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        # replace using re to handle varying whitespaces if needed
        content = re.sub(old, new, content, flags=re.DOTALL)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Replaced strings in {file_path}")

print("HTML replacements done!")
