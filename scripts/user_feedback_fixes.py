import re

# 1. Update app.component.html
app_html = "Angular/gestion-des-deplacements/src/app/app.component.html"
with open(app_html, "r") as f:
    app_code = f.read()

# Make logo and title clickable
app_code = app_code.replace(
    '<div class="logo-container">',
    '<div class="logo-container" routerLink="/" style="cursor: pointer;">'
)

# Replace the ADMIN and FLEET menus
# The user wants:
# Paramétrages Fleet -> Gestion Utilisateurs, Gestion Projets, Gestion Lieux, Pays & Bases, Objectifs Enviro
# Paramétrages Système -> Paramètres (Brand/Theme)
# Guide Utilisateur -> Separate menu with Lightbulb icon

# We'll regex out the old ADMIN menu and FLEET menu and rewrite the operations/fleet/admin section.

# Let's find the secondary bar nav and replace it.
import sys

def replace_between(content, start_marker, end_marker, replacement):
    start = content.find(start_marker)
    end = content.find(end_marker)
    if start != -1 and end != -1:
        return content[:start] + replacement + content[end + len(end_marker):]
    return content

new_menus = """      <!-- OPERATIONS -->
      <ng-container *ngIf="userProfile === 'Admin' || userProfile === 'Superviseur' || userProfile === 'Superviseur Sécurité' || userProfile === 'SuperAdmin'">
        <button class="nav-item" [matMenuTriggerFor]="opsMenu">
          <mat-icon>flash_on</mat-icon> {{ 'MENU.GROUPS.OPERATIONS' | translate }} <mat-icon>expand_more</mat-icon>
        </button>
        <mat-menu #opsMenu="matMenu">
          <button mat-menu-item routerLink="/valider-mouvements"><mat-icon>check_circle</mat-icon><span>{{ 'MENU.VALIDATE_TRIPS' | translate }}</span></button>
          <button mat-menu-item routerLink="/consolidation"><mat-icon>merge_type</mat-icon><span>{{ 'MENU.CONSOLIDATION' | translate }}</span></button>
        </mat-menu>
      </ng-container>

      <!-- VEHICLES (Was Fleet, now "Véhicules & Maintenance" or similar, wait user didn't specify removing vehicles. We will keep Vehicles under Fleet but the user said "Parametres Fleet et dedans Gestion Utilisateurs...". This is confusing. The user meant the new Fleet Settings?) -->
      <!-- Let's just create a single "Véhicules & Maintenance" for actual fleet -->
      <ng-container *ngIf="userProfile === 'Admin' || userProfile === 'Superviseur' || userProfile === 'SuperAdmin'">
        <button class="nav-item" [matMenuTriggerFor]="vehiclesMenu">
          <mat-icon>local_shipping</mat-icon> Flotte & Maintenance <mat-icon>expand_more</mat-icon>
        </button>
        <mat-menu #vehiclesMenu="matMenu">
          <button mat-menu-item routerLink="/gestion-vehicules"><mat-icon>directions_car</mat-icon><span>{{ 'MENU.VEHICLE_MANAGEMENT' | translate }}</span></button>
          <button mat-menu-item routerLink="/gestion-chauffeurs"><mat-icon>people_alt</mat-icon><span>{{ 'MENU.DRIVER_MANAGEMENT' | translate }}</span></button>
          <mat-divider></mat-divider>
          <button mat-menu-item routerLink="/gestion-maintenance"><mat-icon>build</mat-icon><span>{{ 'MENU.MAINTENANCE_TRACKING' | translate }}</span></button>
          <button mat-menu-item routerLink="/recap-flotte"><mat-icon>assessment</mat-icon><span>{{ 'MENU.FLEET_RECAP' | translate }}</span></button>
          <button mat-menu-item routerLink="/rapports-mensuels"><mat-icon>bar_chart</mat-icon><span>{{ 'MENU.MONTHLY_REPORTS' | translate }}</span></button>
        </mat-menu>
      </ng-container>

      <!-- SECURITY -->
      <ng-container *ngIf="userProfile === 'Admin' || userProfile === 'Superviseur' || userProfile === 'Superviseur Sécurité' || userProfile === 'SuperAdmin'">
        <button class="nav-item" [matMenuTriggerFor]="securityMenu">
          <mat-icon>security</mat-icon> {{ 'MENU.GROUPS.SECURITY' | translate }} <mat-icon>expand_more</mat-icon>
        </button>
        <mat-menu #securityMenu="matMenu">
          <button mat-menu-item routerLink="/security-alerts"><mat-icon style="color: #f44336;">notification_important</mat-icon><span>{{ 'MENU.SECURITY_ALERTS' | translate }}</span></button>
          <button mat-menu-item routerLink="/roadmap"><mat-icon>rocket_launch</mat-icon><span>{{ 'MENU.VISION_SECURITY' | translate }}</span></button>
          <mat-divider></mat-divider>
          <button mat-menu-item routerLink="/admin/waivers"><mat-icon>folder_shared</mat-icon><span>{{ 'MENU.WAIVERS' | translate }}</span></button>
          <button mat-menu-item routerLink="/admin/audit-logs"><mat-icon>history_edu</mat-icon><span>{{ 'MENU.AUDIT_LOGS' | translate }}</span></button>
          <button mat-menu-item routerLink="/admin/security-matrix"><mat-icon style="color: #4caf50;">shield</mat-icon><span>{{ 'MENU.SECURITY_MATRIX' | translate }}</span></button>
        </mat-menu>
      </ng-container>

      <!-- PARAMETRAGE FLEET -->
      <ng-container *ngIf="userProfile === 'Admin' || userProfile === 'SuperAdmin'">
        <button class="nav-item" [matMenuTriggerFor]="paramFleetMenu">
          <mat-icon>tune</mat-icon> Paramétrages Fleet <mat-icon>expand_more</mat-icon>
        </button>
        <mat-menu #paramFleetMenu="matMenu">
          <button mat-menu-item routerLink="/gestion-utilisateurs"><mat-icon>people</mat-icon><span>{{ 'MENU.USER_MANAGEMENT' | translate }}</span></button>
          <button mat-menu-item routerLink="/gestion-projets"><mat-icon>folder</mat-icon><span>{{ 'MENU.PROJECT_MANAGEMENT' | translate }}</span></button>
          <button mat-menu-item routerLink="/gestion-lieux"><mat-icon>place</mat-icon><span>{{ 'MENU.LOCATION_MANAGEMENT' | translate }}</span></button>
          <button mat-menu-item routerLink="/admin/pays-bases" *ngIf="userProfile === 'SuperAdmin'"><mat-icon>public</mat-icon><span>{{ 'MENU.COUNTRIES_BASES' | translate }}</span></button>
          <button mat-menu-item routerLink="/environment-roadmap"><mat-icon>eco</mat-icon><span>{{ 'MENU.ENV_OBJECTIVES' | translate }}</span></button>
        </mat-menu>
      </ng-container>

      <!-- PARAMETRAGES SYSTEME -->
      <ng-container *ngIf="userProfile === 'Admin' || userProfile === 'SuperAdmin'">
        <button class="nav-item" routerLink="/admin/settings" [queryParams]="{tab: 'brand'}">
          <mat-icon>settings_applications</mat-icon> Paramétrages Système
        </button>
      </ng-container>

      <!-- GUIDE UTILISATEUR -->
      <button class="nav-item" routerLink="/guide-utilisateur">
        <mat-icon style="color: #ffeb3b;">lightbulb</mat-icon> Guide Utilisateur
      </button>"""

