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
import { SettingsService } from '../../core/services/settings.service';
import { UtilisateurService } from '../../core/services/utilisateur.service';
import { PermissionsService } from '../../core/services/permissions.service';
import { AdminService } from '../../core/services/admin.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';

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
    MatSidenavModule,
    MatSlideToggleModule,
    MatSelectModule
  ],
  templateUrl: './general-settings.html',
  styleUrls: ['./general-settings.scss']
})
export class GeneralSettingsComponent implements OnInit {
  activeTab: string = 'brand'; // 'brand', 'system', 'fleet', 'currencies', 'maintenance', 'emails'
  userProfile: string = '';
  
  
  // Brand Settings
  brandSettings: any = {
    primaryColor: '#8b5cf6',
    appName: 'FleetTrack ACF',
    appTagline: '',
    footerText: 'Copyright © 2026, Action Contre la Faim',
    mobileAppName: 'e-Logbook',
    mobileAppTagline: 'Chauffeur',
    logoDark: '', // Legacy, keep for safety
    logoLight: '', // Legacy
    mobileAppLogo: '', // Legacy
    displayMode: 'both', // Legacy, keep for backward compatibility
    headerDisplayMode: 'both',
    heroDisplayMode: 'both',

    // Nouveaux champs pour logos séparés et couleurs
    webLoginLogo: '',
    webLoginLogoColor: '',
    webHeaderLogo: '',
    webHeaderLogoColor: '',
    webHeroLogo: '',
    webHeroLogoColor: '',
    mobileLoginLogo: '',
    mobileLoginLogoColor: '',
    mobileHeaderLogo: '',
    mobileHeaderLogoColor: ''
  };
  
  useDefaultBackground = true;

  // System Settings
  systemPreferences: any = {
    enableGenerators: false
  };

