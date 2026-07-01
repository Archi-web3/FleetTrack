import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [TranslateModule, CommonModule, ReactiveFormsModule],
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.scss'],
})
export class PersonalInfoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  personalInfoForm!: FormGroup;
  userProfileLabel = '';

  ngOnInit() {
    this.userProfileLabel = this.authService.getUserProfile() || 'Utilisateur';

    this.personalInfoForm = this.fb.group({
      fullName: [this.authService.getUserName() || '', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: [''],
      language: ['Français', Validators.required],
      available: ['yes', Validators.required],
      bureauPays: [{ value: this.authService.getUserPays() || '', disabled: true }],
      base: [{ value: this.authService.getUserBase() || '', disabled: true }],
    });
  }

  onSubmit() {
    if (this.personalInfoForm.valid) {
      alert('Informations personnelles mises à jour (Simulation).');
    }
  }
}