app_code = replace_between(app_code, "<!-- OPERATIONS -->", "<!-- ADMIN -->\n      <ng-container *ngIf=\"userProfile === 'Admin' || userProfile === 'SuperAdmin'\">\n        <button class=\"nav-item\" [matMenuTriggerFor]=\"adminMenu\">\n          <mat-icon>settings</mat-icon> {{ 'MENU.GROUPS.ADMIN' | translate }} <mat-icon>expand_more</mat-icon>\n        </button>\n        <mat-menu #adminMenu=\"matMenu\">\n          <button mat-menu-item routerLink=\"/gestion-utilisateurs\"><mat-icon>people</mat-icon><span>{{ 'MENU.USER_MANAGEMENT' | translate }}</span></button>\n          <button mat-menu-item routerLink=\"/gestion-projets\"><mat-icon>folder</mat-icon><span>{{ 'MENU.PROJECT_MANAGEMENT' | translate }}</span></button>\n          <button mat-menu-item routerLink=\"/gestion-lieux\"><mat-icon>place</mat-icon><span>{{ 'MENU.LOCATION_MANAGEMENT' | translate }}</span></button>\n          <button mat-menu-item routerLink=\"/admin/pays-bases\" *ngIf=\"userProfile === 'SuperAdmin'\"><mat-icon>public</mat-icon><span>{{ 'MENU.COUNTRIES_BASES' | translate }}</span></button>\n          <mat-divider></mat-divider>\n          <button mat-menu-item routerLink=\"/admin/settings\" [queryParams]=\"{tab: 'fleet'}\"><mat-icon>directions_car</mat-icon><span>Paramétrages Fleet</span></button>\n          <button mat-menu-item routerLink=\"/admin/settings\" [queryParams]=\"{tab: 'brand'}\"><mat-icon>settings_applications</mat-icon><span>Paramétrages Système</span></button>\n          <button mat-menu-item routerLink=\"/environment-roadmap\"><mat-icon>eco</mat-icon><span>{{ 'MENU.ENV_OBJECTIVES' | translate }}</span></button>\n          <mat-divider></mat-divider>\n          <button mat-menu-item routerLink=\"/guide-utilisateur\"><mat-icon>help</mat-icon><span>{{ 'MENU.USER_GUIDE' | translate }}</span></button>\n        </mat-menu>\n      </ng-container>", new_menus)