  toggleDefaultBackground() {
    if (this.useDefaultBackground) this.brandSettings.loginBackgroundUrl = '';
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
    private utilisateurService: UtilisateurService,
    private perms: PermissionsService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userProfile = localStorage.getItem('userProfile') || 'SuperAdmin';
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });

    // Profils dynamiques
    this.profilesList = Object.keys(this.perms.getMatrix());

    if (this.userProfile === 'SuperAdmin') {
      this.adminService.getPays().subscribe(data => this.paysList = data);
    } else if (this.userProfile === 'Admin') {
      const userPaysId = localStorage.getItem('userPays') || '';
      if (userPaysId) {
        this.selectedEmailPaysContext = userPaysId;
        this.adminService.getBases(userPaysId).subscribe(data => this.basesList = data);
      }
    }

    this.utilisateurService.getUtilisateurs().subscribe(users => {
      this.usersList = users;
    });

    this.loadBrandSettings();
    this.loadTypes();
    this.loadCO2Factors();
    this.loadCurrencies();
    this.loadEmailSettings();
    this.loadSystemPreferences();
  }

  // --- SYSTEM PREFERENCES ---
  loadSystemPreferences() {
    this.settingsService.getSystemPreferences().subscribe(data => {
      if (data) {
        this.systemPreferences = data;
      }
    });
  }

  saveSystemPreferences() {
    this.settingsService.saveSystemPreferences(this.systemPreferences).subscribe({
      next: () => {
        this.snackBar.open('Préférences Système sauvegardées', 'OK', { duration: 2000 });
        // Force refresh in app component if needed
        window.location.reload(); 
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur de sauvegarde', 'Fermer');
      }
    });
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
        if (!this.brandSettings.displayMode) this.brandSettings.displayMode = 'both';
        if (!this.brandSettings.headerDisplayMode) this.brandSettings.headerDisplayMode = this.brandSettings.displayMode;
        if (!this.brandSettings.heroDisplayMode) this.brandSettings.heroDisplayMode = this.brandSettings.displayMode;
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

  // --- EMAIL SETTINGS ---
  profilesList: string[] = [];
  usersList: any[] = [];
  paysList: any[] = [];
  basesList: any[] = [];
  
  selectedEmailContext: 'global' | 'pays' | 'base' = 'global';
  selectedEmailPaysContext: string = '';
  selectedEmailBaseContext: string = '';

  onEmailContextChange() {
    if (this.selectedEmailContext === 'pays' && this.selectedEmailPaysContext) {
      this.adminService.getBases(this.selectedEmailPaysContext).subscribe(data => this.basesList = data);
    }
    this.loadEmailSettings();
  }

  onEmailPaysChange() {
    if (this.selectedEmailPaysContext) {
      this.adminService.getBases(this.selectedEmailPaysContext).subscribe(data => this.basesList = data);
    } else {
      this.basesList = [];
    }
    this.selectedEmailBaseContext = '';
    this.loadEmailSettings();
  }

  onEmailBaseChange() {
    this.loadEmailSettings();
  }

  getCurrentEmailContextKey(): string {
    if (this.selectedEmailContext === 'base' && this.selectedEmailBaseContext) {
      return `emailSettings_base_${this.selectedEmailBaseContext}`;
    }
    if (this.selectedEmailContext === 'pays' && this.selectedEmailPaysContext) {
      return `emailSettings_pays_${this.selectedEmailPaysContext}`;
    }
    return 'emailSettings_global';
  }

  emailNotifications: any[] = [
    { id: 'req_created', name: 'Nouvelle demande de mouvement', desc: 'Envoyé aux logisticiens lors d\'une nouvelle requête', enabled: true, recipientProfiles: ['Logisticien', 'SuperAdmin'], recipientUsers: [], subject: '[FleetTrack] Nouvelle demande de mouvement : {{movementId}}', body: 'Bonjour,\n\nUne nouvelle demande de mouvement a été soumise par {{user}}.\n\nMerci de vous connecter pour la traiter.\n\nLien : {{link}}' },
    { id: 'log_validated', name: 'Validation Logistique', desc: 'Envoyé au valideur sécurité ou au demandeur si sécurité non requise', enabled: true, recipientProfiles: ['Superviseur Sécurité'], recipientUsers: [], subject: '[FleetTrack] Validation Logistique : {{movementId}}', body: 'Bonjour,\n\nLa demande de mouvement {{movementId}} a été validée par le pôle logistique.\nSi une validation sécurité est requise, merci de procéder à l\'examen.' },
    { id: 'sec_validated', name: 'Validation Sécurité', desc: 'Envoyé au pôle logistique pour confirmation finale', enabled: true, recipientProfiles: ['Logisticien'], recipientUsers: [], subject: '[FleetTrack] Validation Sécurité Accordée', body: 'Bonjour,\n\nLe département sécurité a validé la demande {{movementId}}.\nVous pouvez procéder à l\'assignation finale.' },
    { id: 'assigned', name: 'Chauffeur Assigné / Mouvement Confirmé', desc: 'Envoyé au demandeur et au chauffeur', enabled: true, recipientProfiles: [], recipientUsers: [], subject: '[FleetTrack] Mouvement Confirmé', body: 'Bonjour,\n\nVotre mouvement est confirmé.\nVéhicule : {{vehicleName}}\nChauffeur : {{driverName}}\n\nBonne route !' },
    { id: 'cancelled', name: 'Mouvement Annulé', desc: 'Envoyé aux parties prenantes en cas d\'annulation', enabled: true, recipientProfiles: ['Logisticien'], recipientUsers: [], subject: '[FleetTrack] Mouvement Annulé', body: 'Bonjour,\n\nLe mouvement {{movementId}} a été annulé.\n\nRaison : {{cancelReason}}' },
    { id: 'maintenance_alert', name: 'Alerte Maintenance', desc: 'Envoyé quand un véhicule approche de son échéance de maintenance', enabled: false, recipientProfiles: ['Logisticien'], recipientUsers: [], subject: '[FleetTrack] Alerte Maintenance : {{vehiclePlate}}', body: 'Bonjour,\n\nLe véhicule {{vehiclePlate}} nécessitera une maintenance sous peu.\n\nMerci de planifier son passage au garage.' }
  ];

  editingEmail: any = null;

  loadEmailSettings() {
    const key = this.getCurrentEmailContextKey();
    this.settingsService.getEmailSettings(key).subscribe(data => {
      if (data && data.length > 0) {
        this.emailNotifications = data;
      } else {
        // Reset to default objects if nothing saved for this context
        this.emailNotifications = [
          { id: 'req_created', name: 'Nouvelle demande de mouvement', desc: 'Envoyé aux logisticiens lors d\'une nouvelle requête', enabled: true, recipientProfiles: ['Logisticien', 'SuperAdmin'], recipientUsers: [], subject: '[FleetTrack] Nouvelle demande de mouvement : {{movementId}}', body: 'Bonjour,\n\nUne nouvelle demande de mouvement a été soumise par {{user}}.\n\nMerci de vous connecter pour la traiter.\n\nLien : {{link}}' },
          { id: 'log_validated', name: 'Validation Logistique', desc: 'Envoyé au valideur sécurité ou au demandeur si sécurité non requise', enabled: true, recipientProfiles: ['Superviseur Sécurité'], recipientUsers: [], subject: '[FleetTrack] Validation Logistique : {{movementId}}', body: 'Bonjour,\n\nLa demande de mouvement {{movementId}} a été validée par le pôle logistique.\nSi une validation sécurité est requise, merci de procéder à l\'examen.' },
          { id: 'sec_validated', name: 'Validation Sécurité', desc: 'Envoyé au pôle logistique pour confirmation finale', enabled: true, recipientProfiles: ['Logisticien'], recipientUsers: [], subject: '[FleetTrack] Validation Sécurité Accordée', body: 'Bonjour,\n\nLe département sécurité a validé la demande {{movementId}}.\nVous pouvez procéder à l\'assignation finale.' },
          { id: 'assigned', name: 'Chauffeur Assigné / Mouvement Confirmé', desc: 'Envoyé au demandeur et au chauffeur', enabled: true, recipientProfiles: [], recipientUsers: [], subject: '[FleetTrack] Mouvement Confirmé', body: 'Bonjour,\n\nVotre mouvement est confirmé.\nVéhicule : {{vehicleName}}\nChauffeur : {{driverName}}\n\nBonne route !' },
          { id: 'cancelled', name: 'Mouvement Annulé', desc: 'Envoyé aux parties prenantes en cas d\'annulation', enabled: true, recipientProfiles: ['Logisticien'], recipientUsers: [], subject: '[FleetTrack] Mouvement Annulé', body: 'Bonjour,\n\nLe mouvement {{movementId}} a été annulé.\n\nRaison : {{cancelReason}}' },
          { id: 'maintenance_alert', name: 'Alerte Maintenance', desc: 'Envoyé quand un véhicule approche de son échéance de maintenance', enabled: false, recipientProfiles: ['Logisticien'], recipientUsers: [], subject: '[FleetTrack] Alerte Maintenance : {{vehiclePlate}}', body: 'Bonjour,\n\nLe véhicule {{vehiclePlate}} nécessitera une maintenance sous peu.\n\nMerci de planifier son passage au garage.' }
        ];
      }
    });
  }

  editEmailTemplate(email: any) {
    // Si on clique sur le même, on le referme. Sinon on l'ouvre.
    this.editingEmail = this.editingEmail === email ? null : email;
  }

  saveEmailSettings() {
    const key = this.getCurrentEmailContextKey();
    this.settingsService.saveEmailSettings(this.emailNotifications, key).subscribe({
      next: () => {
        this.editingEmail = null;
        this.snackBar.open('Paramètres d\'emails et templates sauvegardés', 'OK', { duration: 2000 });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur de sauvegarde', 'Fermer');
      }
    });
  }
}
// Triggering Vercel build to fix cache
