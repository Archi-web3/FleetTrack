ts_content = """import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SettingsService } from '../settings.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    TranslateModule,
    MatSidenavModule
  ],
  templateUrl: './general-settings.html',
  styleUrls: ['./general-settings.scss']
})
export class GeneralSettingsComponent implements OnInit {
  activeTab: string = 'brand'; // 'brand', 'system', 'fleet', 'currencies', 'maintenance', 'emails'
  
  // Brand Settings
  brandSettings: any = {
    primaryColor: '#8b5cf6',
    appName: 'FleetTrack ACF',
    footerText: 'Copyright © 2026, Action Contre la Faim'
  };
  presetColors: string[] = ['#8b5cf6', '#2196F3', '#4CAF50', '#f44336', '#E91E63', '#009688', '#FF9800', '#607D8B'];

  // Fleet Settings (Existant)
  vehicleTypes: string[] = [];
  newType: string = '';
  loading = false;
  co2Factors: any = {
    short: 230,
    medium: 178,
    long: 152,
    source: 'ADEME (Base Empreinte)',
    url: ''
  };

  constructor(
    private settingsService: SettingsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadBrandSettings();
    this.loadTypes();
    this.loadCO2Factors();
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  // --- BRAND SETTINGS ---
  loadBrandSettings() {
    this.settingsService.getBrandSettings().subscribe(data => {
      if (data) {
        this.brandSettings = data;
      }
    });
  }

  setPrimaryColor(color: string) {
    this.brandSettings.primaryColor = color;
    document.documentElement.style.setProperty('--primary-color', color);
  }

  saveBrandSettings() {
    this.settingsService.saveBrandSettings(this.brandSettings).subscribe({
      next: () => {
        this.snackBar.open('Paramètres visuels sauvegardés', 'OK', { duration: 2000 });
        document.documentElement.style.setProperty('--primary-color', this.brandSettings.primaryColor);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur de sauvegarde', 'Fermer');
      }
    });
  }

  // --- FLEET SETTINGS (Types) ---
  loadTypes() {
    this.loading = true;
    this.settingsService.getVehicleTypes(true).subscribe({
      next: (types) => {
        this.vehicleTypes = types || [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  addType() {
    if (!this.newType.trim()) return;
    const type = this.newType.trim();
    if (this.vehicleTypes.includes(type)) {
      this.snackBar.open('Ce type existe déjà', 'OK', { duration: 3000 });
      return;
    }
    const updatedList = [...this.vehicleTypes, type];
    this.saveList(updatedList);
    this.newType = '';
  }

  removeType(type: string) {
    if (!confirm(`Supprimer le type "${type}" ?`)) return;
    const updatedList = this.vehicleTypes.filter(t => t !== type);
    this.saveList(updatedList);
  }

  saveList(list: string[]) {
    this.settingsService.saveVehicleTypes(list).subscribe({
      next: () => {
        this.vehicleTypes = list;
        this.snackBar.open('Liste mise à jour', 'OK', { duration: 2000 });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors de la sauvegarde', 'Fermer');
      }
    });
  }

  // --- FLEET SETTINGS (CO2) ---
  loadCO2Factors() {
    this.settingsService.getCO2Factors().subscribe(data => {
      if (data) this.co2Factors = data;
    });
  }

  saveCO2() {
    this.settingsService.saveCO2Factors(this.co2Factors).subscribe({
      next: () => this.snackBar.open('Facteurs CO2 enregistrés', 'OK', { duration: 2000 }),
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur sauvegarde CO2', 'Fermer');
      }
    });
  }
}
"""

