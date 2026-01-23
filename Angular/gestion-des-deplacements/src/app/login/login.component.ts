import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../auth.service'; // Note: auth.service.ts
import { Router } from '@angular/router';

// Imports Angular Material
import { MatCardModule } from '@angular/material/card'; // Pour la carte du formulaire
import { MatFormFieldModule } from '@angular/material/form-field'; // Pour les champs de formulaire
import { MatInputModule } from '@angular/material/input'; // Pour les inputs
import { MatButtonModule } from '@angular/material/button'; // Pour le bouton de soumission

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true, // <<< DOIT ÊTRE TRUE
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressBarModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    motDePasse: ''
  };

  isLoading = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.isLoading = true;
    this.errorMessage = null;
    console.log('[Login] Tentative de connexion pour:', this.credentials.email);

    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        console.log('[Login] Connexion réussie', res);
        this.isLoading = false;
        this.router.navigate(['/']); // Rediriger vers la page d'accueil après connexion
      },
      error: (error) => {
        console.error('[Login] Erreur de connexion', error);
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        } else if (error.status === 0 || error.status === 504) {
          this.errorMessage = 'Le serveur est en cours de réveil (Cold Start). Veuillez réessayer dans quelques secondes...';
        } else {
          this.errorMessage = 'Une erreur technique est survenue. Veuillez réessayer.';
        }
      }
    });
  }
}
