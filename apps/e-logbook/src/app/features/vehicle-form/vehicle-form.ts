import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OfflineService, Vehicle } from '../../core/services/offline.service';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
  ],
  templateUrl: './vehicle-form.html',
  styleUrls: ['./vehicle-form.scss'],
})
export class VehicleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private offlineService = inject(OfflineService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  vehicleForm!: FormGroup;
  isEditMode = false;
  vehicleId: string | null = null;

  async ngOnInit() {
    this.vehicleForm = this.fb.group({
      // Identification
      immatriculation: ['', Validators.required],
      marque: ['', Validators.required],
      modele: ['', Validators.required],
      acfCode: [''],
      base: [''],

      // Classification
      owner: ['ACF', Validators.required],
      category: ['Voiture', Validators.required],
      type: [''],
      fuelType: ['Diesel', Validators.required],

      // Details
      year: [null],
      startDate: [null],
      capacitePassagers: [1, [Validators.required, Validators.min(1)]],
      initialMileage: [0, Validators.min(0)],

      // Costs (ACF)
      purchaseValue: [null],
      depreciationMonths: [null],
      insuranceCost: [null],
      insuranceEndDate: [null],

      // Costs (Location)
      rentalCost: [null],
      driverIncluded: [false],

      // Status
      enService: [true],
      remarks: [''],
    });

    this.route.paramMap.subscribe(async (params) => {
      this.vehicleId = params.get('id');
      if (this.vehicleId) {
        this.isEditMode = true;
        await this.loadVehicle(this.vehicleId);
      }
    });
  }

  async loadVehicle(id: string) {
    const vehicle = await this.offlineService.vehicles.get(id);
    if (vehicle) {
      this.vehicleForm.patchValue(vehicle);
    }
  }

  async saveVehicle() {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    const formValue = this.vehicleForm.value;

    // Prepare vehicle object
    const vehicleData: Partial<Vehicle> = {
      ...formValue,
      _id: this.isEditMode && this.vehicleId ? this.vehicleId : undefined,
    };

    if (this.isEditMode && this.vehicleId) {
      await this.offlineService.vehicles.update(this.vehicleId, vehicleData);
    } else {
      // For new vehicles, we rely on backend to generate _id during sync,
      // but locally we need a temporary ID if we want to use it immediately.
      // However, vehicles table uses string _id.
      // We might need to generate a temporary one or let the backend handle it.
      // Since we are syncing, let's generate a temp ID if needed or just add it.
      // Dexie 'vehicles' table uses '_id' as key.
      if (!vehicleData._id) {
        // Generate a temp ID for local storage
        vehicleData._id = 'temp_' + Date.now();
      }
      await this.offlineService.vehicles.add(vehicleData as Vehicle);
    }

    // Trigger sync (optional, but good for immediate update)
    // this.syncService.pushLocalChanges(); // We don't have SyncService injected here yet

    this.router.navigate(['/fleet']);
  }

  cancel() {
    this.router.navigate(['/fleet']);
  }
}
