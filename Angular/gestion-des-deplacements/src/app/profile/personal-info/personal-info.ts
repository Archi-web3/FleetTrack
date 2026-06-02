import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.css']
})
export class PersonalInfoComponent implements OnInit {
  personalInfoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.personalInfoForm = this.fb.group({
      fullName: ['Central Admin', Validators.required],
      email: ['superadmin@acf.org', [Validators.required, Validators.email]],
      mobileNo: ['', Validators.required],
      language: ['English', Validators.required],
      available: ['yes', Validators.required],
      division: [{value: '', disabled: true}],
      program: [{value: '', disabled: true}],
      country: [{value: '', disabled: true}],
      zone: [{value: '', disabled: true}],
      site: [{value: '', disabled: true}],
    });
  }

  onSubmit() {
    if (this.personalInfoForm.valid) {
      console.log('Saved Personal Info', this.personalInfoForm.value);
    }
  }
}

