import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { OfflineService, Trip, Lieu, User } from '../../core/services/offline.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-active-trip',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule
  ],
  templateUrl: './active-trip.html',
  styleUrls: ['./active-trip.scss']
})
export class ActiveTripComponent implements OnInit {
  tripStarted = false;
  startTime: Date | null = null;
  vehicleId: string = '';
  lastMileage: number = 0;
  plannedMovementId: string | undefined;

  // Forms
  startForm!: FormGroup;
  endForm!: FormGroup;

  // ... (Constructor and ngOnInit)



  // Reference data
  lieux: Lieu[] = [];
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private offlineService: OfflineService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    // Get selected vehicle from localStorage
    const selectedVehicle = localStorage.getItem('selectedVehicle');
    if (selectedVehicle) {
      this.vehicleId = JSON.parse(selectedVehicle)._id;
    } else {
      // If no vehicle selected, redirect to vehicle selector
      this.router.navigate(['/vehicle-selector']);
    }
  }

  async ngOnInit() {
    console.log('ActiveTripComponent initialized');

    // Initialize forms IMMEDIATELY (synchronously) to prevent NG01052 error
    this.startForm = this.fb.group({
      startMileage: [null, [Validators.required, Validators.min(0)], [this.startMileageValidator.bind(this)]],
      purpose: ['', Validators.required],
      departurePlaceId: ['', Validators.required],
      passengerIds: [[]]
    });

    this.endForm = this.fb.group({
      endMileage: [null, [Validators.required, Validators.min(0)], [this.endMileageValidator.bind(this)]],
      arrivalPlaceId: ['', Validators.required]
    });

    // Then load async data
    try {
      // Get last mileage for validation
      this.lastMileage = await this.offlineService.getLastMileage(this.vehicleId);

      // Update form validation with loaded mileage
      this.startForm.get('startMileage')?.updateValueAndValidity();

      this.lieux = await this.offlineService.lieux.toArray();
      console.log('Lieux loaded from Dexie:', this.lieux);

      this.users = await this.offlineService.users.toArray();
      console.log('Users loaded from Dexie:', this.users);

      // Check if we have a planned movement from navigation state
      const navigation = this.router.getCurrentNavigation();
      const plannedMovement = navigation?.extras?.state?.['plannedMovement'] ||
        (history.state?.plannedMovement);

      if (plannedMovement) {
        console.log('Pre-filling from planned movement:', plannedMovement);
        this.plannedMovementId = plannedMovement._id || plannedMovement.id; // Capture ID
        this.preFillFromPlannedMovement(plannedMovement);
      }
    } catch (error) {
      console.error('Error loading reference data:', error);
    }
  }

  preFillFromPlannedMovement(movement: any) {
    // Pre-fill start form
    if (movement.objectif) {
      this.startForm.patchValue({
        purpose: movement.objectif
      });
    }

    if (movement.stops && movement.stops.length > 0) {
      // Departure place (first stop)
      const departurePlace = movement.stops[0].lieu;
      if (departurePlace) {
        this.startForm.patchValue({
          departurePlaceId: departurePlace._id || departurePlace
        });
      }

      // Arrival place (last stop)
      const arrivalPlace = movement.stops[movement.stops.length - 1].lieu;
      if (arrivalPlace) {
        this.endForm.patchValue({
          arrivalPlaceId: arrivalPlace._id || arrivalPlace
        });
      }
    }

    // Pre-fill passengers
    if (movement.passagers && movement.passagers.length > 0) {
      const passengerIds = movement.passagers.map((p: any) => p._id || p);
      this.startForm.patchValue({
        passengerIds: passengerIds
      });
    }

    console.log('Form pre-filled with planned movement data');
  }

  // Async validator for start mileage
  async startMileageValidator(control: AbstractControl): Promise<ValidationErrors | null> {
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

  // Async validator for end mileage
  async endMileageValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    if (!control.value) return null;

    const endMileage = control.value;
    const startMileage = this.startForm?.get('startMileage')?.value;

    // Check if end mileage is less than last recorded
    if (endMileage < this.lastMileage) {
      return {
        mileageTooLow: {
          lastMileage: this.lastMileage,
          current: endMileage
        }
      };
    }

    // Check if end mileage is less than start mileage
    if (startMileage && endMileage < startMileage) {
      return {
        endLessThanStart: {
          startMileage: startMileage,
          endMileage: endMileage
        }
      };
    }

    return null;
  }

  startTrip() {
    if (this.startForm.invalid) {
      this.startForm.markAllAsTouched();
      return;
    }

    this.tripStarted = true;
    this.startTime = new Date();
  }

  async stopTrip() {
    if (this.endForm.invalid) {
      this.endForm.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    const driverId = currentUser ? (currentUser._id || currentUser.id) : 'mock-driver-id';

    if (!driverId) {
      console.error('Driver ID not found in current user:', currentUser);
      alert('Erreur: Impossible d\'identifier le chauffeur. Veuillez vous reconnecter.');
      return;
    }

    const startFormValue = this.startForm.value;
    const endFormValue = this.endForm.value;

    const trip: Trip = {
      vehicleId: this.vehicleId,
      driverId: driverId,
      startDateTime: this.startTime!,
      endDateTime: new Date(),
      startMileage: startFormValue.startMileage,
      endMileage: endFormValue.endMileage,
      purpose: startFormValue.purpose,
      departurePlaceId: startFormValue.departurePlaceId,
      arrivalPlaceId: endFormValue.arrivalPlaceId,
      passengerIds: startFormValue.passengerIds,
      synced: 0,
      plannedMovementId: this.plannedMovementId // Include plannedMovementId if present
    };

    console.log('Saving trip:', trip);
    await this.offlineService.addTrip(trip);
    console.log('Trip saved successfully');
    this.router.navigate(['/trip-list']);
  }

  cancel() {
    this.router.navigate(['/trip-list']);
  }

  // Helper to get error message for start mileage
  getStartMileageError(): string {
    const control = this.startForm.get('startMileage');
    if (control?.hasError('required')) {
      return 'Le kilométrage de départ est requis';
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

  // Helper to get error message for end mileage
  getEndMileageError(): string {
    const control = this.endForm.get('endMileage');
    if (control?.hasError('required')) {
      return 'Le kilométrage d\'arrivée est requis';
    }
    if (control?.hasError('min')) {
      return 'Le kilométrage doit être positif';
    }
    if (control?.hasError('mileageTooLow')) {
      const error = control.getError('mileageTooLow');
      return `Le kilométrage ne peut pas être inférieur au dernier enregistré (${error.lastMileage} km)`;
    }
    if (control?.hasError('endLessThanStart')) {
      const error = control.getError('endLessThanStart');
      return `Le kilométrage d'arrivée (${error.endMileage} km) doit être supérieur au kilométrage de départ (${error.startMileage} km)`;
    }
    return '';
  }
}
