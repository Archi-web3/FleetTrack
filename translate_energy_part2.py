import os
import re

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/gestion-des-deplacements/src/app/features/gestion-generateurs'

def inject_statut_key_func(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    func_code = """
  getStatutKey(statut: string): string {
    if (!statut) return '';
    const map: any = {
      'Actif': 'ACTIVE',
      'En maintenance': 'MAINTENANCE',
      'En panne': 'BROKEN',
      'Hors service': 'OUT_OF_SERVICE',
      'À jour': 'UP_TO_DATE',
      'Dû bientôt': 'DUE',
      'En retard': 'OVERDUE'
    };
    return map[statut] || statut.toUpperCase().replace(/\\s+/g, '_');
  }
"""
    if 'getStatutKey(' not in content:
        last_brace_idx = content.rfind('}')
        if last_brace_idx != -1:
            content = content[:last_brace_idx] + func_code + '}\n'
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Injected getStatutKey in {file_path}")

def translate_plan_component():
    ts_path = os.path.join(base_dir, 'generateur-plan/generateur-plan.ts')
    html_path = os.path.join(base_dir, 'generateur-plan/generateur-plan.html')

    # Update TS
    with open(ts_path, 'r', encoding='utf-8') as f:
        ts_content = f.read()

    if 'TranslateModule' not in ts_content:
        ts_content = ts_content.replace("import { InfoBannerComponent } from '../../../core/info-banner/info-banner';", "import { InfoBannerComponent } from '../../../core/info-banner/info-banner';\nimport { TranslateModule } from '@ngx-translate/core';")
        ts_content = ts_content.replace("    InfoBannerComponent\n  ]", "    InfoBannerComponent,\n    TranslateModule\n  ]")
        with open(ts_path, 'w', encoding='utf-8') as f:
            f.write(ts_content)

    inject_statut_key_func(ts_path)

    # Update HTML
    replacements = [
        (r'<h2>Plan de Maintenance Prévisionnel \(Générateurs\)</h2>', r"<h2>{{ 'GENERATORS.PLAN.TITLE' | translate }}</h2>"),
        (r'title="Planification de la Maintenance \(Heures\)"', r'[title]="\'GENERATORS.PLAN.BANNER_TITLE\' | translate"'),
        (r'<th mat-header-cell \*matHeaderCellDef> Générateur </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.PLAN.COL_GENERATOR\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Heures Actuelles </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.PLAN.COL_CURRENT_HOURS\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Prochain Service </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.PLAN.COL_NEXT_SERVICE\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Heures Restantes </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.PLAN.COL_REMAINING_HOURS\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Statut </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.PLAN.COL_STATUS\' | translate }} </th>'),
        (r'<th mat-header-cell \*matHeaderCellDef> Actions </th>', r'<th mat-header-cell *matHeaderCellDef> {{ \'GENERATORS.PLAN.COL_ACTIONS\' | translate }} </th>'),
        (r'>\s*Planifier / Effectuer\s*<', r"> {{ 'GENERATORS.PLAN.BTN_PLAN' | translate }} <"),
        (r'<p>Chargement du plan de maintenance...</p>', r"<p>{{ 'GENERATORS.PLAN.LOADING' | translate }}</p>"),
        (r'\{\{element.statut\}\}', r"{{ ('GENERATORS.STATUS.' + getStatutKey(element.statut)) | translate }}")
    ]

    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    for old, new in replacements:
        html_content = re.sub(old, new, html_content)
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

def fix_other_components():
    # 1. generateur-form.html Remarques & Notes
    form_html_path = os.path.join(base_dir, 'generateur-form/generateur-form.html')
    with open(form_html_path, 'r', encoding='utf-8') as f:
        form_content = f.read()
    form_content = form_content.replace('<div class="section-title">Remarques & Notes</div>', '<div class="section-title">{{ \'GENERATORS.FORM.SECTION_NOTES\' | translate }}</div>')
    with open(form_html_path, 'w', encoding='utf-8') as f:
        f.write(form_content)

    # 2. generateurs-list
    list_ts_path = os.path.join(base_dir, 'generateurs-list/generateurs-list.ts')
    inject_statut_key_func(list_ts_path)
    
    list_html_path = os.path.join(base_dir, 'generateurs-list/generateurs-list.html')
    with open(list_html_path, 'r', encoding='utf-8') as f:
        list_html = f.read()
    list_html = list_html.replace('{{element.statut}}', "{{ ('GENERATORS.STATUS.' + getStatutKey(element.statut)) | translate }}")
    with open(list_html_path, 'w', encoding='utf-8') as f:
        f.write(list_html)

    # 3. generateur-detail
    detail_ts_path = os.path.join(base_dir, 'generateur-detail/generateur-detail.ts')
    inject_statut_key_func(detail_ts_path)
    
    detail_html_path = os.path.join(base_dir, 'generateur-detail/generateur-detail.html')
    with open(detail_html_path, 'r', encoding='utf-8') as f:
        detail_html = f.read()
    detail_html = detail_html.replace('{{generateur.statut}}', "{{ ('GENERATORS.STATUS.' + getStatutKey(generateur.statut)) | translate }}")
    detail_html = detail_html.replace('{{element.statut}}', "{{ ('GENERATORS.STATUS.' + getStatutKey(element.statut)) | translate }}")
    with open(detail_html_path, 'w', encoding='utf-8') as f:
        f.write(detail_html)

translate_plan_component()
fix_other_components()
print("All fixes applied successfully!")
