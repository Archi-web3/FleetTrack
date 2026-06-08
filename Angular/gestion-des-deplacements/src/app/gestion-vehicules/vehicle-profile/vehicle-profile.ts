import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VehiculeService } from '../../vehicule.service';
import { LogbookService } from '../../logbook.service';
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
    CommonModule, RouterModule, MatTabsModule, MatCardModule, 
    MatIconModule, MatButtonModule, MatDividerModule, MatTableModule, 
    MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, TranslateModule
  ],
  templateUrl: './vehicle-profile.html',
  styleUrls: ['./vehicle-profile.scss']
})
export class VehicleProfileComponent implements OnInit {
  vehicle: any = null;
  loading: boolean = true;
  @ViewChild('maintenanceModal') maintenanceModal!: TemplateRef<any>;

  newMaintenance: any = {
    date: new Date().toISOString().split('T')[0],
    type: 'Preventive',
    mileage: null,
    garage: '',
    cost: null,
    comments: ''
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

  constructor(
    private route: ActivatedRoute,
    private vehiculeService: VehiculeService,
    private logbookService: LogbookService,
    private dialog: MatDialog
  ) {}

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
      }
    });
  }

  loadAdditionalData(id: string): void {
    forkJoin({
      checks: this.vehiculeService.getVehicleWeeklyChecklists(id),
      maintenances: this.vehiculeService.getVehicleMaintenances(id),
      fuels: this.vehiculeService.getVehicleFuels(id),
      incidents: this.vehiculeService.getVehicleIncidents(id),
      trips: this.vehiculeService.getVehicleTrips(id)
    }).subscribe({
      next: (results) => {
        this.routineChecks = results.checks || [];
        this.maintenances = results.maintenances || [];
        this.fuels = results.fuels || [];
        this.incidents = results.incidents || [];
        
        const allTrips = results.trips || [];
        this.logbookTrips = allTrips.filter(t => t.statut === 'terminé');
        this.tripRequests = allTrips.filter(t => t.statut !== 'terminé');
      },
      error: (err) => {
        console.error('Error loading vehicle additional data:', err);
      }
    });
  }

  openAddMaintenanceModal(): void {
    this.newMaintenance = {
      vehicule: this.vehicle._id,
      date: new Date().toISOString().split('T')[0],
      type: 'Preventive',
      mileage: this.vehicle.kilometrage || null,
      garage: '',
      cost: null,
      comments: ''
    };
    this.dialog.open(this.maintenanceModal, { width: '500px' });
  }

  saveMaintenance(): void {
    this.logbookService.addMaintenance(this.newMaintenance).subscribe({
      next: (res) => {
        this.maintenances = [res, ...this.maintenances]; // Add to table
        this.dialog.closeAll();
      },
      error: (err) => console.error('Error adding maintenance', err)
    });
  }
}
