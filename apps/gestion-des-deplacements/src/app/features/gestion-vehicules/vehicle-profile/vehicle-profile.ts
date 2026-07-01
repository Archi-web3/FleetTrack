import { Component, OnInit, ViewChild, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VehiculeService } from '../../../core/services/vehicule.service';
import { LogbookService } from '../../../core/services/logbook.service';
import { MaintenanceService, ServiceSchedule } from '../../../core/services/maintenance.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-vehicle-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
  ],
  templateUrl: './vehicle-profile.html',
  styleUrls: ['./vehicle-profile.scss'],
})
export class VehicleProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private vehiculeService = inject(VehiculeService);
  private logbookService = inject(LogbookService);
  private maintenanceService = inject(MaintenanceService);
  private dialog = inject(MatDialog);

  vehicle: any = null;
  loading = true;
  @ViewChild('maintenanceModal') maintenanceModal!: TemplateRef<any>;

  newMaintenance: any = {
    date: new Date().toISOString().split('T')[0],
    type: 'Preventive',
    mileage: null,
    garage: '',
    cost: null,
    comments: '',
  };

  // Tab Data Arrays
  routineChecks: any[] = [];
  maintenances: any[] = [];
  logbookTrips: any[] = [];
  tripRequests: any[] = [];
  fuels: any[] = [];
  incidents: any[] = [];

  // Table Columns
  routineColumns: string[] = ['semaine', 'chauffeur', 'tauxCompletion', 'dateCompletion'];
  maintenanceColumns: string[] = ['date', 'type', 'mileage', 'garage', 'cost'];
  logbookColumns: string[] = ['dateDepart', 'chauffeur', 'objectif', 'startMileage', 'endMileage'];
  tripRequestsColumns: string[] = ['dateDepart', 'chauffeur', 'objectif', 'statut'];
  fuelColumns: string[] = ['date', 'quantity', 'mileage', 'cost', 'consumption'];
  incidentColumns: string[] = ['date', 'type', 'severity', 'description'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVehicle(id);
      this.loadAdditionalData(id);
    }
  }

  loadVehicle(id: string): void {
    this.vehiculeService.getVehiculeById(id).subscribe({
      next: (data) => {
        this.vehicle = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading vehicle:', err);
        this.loading = false;
      },
    });
  }

  loadAdditionalData(id: string): void {
    forkJoin({
      checks: this.vehiculeService.getVehicleWeeklyChecklists(id),
      maintenances: this.vehiculeService.getVehicleMaintenances(id),
      fuels: this.vehiculeService.getVehicleFuels(id),
      incidents: this.vehiculeService.getVehicleIncidents(id),
      trips: this.vehiculeService.getVehicleTrips(id),
    }).subscribe({
      next: (results) => {
        this.routineChecks = results.checks || [];
        this.maintenances = results.maintenances || [];
        this.fuels = results.fuels || [];
        this.incidents = results.incidents || [];

        const allTrips = results.trips || [];
        this.logbookTrips = allTrips.filter((t) => t.statut === 'terminé');
        this.tripRequests = allTrips.filter((t) => t.statut !== 'terminé');
      },
      error: (err) => {
        console.error('Error loading vehicle additional data:', err);
      },
    });
  }

  scheduledService: ServiceSchedule | null = null;
  isLoadingNextService = false;
  availableTemplates: any[] = [];

  openAddMaintenanceModal(): void {
    this.newMaintenance = {
      vehicule: this.vehicle._id,
      date: new Date().toISOString().split('T')[0],
      type: '',
      mileage: this.vehicle.kilometrage || null,
      garage: '',
      cost: null,
      comments: '',
    };
    this.scheduledService = null;
    this.isLoadingNextService = true;

    // Fetch templates first
    this.maintenanceService.getTemplates().subscribe({
      next: (templates) => {
        this.availableTemplates = templates || [];

        // Fetch next scheduled service
        this.maintenanceService.getNextService(this.vehicle._id).subscribe({
          next: (service) => {
            if (service && service.typeService) {
              this.scheduledService = service;
              this.newMaintenance.type = `Service ${service.typeService}`;
              this.newMaintenance.mileage = service.kilometragePrevu;
            } else if (this.availableTemplates.length > 0) {
              this.newMaintenance.type = this.availableTemplates[0].nom;
            }
            this.isLoadingNextService = false;
            this.dialog.open(this.maintenanceModal, { width: '500px' });
          },
          error: (err) => {
            console.error('Erreur chargement prochain service', err);
            this.isLoadingNextService = false;
            this.dialog.open(this.maintenanceModal, { width: '500px' });
          },
        });
      },
      error: (err) => {
        console.error('Erreur chargement templates', err);
        this.isLoadingNextService = false;
        this.dialog.open(this.maintenanceModal, { width: '500px' });
      },
    });
  }

  saveMaintenance(): void {
    // 1. Ajouter la maintenance dans le carnet de bord
    this.logbookService.addMaintenance(this.newMaintenance).subscribe({
      next: (res) => {
        this.maintenances = [res, ...this.maintenances]; // Add to table

        // 2. Si on a validé le service planifié, on le marque comme complété
        if (
          this.scheduledService &&
          this.newMaintenance.type === `Service ${this.scheduledService.typeService}`
        ) {
          this.maintenanceService
            .completeService(
              this.scheduledService._id,
              'Validation Automatique (Dérogation Profil)',
            )
            .subscribe({
              next: () => {
                this.dialog.closeAll();
              },
              error: (err) => {
                console.error('Erreur validation du service planifié', err);
                this.dialog.closeAll();
              },
            });
        } else {
          this.dialog.closeAll();
        }
      },
      error: (err) => console.error('Error adding maintenance', err),
    });
  }
}
