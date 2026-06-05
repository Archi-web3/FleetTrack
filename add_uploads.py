import re

ts_path = "Angular/gestion-des-deplacements/src/app/general-settings/general-settings.ts"
with open(ts_path, "r") as f:
    ts_code = f.read()

upload_method = """
  // --- UPLOAD IMAGES ---
  onFileSelected(event: any, field: string) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB max
        this.snackBar.open('Fichier trop lourd (Max 2MB)', 'Fermer');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.brandSettings[field] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(field: string) {
    this.brandSettings[field] = '';
  }
"""

if "onFileSelected" not in ts_code:
    ts_code = ts_code.replace("saveBrandSettings() {", upload_method + "\n  saveBrandSettings() {")
    with open(ts_path, "w") as f:
        f.write(ts_code)


html_path = "Angular/gestion-des-deplacements/src/app/general-settings/general-settings.html"
with open(html_path, "r") as f:
    html_code = f.read()

images_html = """
      <mat-card class="setting-card">
        <mat-card-header>
          <mat-card-title>Images et Logos</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="grid-2">
            <!-- Fond Login -->
            <div class="modern-form-group">
              <label>Fond d'écran Login</label>
              <div class="image-upload-box" *ngIf="!brandSettings.loginBackgroundUrl">
                <input type="file" (change)="onFileSelected($event, 'loginBackgroundUrl')" accept="image/*">
                <mat-icon>cloud_upload</mat-icon>
                <span>Choisir une image (Max 2MB)</span>
              </div>
              <div class="image-preview" *ngIf="brandSettings.loginBackgroundUrl">
                <img [src]="brandSettings.loginBackgroundUrl" alt="Login BG" style="height: 60px; border-radius: 8px;">
                <button mat-icon-button color="warn" (click)="removeImage('loginBackgroundUrl')"><mat-icon>delete</mat-icon></button>
              </div>
            </div>

            <!-- Logo Dark -->
            <div class="modern-form-group">
              <label>Logo Principal (Mode Clair)</label>
              <div class="image-upload-box" *ngIf="!brandSettings.logoDark">
                <input type="file" (change)="onFileSelected($event, 'logoDark')" accept="image/*">
                <mat-icon>cloud_upload</mat-icon>
                <span>Choisir une image (Max 2MB)</span>
              </div>
              <div class="image-preview" *ngIf="brandSettings.logoDark">
                <img [src]="brandSettings.logoDark" alt="Logo Dark" style="height: 40px; background: #f8fafc; padding: 5px;">
                <button mat-icon-button color="warn" (click)="removeImage('logoDark')"><mat-icon>delete</mat-icon></button>
              </div>
            </div>

            <!-- Logo Light -->
            <div class="modern-form-group">
              <label>Logo Secondaire (Mode Sombre / Sidebar)</label>
              <div class="image-upload-box" *ngIf="!brandSettings.logoLight">
                <input type="file" (change)="onFileSelected($event, 'logoLight')" accept="image/*">
                <mat-icon>cloud_upload</mat-icon>
                <span>Choisir une image (Max 2MB)</span>
              </div>
              <div class="image-preview" *ngIf="brandSettings.logoLight">
                <img [src]="brandSettings.logoLight" alt="Logo Light" style="height: 40px; background: #1e293b; padding: 5px;">
                <button mat-icon-button color="warn" (click)="removeImage('logoLight')"><mat-icon>delete</mat-icon></button>
              </div>
            </div>
            
            <!-- Favicon -->
            <div class="modern-form-group">
              <label>Favicon</label>
              <div class="image-upload-box" *ngIf="!brandSettings.favicon">
                <input type="file" (change)="onFileSelected($event, 'favicon')" accept="image/*">
                <mat-icon>cloud_upload</mat-icon>
                <span>Choisir une image (Max 2MB)</span>
              </div>
              <div class="image-preview" *ngIf="brandSettings.favicon">
                <img [src]="brandSettings.favicon" alt="Favicon" style="height: 32px; width: 32px;">
                <button mat-icon-button color="warn" (click)="removeImage('favicon')"><mat-icon>delete</mat-icon></button>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
"""

# Replace the old URL input
old_input = """<div class="modern-form-group">
              <label>URL Image de fond (Login)</label>
              <input type="text" class="modern-input" [(ngModel)]="brandSettings.loginBackgroundUrl" placeholder="https://...">
            </div>"""

if "image-upload-box" not in html_code:
    html_code = html_code.replace(old_input, "")
    html_code = html_code.replace('<div class="actions-footer">', images_html + '\n      <div class="actions-footer">')
    with open(html_path, "w") as f:
        f.write(html_code)


scss_path = "Angular/gestion-des-deplacements/src/app/general-settings/general-settings.scss"
with open(scss_path, "r") as f:
    scss_code = f.read()

css_add = """
.image-upload-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;

  &:hover {
    border-color: var(--primary-color);
    background: rgba(var(--primary-color-rgb, 139, 92, 246), 0.05);
    color: var(--primary-color);
  }

  input[type="file"] {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    opacity: 0;
    cursor: pointer;
  }
}

.image-preview {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: white;
}
"""
if ".image-upload-box" not in scss_code:
    with open(scss_path, "a") as f:
        f.write(css_add)

print("Added image uploads to GeneralSettingsComponent.")