html_content = """<div class="settings-container">
  <!-- Sidebar -->
  <div class="settings-sidebar">
    <h2 class="sidebar-title">Paramètres</h2>
    <mat-nav-list>
      <a mat-list-item [class.active]="activeTab === 'brand'" (click)="setTab('brand')">
        <mat-icon matListItemIcon>palette</mat-icon>
        <span matListItemTitle>Brand & Theme</span>
      </a>
      <a mat-list-item [class.active]="activeTab === 'system'" (click)="setTab('system')">
        <mat-icon matListItemIcon>settings</mat-icon>
        <span matListItemTitle>System Preferences</span>
      </a>
      <a mat-list-item [class.active]="activeTab === 'fleet'" (click)="setTab('fleet')">
        <mat-icon matListItemIcon>directions_car</mat-icon>
        <span matListItemTitle>Fleet & Rules</span>
      </a>
      <a mat-list-item [class.active]="activeTab === 'currencies'" (click)="setTab('currencies')">
        <mat-icon matListItemIcon>monetization_on</mat-icon>
        <span matListItemTitle>Currencies</span>
      </a>
      <a mat-list-item [class.active]="activeTab === 'maintenance'" (click)="setTab('maintenance')">
        <mat-icon matListItemIcon>build</mat-icon>
        <span matListItemTitle>Maintenance & Alerts</span>
      </a>
      <a mat-list-item [class.active]="activeTab === 'emails'" (click)="setTab('emails')">
        <mat-icon matListItemIcon>email</mat-icon>
        <span matListItemTitle>Email Settings</span>
      </a>
    </mat-nav-list>
  </div>

  <!-- Content -->
  <div class="settings-content">
    
    <!-- 1. BRAND & THEME -->
    <div *ngIf="activeTab === 'brand'" class="settings-section">
      <h2><mat-icon>palette</mat-icon> Brand & Theme Settings</h2>
      <p class="section-desc">Personnalisez l'identité visuelle de l'application FleetTrack.</p>

      <mat-card class="setting-card">
        <mat-card-header>
          <mat-card-title>Couleur Principale (Theme Customizer)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="color-picker-container">
            <div class="preset-colors">
              <div *ngFor="let color of presetColors" 
                   class="color-swatch" 
                   [style.background]="color"
                   [class.selected]="brandSettings.primaryColor === color"
                   (click)="setPrimaryColor(color)">
              </div>
            </div>
            <div class="custom-color-input">
              <label>Couleur personnalisée :</label>
              <input type="color" [(ngModel)]="brandSettings.primaryColor" (change)="setPrimaryColor(brandSettings.primaryColor)">
              <span>{{ brandSettings.primaryColor }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="setting-card">
        <mat-card-header>
          <mat-card-title>Textes et Informations</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="grid-2">
            <div class="modern-form-group">
              <label>Titre de l'application</label>
              <input type="text" class="modern-input" [(ngModel)]="brandSettings.appName">
            </div>
            <div class="modern-form-group">
              <label>Texte du pied de page (Footer)</label>
              <input type="text" class="modern-input" [(ngModel)]="brandSettings.footerText">
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="actions-footer">
        <button mat-flat-button color="primary" (click)="saveBrandSettings()">Save Changes</button>
      </div>
    </div>

    <!-- 3. FLEET & RULES -->
    <div *ngIf="activeTab === 'fleet'" class="settings-section">
      <h2><mat-icon>directions_car</mat-icon> Fleet & Rules</h2>
      <p class="section-desc">Gérez les types de véhicules et les paramètres d'émission CO2.</p>

      <div class="grid-2">
        <mat-card class="setting-card">
          <mat-card-header>
            <mat-card-title>Types de Véhicules</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="add-type-form">
              <input type="text" class="modern-input" [(ngModel)]="newType" placeholder="Nouveau type...">
              <button mat-flat-button color="primary" (click)="addType()">Ajouter</button>
            </div>
            <mat-list>
              <mat-list-item *ngFor="let type of vehicleTypes">
                <span matListItemTitle>{{ type }}</span>
                <button mat-icon-button color="warn" matListItemMeta (click)="removeType(type)">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>

        <mat-card class="setting-card">
          <mat-card-header>
            <mat-card-title>Facteurs CO2 (g/km)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="modern-form-group">
              <label>Trajet court</label>
              <input type="number" class="modern-input" [(ngModel)]="co2Factors.short">
            </div>
            <div class="modern-form-group">
              <label>Trajet moyen</label>
              <input type="number" class="modern-input" [(ngModel)]="co2Factors.medium">
            </div>
            <div class="modern-form-group">
              <label>Trajet long</label>
              <input type="number" class="modern-input" [(ngModel)]="co2Factors.long">
            </div>
            <div class="modern-form-group">
              <label>Source</label>
              <input type="text" class="modern-input" [(ngModel)]="co2Factors.source">
            </div>
            <button mat-flat-button color="primary" style="margin-top: 15px;" (click)="saveCO2()">Save CO2</button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <!-- PLACEHOLDERS FOR OTHERS -->
    <div *ngIf="activeTab === 'system' || activeTab === 'currencies' || activeTab === 'maintenance' || activeTab === 'emails'" class="settings-section">
      <div class="placeholder-content">
        <mat-icon style="font-size: 48px; width: 48px; height: 48px; color: #cbd5e1; margin-bottom: 20px;">construction</mat-icon>
        <h2>Module en construction</h2>
        <p>Ce module ({{ activeTab }}) sera implémenté dans les prochaines étapes du développement.</p>
      </div>
    </div>

  </div>
</div>
"""

