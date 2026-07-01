import os

base_dir = '/home/jonathan/Documents/App/ACF_vf/Angular/e-logbook/src'

ts_files = [
    'app/features/vehicle-form/vehicle-form.ts',
    'app/features/fuel-form/fuel-form.ts',
    'app/features/login/login.ts',
    'app/features/incident-form/incident-form.ts'
]

for ts_file in ts_files:
    filepath = os.path.join(base_dir, ts_file)
    if not os.path.exists(filepath):
        print(f"NOT FOUND: {filepath}")
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'TranslateModule' not in content:
        content = content.replace("from '@angular/core';", "from '@angular/core';\nimport { TranslateModule } from '@ngx-translate/core';")
        content = content.replace("imports: [", "imports: [\n    TranslateModule,")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Mobile TS imports applied.")
