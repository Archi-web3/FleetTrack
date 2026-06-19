import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MaintenanceTrackingService } from '../maintenance-tracking.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-service-validation-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './service-validation-dialog.component.html',
  styleUrls: ['./service-validation-dialog.component.scss']
})
export class ServiceValidationDialogComponent implements OnInit {
  vehicule: any;
  service: any = null;
  loading: boolean = true;
  saving: boolean = false;
  certificationCochee: boolean = false;
  tachesInitialesStr: string = '';

  constructor(
    public dialogRef: MatDialogRef<ServiceValidationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private trackingService: MaintenanceTrackingService
  ) {
    this.vehicule = data.vehicule;
  }

  ngOnInit(): void {
    this.loadServiceData();
  }

  loadServiceData() {
    this.loading = true;
    this.trackingService.getNextService(this.vehicule._id).subscribe({
      next: (serviceData) => {
        this.service = serviceData;
        this.tachesInitialesStr = JSON.stringify(this.service.taches);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement service', err);
        this.loading = false;
      }
    });
  }

  get toutesTachesValidees(): boolean {
    if (!this.service || !this.service.taches || this.service.taches.length === 0) return true; // Si pas de tâches, on permet de valider
    return this.service.taches.every((t: any) => t.validee);
  }

  get canValidate(): boolean {
    return this.toutesTachesValidees && this.certificationCochee && !this.saving;
  }

  async validateService() {
    if (!this.canValidate || !this.service) return;
    this.saving = true;

    try {
      // 1. D'abord sauvegarder les tâches si elles ont été modifiées
      const currentTachesStr = JSON.stringify(this.service.taches);
      if (currentTachesStr !== this.tachesInitialesStr) {
        await this.trackingService.updateServiceTasks(this.service._id, this.service.taches).toPromise();
      }

      // 2. Valider le service complet
      await this.trackingService.completeService(this.service._id, 'WEB_CERTIFICATION').toPromise();
      
      this.dialogRef.close(true);
    } catch (err) {
      console.error('Erreur lors de la validation du service:', err);
      alert('Une erreur est survenue lors de la validation du service.');
    } finally {
      this.saving = false;
    }
  }

  toggleAllTasks(checked: boolean) {
    if (this.service && this.service.taches) {
      this.service.taches.forEach((t: any) => t.validee = checked);
    }
  }
}
