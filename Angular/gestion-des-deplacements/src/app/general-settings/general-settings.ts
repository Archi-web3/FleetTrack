import { Component, OnInit } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
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
    footerText: 'Copyright © 2026, Action Contre la Faim',
    loginBackgroundUrl: '',
    logoDark: '',
    logoLight: ''
  };
  
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
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
    this.loadBrandSettings();
    this.loadTypes();
    this.loadCO2Factors();
    this.loadCurrencies();
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  // --- CURRENCIES ---
  currencies: any[] = [];
  newCurrency: any = { code: '', symbol: '', rate: 1, isDefault: false };

  loadCurrencies() {
    this.settingsService.getCurrencies().subscribe(data => {
      if (data && data.length > 0) {
        this.currencies = data;
      }
    });
  }

  addCurrency() {
    if (this.newCurrency.code && this.newCurrency.symbol) {
      if (this.newCurrency.isDefault) {
        this.currencies.forEach(c => c.isDefault = false);
      }
      this.currencies.push({ ...this.newCurrency });
      this.newCurrency = { code: '', symbol: '', rate: 1, isDefault: false };
      this.saveCurrencies();
    }
  }

  removeCurrency(curr: any) {
    this.currencies = this.currencies.filter(c => c !== curr);
    this.saveCurrencies();
  }

  setDefaultCurrency(curr: any) {
    this.currencies.forEach(c => c.isDefault = false);
    curr.isDefault = true;
    this.saveCurrencies();
  }

  saveCurrencies() {
    this.settingsService.saveCurrencies(this.currencies).subscribe(() => {
      // Afficher un petit message de succès si nécessaire
    });
  }
  loadBrandSettings() {
    this.settingsService.getBrandSettings().subscribe(data => {
      if (data) {
        this.brandSettings = data;
        if (this.brandSettings.loginBackgroundUrl) this.useDefaultBackground = false;
        if (this.brandSettings.logoDark) this.useDefaultLogoDark = false;
        if (this.brandSettings.logoLight) this.useDefaultLogoLight = false;
      }
    });
  }

  setPrimaryColor(color: string) {
    this.brandSettings.primaryColor = color;
    document.documentElement.style.setProperty('--primary-color', color);
  }

  
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
// Triggering Vercel build to fix cache
