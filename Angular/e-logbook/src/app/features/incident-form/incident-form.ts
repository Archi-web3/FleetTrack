import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { OfflineService, Incident } from '../../core/services/offline.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule
  ],
  templateUrl: './incident-form.html',
  styleUrls: ['./incident-form.scss']
})
export class IncidentFormComponent {
  incidentType: string = 'Panne';
  severity: string = 'Faible';
  description: string = '';
  cost: number | undefined;

  vehicleId: string = '';

  constructor(
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

  async saveIncident() {
    if (!this.incidentType || !this.description) return;

    const currentUser = this.authService.getCurrentUser();
    const driverId = currentUser ? currentUser._id : 'mock-driver-id';

    const incident: Incident = {
      vehicleId: this.vehicleId,
      driverId: driverId,
      date: new Date(),
      type: this.incidentType,
      severity: this.severity,
      description: this.description,
      cost: this.cost,
      synced: 0
    };

    console.log('Saving incident:', incident);
    await this.offlineService.addIncident(incident);
    console.log('Incident saved successfully');
    this.router.navigate(['/trip-list']);
  }

  cancel() {
    this.router.navigate(['/trip-list']);
  }
}
