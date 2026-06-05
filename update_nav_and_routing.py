import re

# 1. Update general-settings.ts to read query params
ts_path = "Angular/gestion-des-deplacements/src/app/general-settings/general-settings.ts"
with open(ts_path, "r") as f:
    ts_code = f.read()

if "ActivatedRoute" not in ts_code:
    ts_code = ts_code.replace(
        "import { TranslateModule } from '@ngx-translate/core';",
        "import { TranslateModule } from '@ngx-translate/core';\nimport { ActivatedRoute } from '@angular/router';"
    )
    ts_code = ts_code.replace(
        "private snackBar: MatSnackBar",
        "private snackBar: MatSnackBar,\n    private route: ActivatedRoute"
    )
    
    ng_init_logic = """
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
"""
    ts_code = ts_code.replace("this.loadBrandSettings();", ng_init_logic + "    this.loadBrandSettings();")
    
    with open(ts_path, "w") as f:
        f.write(ts_code)

# 2. Update app.component.html navbar
app_html = "Angular/gestion-des-deplacements/src/app/app.component.html"
with open(app_html, "r") as f:
    app_code = f.read()

old_settings_btn = """<button mat-menu-item routerLink="/admin/settings"><mat-icon>settings_applications</mat-icon><span>{{ 'MENU.GENERAL_SETTINGS' | translate }}</span></button>"""
new_settings_btn = """<button mat-menu-item routerLink="/admin/settings" [queryParams]="{tab: 'fleet'}"><mat-icon>directions_car</mat-icon><span>Paramétrages Fleet</span></button>
          <button mat-menu-item routerLink="/admin/settings" [queryParams]="{tab: 'brand'}"><mat-icon>settings_applications</mat-icon><span>Paramétrages Système</span></button>"""

if "Paramétrages Système" not in app_code:
    app_code = app_code.replace(old_settings_btn, new_settings_btn)
    with open(app_html, "w") as f:
        f.write(app_code)

print("Navbar and general-settings.ts updated.")