scss_content = """.settings-container {
  display: flex;
  height: calc(100vh - 64px); /* Hauteur de la fenetre moins la navbar */
  background-color: var(--bg-color, #f8fafc);
  margin: -20px; /* Compense le padding du router-outlet */
}

.settings-sidebar {
  width: 280px;
  background-color: white;
  border-right: 1px solid #e2e8f0;
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0,0,0,0.02);

  .sidebar-title {
    padding: 0 20px;
    margin-bottom: 20px;
    font-size: 1.2rem;
    font-weight: 600;
    color: #1e293b;
  }

  mat-nav-list {
    a[mat-list-item] {
      margin: 4px 12px;
      border-radius: 8px;
      color: #64748b;
      
      mat-icon {
        color: #94a3b8;
      }

      &:hover {
        background-color: #f1f5f9;
      }

      &.active {
        background-color: rgba(var(--primary-color-rgb, 139, 92, 246), 0.1);
        color: var(--primary-color);
        font-weight: 600;

        mat-icon {
          color: var(--primary-color);
        }
      }
    }
  }
}

.settings-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

.settings-section {
  max-width: 1000px;

  h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 5px 0;
    color: #1e293b;
    font-size: 1.5rem;

    mat-icon {
      color: var(--primary-color);
    }
  }

  .section-desc {
    color: #64748b;
    margin-bottom: 30px;
  }
}

.setting-card {
  margin-bottom: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
  border-radius: 12px !important;
  border: 1px solid #e2e8f0;

  mat-card-header {
    margin-bottom: 15px;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 10px;
    mat-card-title {
      font-size: 1.1rem;
      color: #334155;
    }
  }
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: flex-start;
}

/* Color Picker Styles */
.color-picker-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preset-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  .color-swatch {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border: 2px solid transparent;
    transition: transform 0.2s, border-color 0.2s;

    &:hover {
      transform: scale(1.1);
    }

    &.selected {
      border-color: #1e293b;
      transform: scale(1.1);
      box-shadow: 0 0 0 2px white, 0 0 0 4px #1e293b;
    }
  }
}

.custom-color-input {
  display: flex;
  align-items: center;
  gap: 10px;

  label {
    font-weight: 500;
    color: #475569;
  }

  input[type="color"] {
    -webkit-appearance: none;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    padding: 0;
    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    &::-webkit-color-swatch {
      border: none;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  }

  span {
    font-family: monospace;
    background: #f1f5f9;
    padding: 4px 8px;
    border-radius: 4px;
    color: #64748b;
  }
}

/* Form Styles */
.modern-form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
  }

  .modern-input {
    padding: 10px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 14px;
    color: #1e293b;
    transition: all 0.2s;
    background-color: #f8fafc;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb, 139, 92, 246), 0.1);
      background-color: white;
    }
  }
}

.actions-footer {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  button {
    padding: 6px 24px;
    font-size: 1rem;
  }
}

.add-type-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  input { flex: 1; }
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  text-align: center;
  color: #64748b;
  
  h2 {
    color: #475569;
    margin-bottom: 10px;
  }
}
"""

with open('src/app/general-settings/general-settings.ts', 'w') as f:
    f.write(ts_content)

with open('src/app/general-settings/general-settings.html', 'w') as f:
    f.write(html_content)

with open('src/app/general-settings/general-settings.scss', 'w') as f:
    f.write(scss_content)

print("Rewrote General Settings component")
