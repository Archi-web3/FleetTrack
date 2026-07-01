import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UtilisateurService } from '../../../core/services/utilisateur.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.scss'],
})
export class ChangePasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private utilisateurService = inject(UtilisateurService);

  passwordForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  ngOnInit() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.passwordForm.invalid) return;

    this.successMessage = '';
    this.errorMessage = '';
    const val = this.passwordForm.value;

    if (val.newPassword !== val.confirmPassword) {
      this.errorMessage = 'Les nouveaux mots de passe ne correspondent pas.';
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'Erreur: Utilisateur non identifié.';
      return;
    }

    this.isLoading = true;
    this.utilisateurService.updateUser(userId, { motDePasse: val.newPassword }).subscribe({
      next: () => {
        this.successMessage = 'Mot de passe mis à jour avec succès.';
        this.passwordForm.reset();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du changement de mot de passe', err);
        this.errorMessage = 'Erreur lors de la mise à jour du mot de passe.';
        this.isLoading = false;
      },
    });
  }
}
