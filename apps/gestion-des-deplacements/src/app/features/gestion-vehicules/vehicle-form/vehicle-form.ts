import { Component, OnInit, inject } from '@angular/core';

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
import { VehiculeService } from '../../../core/services/vehicule.service';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
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
  private vehiculeService = inject(VehiculeService);
  private settingsService = inject(SettingsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  vehicleForm!: FormGroup;
  isEditMode = false;
  vehicleId: string | null = null;
  vehicleTypes: string[] = [];

  ngOnInit() {
    this.loadVehicleTypes();

    this.vehicleForm = this.fb.group({
      // Identification
      immatriculation: ['', Validators.required],
      marque: ['', Validators.required],
      modele: ['', Validators.required],
      acfCode: [''],
      base: [''],

      // Classification
      owner: ['Interne', Validators.required],
      category: ['Voiture', Validators.required],
      type: [''],
      fuelType: ['Diesel', Validators.required],

      // Details
      year: [null],
      startDate: [null],
      capacitePassagers: [1, [Validators.required, Validators.min(1)]],
      kilometrageInitial: [0, Validators.min(0)],

      // Données environnementales
      emissionsCO2: this.fb.group({
        valeur: [null, Validators.min(0)],
        source: ['Constructeur'],
      }),
      consommation: this.fb.group({
        valeur: [null, Validators.min(0)],
        source: ['Constructeur'],
        dateTest: [null],
      }),

      // Costs (Interne)
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

    this.route.paramMap.subscribe((params) => {
      this.vehicleId = params.get('id');
      if (this.vehicleId) {
        this.isEditMode = true;
        this.loadVehicle(this.vehicleId);
      }
    });
  }

  loadVehicleTypes() {
    this.settingsService.getVehicleTypes().subscribe((types) => (this.vehicleTypes = types || []));
  }

  loadVehicle(id: string) {
    this.vehiculeService.getVehiculeById(id).subscribe((vehicle) => {
      if (vehicle) {
        this.vehicleForm.patchValue(vehicle);
      }
    });
  }

  saveVehicle() {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    const vehicleData = this.vehicleForm.value;

    if (this.isEditMode && this.vehicleId) {
      this.vehiculeService.updateVehicule(this.vehicleId, vehicleData).subscribe(() => {
        this.router.navigate(['/fleet']);
      });
    } else {
      this.vehiculeService.addVehicule(vehicleData).subscribe(() => {
        this.router.navigate(['/fleet']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/fleet']);
  }
}