with open(app_html, "w") as f:
    f.write(app_code)


# 2. Update general-settings.html
gs_html = "Angular/gestion-des-deplacements/src/app/general-settings/general-settings.html"
with open(gs_html, "r") as f:
    gs_code = f.read()

# Add checkboxes and default images
new_images_html = """
      <mat-card class="setting-card">
        <mat-card-header>
          <mat-card-title>Images et Logos</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="grid-2">
            <!-- Fond Login -->
            <div class="modern-form-group">
              <label>Fond d'écran Login</label>
              
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: normal; cursor: pointer;">
                  <input type="checkbox" [(ngModel)]="useDefaultBackground" (change)="toggleDefaultBackground()"> Utiliser le fond violet par défaut
                </label>
                
                <div *ngIf="useDefaultBackground" style="height: 60px; border-radius: 8px; background: radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.4), transparent 50%), radial-gradient(circle at 70% 80%, rgba(217, 70, 239, 0.3), transparent 50%), radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.2), transparent 100%), #1e1b4b; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">Fond Violet Par Défaut</div>

                <div class="image-upload-box" *ngIf="!useDefaultBackground && !brandSettings.loginBackgroundUrl">
                  <input type="file" (change)="onFileSelected($event, 'loginBackgroundUrl')" accept="image/*">
                  <mat-icon>cloud_upload</mat-icon>
                  <span>Choisir une image (Max 2MB)</span>
                </div>
                <div class="image-preview" *ngIf="!useDefaultBackground && brandSettings.loginBackgroundUrl">
                  <img [src]="brandSettings.loginBackgroundUrl" alt="Login BG" style="height: 60px; border-radius: 8px;">
                  <button mat-icon-button color="warn" (click)="removeImage('loginBackgroundUrl')"><mat-icon>delete</mat-icon></button>
                </div>
              </div>
            </div>

            <!-- Logo Dark -->
            <div class="modern-form-group">
              <label>Logo Principal (Mode Clair)</label>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: normal; cursor: pointer;">
                  <input type="checkbox" [(ngModel)]="useDefaultLogoDark" (change)="toggleDefaultLogoDark()"> Utiliser le logo par défaut
                </label>
                <div *ngIf="useDefaultLogoDark" style="height: 40px; background: #f8fafc; padding: 5px; display: flex; align-items: center;"><img src="assets/logo_acf.png" style="height: 30px;"></div>

                <div class="image-upload-box" *ngIf="!useDefaultLogoDark && !brandSettings.logoDark">
                  <input type="file" (change)="onFileSelected($event, 'logoDark')" accept="image/*">
                  <mat-icon>cloud_upload</mat-icon>
                  <span>Choisir une image (Max 2MB)</span>
                </div>
                <div class="image-preview" *ngIf="!useDefaultLogoDark && brandSettings.logoDark">
                  <img [src]="brandSettings.logoDark" alt="Logo Dark" style="height: 40px; background: #f8fafc; padding: 5px;">
                  <button mat-icon-button color="warn" (click)="removeImage('logoDark')"><mat-icon>delete</mat-icon></button>
                </div>
              </div>
            </div>

            <!-- Logo Light -->
            <div class="modern-form-group">
              <label>Logo Secondaire (Mode Sombre / Sidebar)</label>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: normal; cursor: pointer;">
                  <input type="checkbox" [(ngModel)]="useDefaultLogoLight" (change)="toggleDefaultLogoLight()"> Utiliser le logo par défaut
                </label>
                <div *ngIf="useDefaultLogoLight" style="height: 40px; background: #1e293b; padding: 5px; display: flex; align-items: center;"><img src="assets/logo_acf.png" style="height: 30px; filter: brightness(0) invert(1);"></div>

                <div class="image-upload-box" *ngIf="!useDefaultLogoLight && !brandSettings.logoLight">
                  <input type="file" (change)="onFileSelected($event, 'logoLight')" accept="image/*">
                  <mat-icon>cloud_upload</mat-icon>
                  <span>Choisir une image (Max 2MB)</span>
                </div>
                <div class="image-preview" *ngIf="!useDefaultLogoLight && brandSettings.logoLight">
                  <img [src]="brandSettings.logoLight" alt="Logo Light" style="height: 40px; background: #1e293b; padding: 5px;">
                  <button mat-icon-button color="warn" (click)="removeImage('logoLight')"><mat-icon>delete</mat-icon></button>
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
"""
gs_code = replace_between(gs_code, '      <mat-card class="setting-card">\n        <mat-card-header>\n          <mat-card-title>Images et Logos', '          </div>\n        </mat-card-content>\n      </mat-card>', new_images_html)
if "Utiliser le fond violet par défaut" not in gs_code:
    with open(gs_html, "w") as f:
        f.write(gs_code)

