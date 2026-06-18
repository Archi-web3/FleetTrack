import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.css']
})
export class PersonalInfoComponent implements OnInit {
  personalInfoForm!: FormGroup;
  userProfileLabel: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.userProfileLabel = this.authService.getUserProfile() || 'Utilisateur';

    this.personalInfoForm = this.fb.group({
      fullName: [this.authService.getUserName() || '', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: [''],
      language: ['Français', Validators.required],
      available: ['yes', Validators.required],
      bureauPays: [{value: this.authService.getUserPays() || '', disabled: true}],
      base: [{value: this.authService.getUserBase() || '', disabled: true}],
    });
  }

  onSubmit() {
    if (this.personalInfoForm.valid) {
      console.log('Saved Personal Info', this.personalInfoForm.getRawValue());
      alert('Informations personnelles mises à jour (Simulation).');
    }
  }
}

