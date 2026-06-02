import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-notification-preferences',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notification-preferences.html',
  styleUrls: ['./notification-preferences.css']
})
export class NotificationPreferencesComponent implements OnInit {
  notifForm!: FormGroup;
  
  // For the frequency selection
  frequencyOptions = ['Every day', 'Every 2 days', 'Once a week'];
  selectedFrequency = 'Every day';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.notifForm = this.fb.group({
      tripStatusUpdates: [true],
      newRequestToValidate: [true],
      pendingValidationReminder: [true],
      tripAssignment: [true],
      tripStartingReminder: [false]
    });
  }

  setFrequency(freq: string) {
    this.selectedFrequency = freq;
  }

  savePreferences() {
    console.log('Saved Preferences:', {
      ...this.notifForm.value,
      reminderFrequency: this.selectedFrequency
    });
  }
}

