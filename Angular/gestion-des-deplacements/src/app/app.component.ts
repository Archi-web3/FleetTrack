import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service';
// Imports pour Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CountrySelectorComponent } from './country-selector/country-selector.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, CountrySelectorComponent, LanguageSelectorComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'gestion-deplacements';
  isAuthenticated: boolean = false;
  userProfile: string | null = null;
  userName: string | null = null;
  userPays: string | null = null;
  userBase: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
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
