import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';

import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector.component';
import { SettingsService } from '../../core/services/settings.service';
import { BrandSettings } from '../../core/models/api.types';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    TranslateModule,
    LanguageSelectorComponent,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private settingsService = inject(SettingsService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  brandSettings: BrandSettings = {};

  ngOnInit() {
    this.settingsService.getBrandSettings().subscribe((settings) => {
      if (settings) {
        this.brandSettings = settings;
        this.cdr.detectChanges();
      }
    });
  }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Navigate to vehicle selector
        this.router.navigate(['/vehicle-selector']).then(
          (success) => {
            if (!success) {
              alert('Navigation échouée vers /vehicle-selector');
            }
          },
          (error) => {
            console.error('Navigation error:', error);
            alert('Erreur navigation: ' + JSON.stringify(error));
          },
        );
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        } else if (error.status === 0 || error.status === 504 || error.status === 503) {
          this.errorMessage =
            'Le serveur démarre 😴... Merci de patienter environ 30 secondes avant de réessayer.';
        } else {
          this.errorMessage =
            'Erreur de connexion : Le serveur est peut-être en veille. Réessayez dans 30s.';
        }
      },
      complete: () => {
        // Ensure loading is always reset
        this.isLoading = false;
      },
    });
  }
}
