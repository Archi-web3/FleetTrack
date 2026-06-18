import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from './core/services/auth.service';
import { SettingsService } from './core/services/settings.service';
import { PermissionsService } from './core/services/permissions.service';
// Imports pour Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CountrySelectorComponent } from './shared/components/country-selector/country-selector.component';
import { LanguageSelectorComponent } from './shared/components/language-selector/language-selector.component';
import { TranslateModule } from '@ngx-translate/core';

import { MatDialog } from '@angular/material/dialog';
import { DemandeMouvementComponent } from './features/demande-mouvement/demande-mouvement.component';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, MatTooltipModule, CountrySelectorComponent, LanguageSelectorComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'gestion-deplacements';
  isAuthenticated: boolean = false;
  userProfile: string | null = null;
  userName: string | null = null;
  brandSettings: any = {};
  userPays: string | null = null;
  userBase: string | null = null;

  constructor(
    private authService: AuthService, 
    private dialog: MatDialog, 
    private settingsService: SettingsService,
    private translate: TranslateService,
    public perms: PermissionsService
  ) {
    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
  }

  openNouvelleDemandeModal(): void {
    this.dialog.open(DemandeMouvementComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }

  ngOnInit(): void {
    

    this.settingsService.getBrandSettings().subscribe(settings => {
      if (settings) {
        this.brandSettings = settings;
        if (settings.primaryColor) {
          document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
        }
      }
    });


    this.authService.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
    });
    this.authService.userProfile$.subscribe(profile => {
      console.log('[AppComponent] Current Profile:', profile);
      this.userProfile = profile;
    });
    this.authService.userName$.subscribe(name => {
      this.userName = name;
    });
    this.authService.userPays$.subscribe(pays => {
      // Fix affichage trop long
      if (pays === 'République Démocratique du Congo') {
        this.userPays = 'RDC';
      } else if (pays === 'République Centrafricaine') {
        this.userPays = 'RCA';
      } else {
        this.userPays = pays;
      }
    });
    this.authService.userBase$.subscribe(base => this.userBase = base);
  }

  logout(): void {
    this.authService.logout();
  }
}
