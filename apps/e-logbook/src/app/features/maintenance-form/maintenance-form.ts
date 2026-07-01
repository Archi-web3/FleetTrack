import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';

import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { OfflineService, Maintenance } from '../../core/services/offline.service';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-maintenance-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    TranslateModule,
  ],
  templateUrl: './maintenance-form.html',
  styleUrls: ['./maintenance-form.scss'],
})
export class MaintenanceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private offlineService = inject(OfflineService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  maintenanceForm!: FormGroup;
  vehicleId = '';
  lastMileage = 0;

  constructor() {
    const selectedVehicle = localStorage.getItem('selectedVehicle');
    if (selectedVehicle) {
      this.vehicleId = JSON.parse(selectedVehicle)._id;
    } else {
      this.router.navigate(['/vehicle-selector']);
    }
  }

  async ngOnInit() {
    // Initialize form IMMEDIATELY (synchronously)
    this.maintenanceForm = this.fb.group({
      maintenanceType: ['Révision', Validators.required],
      mileage: [null, [Validators.required, Validators.min(0)], [this.mileageValidator.bind(this)]],
      garage: [''],
      cost: [null, Validators.min(0)],
    });

    // Then load async data
    try {
      // Get last mileage for validation
      this.lastMileage = await this.offlineService.getLastMileage(this.vehicleId);

      // Update form validation with loaded mileage
      this.maintenanceForm.get('mileage')?.updateValueAndValidity();
    } catch (error) {
      console.error('Error loading maintenance data:', error);
    }
  }

  // Async validator for mileage
  async mileageValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    if (!control.value) return null;

    const currentMileage = control.value;
    if (currentMileage < this.lastMileage) {
      return {
        mileageTooLow: {
          lastMileage: this.lastMileage,
          current: currentMileage,
        },
      };
    }
    return null;
  }

  async saveMaintenance() {
    if (this.maintenanceForm.invalid) {
      this.maintenanceForm.markAllAsTouched();
      return;
    }

    const formValue = this.maintenanceForm.value;
    const maintenance: Maintenance = {
      vehicleId: this.vehicleId,
      date: new Date(),
      type: formValue.maintenanceType,
      mileage: formValue.mileage,
      garage: formValue.garage || undefined,
      cost: formValue.cost || undefined,
      synced: 0,
    };

    await this.offlineService.addMaintenance(maintenance);
    this.router.navigate(['/maintenances']);
  }

  cancel() {
    this.router.navigate(['/maintenances']);
  }

  // Helper to get error message for mileage
  getMileageError(): string {
    const control = this.maintenanceForm.get('mileage');
    if (control?.hasError('required')) {
      return 'Le kilométrage est requis';
    }
    if (control?.hasError('min')) {
      return 'Le kilométrage doit être positif';
    }
    if (control?.hasError('mileageTooLow')) {
      const error = control.getError('mileageTooLow');
      return `Le kilométrage ne peut pas être inférieur au dernier enregistré (${error.lastMileage} km)`;
    }
    return '';
  }
}