# Update general-settings.ts to handle the checkboxes
ts_path = "Angular/gestion-des-deplacements/src/app/general-settings/general-settings.ts"
with open(ts_path, "r") as f:
    ts_code = f.read()

checkbox_logic = """
  useDefaultBackground = true;
  useDefaultLogoDark = true;
  useDefaultLogoLight = true;

  toggleDefaultBackground() {
    if (this.useDefaultBackground) this.brandSettings.loginBackgroundUrl = '';
  }
  toggleDefaultLogoDark() {
    if (this.useDefaultLogoDark) this.brandSettings.logoDark = '';
  }
  toggleDefaultLogoLight() {
    if (this.useDefaultLogoLight) this.brandSettings.logoLight = '';
  }
"""

if "useDefaultBackground = true" not in ts_code:
    ts_code = ts_code.replace("activeTab = 'brand';", "activeTab = 'brand';" + checkbox_logic)
    
    init_checkboxes = """
        if (this.brandSettings.loginBackgroundUrl) this.useDefaultBackground = false;
        if (this.brandSettings.logoDark) this.useDefaultLogoDark = false;
        if (this.brandSettings.logoLight) this.useDefaultLogoLight = false;
    """
    ts_code = ts_code.replace("this.brandSettings = settings;", "this.brandSettings = settings;" + init_checkboxes)
    with open(ts_path, "w") as f:
        f.write(ts_code)

# 3. Fix login.component.html autocomplete
login_html = "Angular/gestion-des-deplacements/src/app/login/login.component.html"
with open(login_html, "r") as f:
    login_code = f.read()

login_code = login_code.replace('name="motDePasse"', 'name="motDePasse" autocomplete="current-password"')
with open(login_html, "w") as f:
    f.write(login_code)

print("Updates completed successfully.")
