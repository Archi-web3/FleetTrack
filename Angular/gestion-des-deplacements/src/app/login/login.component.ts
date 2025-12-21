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

@Component({
  selector: 'app-login',
  standalone: true, // <<< DOIT ÊTRE TRUE
  imports: [CommonModule, FormsModule, MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    motDePasse: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.authService.login(this.credentials).subscribe(
      (res) => {
        console.log('Connexion réussie', res);
        this.router.navigate(['/']); // Rediriger vers la page d'accueil après connexion
      },
      (error) => {
        console.error('Erreur de connexion', error);
        alert('Échec de la connexion. Vérifiez vos identifiants.');
      }
    );
  }
}
