import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OfflineService, Fuel } from '../../core/services/offline.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-fuel-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './fuel-form.html',
  styleUrls: ['./fuel-form.scss']
})
export class FuelFormComponent implements OnInit {
  fuelForm!: FormGroup;
  vehicleId: string = '';
  lastMileage: number = 0;

  constructor(
    private fb: FormBuilder,
    private offlineService: OfflineService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    const selectedVehicle = localStorage.getItem('selectedVehicle');
    if (selectedVehicle) {
      this.vehicleId = JSON.parse(selectedVehicle)._id;
    } else {
      this.router.navigate(['/vehicle-selector']);
    }
  }

  async ngOnInit() {
    // Initialize form IMMEDIATELY (synchronously)
    this.fuelForm = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(0.1)]],
      mileage: [null, [Validators.required, Validators.min(0)], [this.mileageValidator.bind(this)]],
      fuelType: ['Diesel', Validators.required],
      source: ['Station Service', Validators.required],
      isFull: [true], // Default to full tank
      price: [null, Validators.min(0)]
    });

    // Then load async data
    try {
      // Get last mileage for validation
      this.lastMileage = await this.offlineService.getLastMileage(this.vehicleId);

      // Update form validation with loaded mileage
      this.fuelForm.get('mileage')?.updateValueAndValidity();
    } catch (error) {
      console.error('Error loading fuel data:', error);
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
          current: currentMileage
        }
      };
    }
    return null;
  }

  async saveFuel() {
    if (this.fuelForm.invalid) {
      this.fuelForm.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    const driverId = currentUser ? currentUser._id : 'mock-driver-id';

    const formValue = this.fuelForm.value;
    const fuel: Fuel = {
      vehicleId: this.vehicleId,
      driverId: driverId,
      date: new Date(),
      quantity: formValue.quantity,
      mileage: formValue.mileage,
      type: formValue.fuelType,
      source: formValue.source,
      isFull: formValue.isFull,
      price: formValue.price,
      synced: 0
    };

    console.log('Saving fuel:', fuel);
    await this.offlineService.addFuel(fuel);
    console.log('Fuel saved successfully');
    this.router.navigate(['/fuels']);
  }

  cancel() {
    this.router.navigate(['/fuels']);
  }

  // Helper to get error message for mileage
  getMileageError(): string {
    const control = this.fuelForm.get('mileage');
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
