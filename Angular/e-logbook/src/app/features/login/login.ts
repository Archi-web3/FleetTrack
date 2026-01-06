import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('Attempting login with:', this.email);

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        console.log('Token stored:', localStorage.getItem('token'));
        this.isLoading = false;
        // Navigate to vehicle selector
        this.router.navigate(['/vehicle-selector']).then(
          success => {
            console.log('Navigation success:', success);
            if (!success) {
              alert('Navigation échouée vers /vehicle-selector');
            }
          },
          error => {
            console.error('Navigation error:', error);
            alert('Erreur navigation: ' + JSON.stringify(error));
          }
        );
      },
      error: (error) => {
        console.error('Login error:', error);
        alert('Erreur login: ' + error.message);
        this.errorMessage = 'Email ou mot de passe incorrect';
        this.isLoading = false;
      },
      complete: () => {
        // Ensure loading is always reset
        this.isLoading = false;
      }
    });
  }
}
