import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogbookService } from '../../core/services/logbook.service';
import { VehiculeService } from '../../core/services/vehicule.service';
import { MouvementService } from '../../core/services/mouvement.service';
import { AuthService } from '../../core/services/auth.service';

import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MapMouvementsComponent } from '../map-mouvements/map-mouvements.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-logbook-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule, 
    MatTabsModule, 
    MatTooltipModule, 
    MapMouvementsComponent, 
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './logbook-dashboard.component.html',
  styleUrls: ['./logbook-dashboard.component.css']
})
export class LogbookDashboardComponent implements OnInit, AfterViewInit {
  vehicules: any[] = [];
  selectedVehiculeId: string | null = null;
  
  tripsDataSource = new MatTableDataSource<any>();
  fuelDataSource = new MatTableDataSource<any>();
  maintenanceDataSource = new MatTableDataSource<any>();
  incidentsDataSource = new MatTableDataSource<any>();

  @ViewChild('tripsPaginator') tripsPaginator!: MatPaginator;
  @ViewChild('tripsSort') tripsSort!: MatSort;
  
  @ViewChild('fuelPaginator') fuelPaginator!: MatPaginator;
  @ViewChild('fuelSort') fuelSort!: MatSort;
  
  @ViewChild('maintenancePaginator') maintenancePaginator!: MatPaginator;
  @ViewChild('maintenanceSort') maintenanceSort!: MatSort;
  
  @ViewChild('incidentsPaginator') incidentsPaginator!: MatPaginator;
  @ViewChild('incidentsSort') incidentsSort!: MatSort;

  @ViewChild('editDialog') editDialog!: TemplateRef<any>;

  displayedColumnsTrips: string[] = ['date', 'driver', 'objective', 'start', 'end', 'distance', 'photos', 'status', 'map', 'actions'];
  displayedColumnsFuel: string[] = ['date', 'driver', 'quantity', 'mileage', 'consumption', 'type', 'source', 'photos', 'actions'];
  displayedColumnsMaintenance: string[] = ['date', 'type', 'mileage', 'garage', 'cost', 'actions'];
  displayedColumnsIncidents: string[] = ['date', 'type', 'severity', 'description', 'location', 'photos', 'status', 'actions'];

  editingItem: any = null;
  editingType: string | null = null;
  selectedPhoto: string | null = null;
  showMapModal: boolean = false;
  mapMouvementsData: any[] = [];

  constructor(
    private vehiculeService: VehiculeService,
    private logbookService: LogbookService,
    private mouvementService: MouvementService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadVehicules();
  }

  ngAfterViewInit(): void {
    this.tripsDataSource.paginator = this.tripsPaginator;
    this.tripsDataSource.sort = this.tripsSort;
    
    this.fuelDataSource.paginator = this.fuelPaginator;
    this.fuelDataSource.sort = this.fuelSort;
    
    this.maintenanceDataSource.paginator = this.maintenancePaginator;
    this.maintenanceDataSource.sort = this.maintenanceSort;
    
    this.incidentsDataSource.paginator = this.incidentsPaginator;
    this.incidentsDataSource.sort = this.incidentsSort;
  }

  applyFilter(event: Event, dataSource: MatTableDataSource<any>) {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadVehicules(): void {
    this.vehiculeService.getVehicules().subscribe(data => {
      this.vehicules = data;
      if (this.vehicules.length > 0) {
        this.selectedVehiculeId = this.vehicules[0]._id;
        this.onVehiculeChange();
      }
    });
  }

  onVehiculeChange(): void {
    if (!this.selectedVehiculeId) return;
    this.loadData();
  }

  loadData(): void {
    if (!this.selectedVehiculeId) return;
    this.mouvementService.fixCountries().subscribe({
      next: () => this._loadVehicleData(),
      error: () => this._loadVehicleData()
    });
  }

  private _loadVehicleData(): void {
    if (!this.selectedVehiculeId) return;

    this.mouvementService.getMouvements().subscribe(allMouvements => {
      const trips = allMouvements.filter((m: any) => {
        const mVehiculeId = m.vehicule && m.vehicule._id ? m.vehicule._id : (typeof m.vehicule === 'string' ? m.vehicule : null);
        const matchVehicule = mVehiculeId === this.selectedVehiculeId;
        const allowedStatuses = ['terminé', 'pris en charge', 'en cours', 'validé', 'regroupé'];
        const matchStatut = allowedStatuses.includes(m.statut);
        if (m.type === 'maintenance') return false;
        return matchVehicule && matchStatut;
      });
      this.tripsDataSource.data = trips;
    });

    this.logbookService.getFuelsByVehicle(this.selectedVehiculeId).subscribe(data => this.fuelDataSource.data = data);
    this.logbookService.getMaintenancesByVehicle(this.selectedVehiculeId).subscribe(data => this.maintenanceDataSource.data = data);
    this.logbookService.getIncidentsByVehicle(this.selectedVehiculeId).subscribe(data => this.incidentsDataSource.data = data);
  }

  isAdmin(): boolean {
    return this.authService.getUserProfile() === 'Admin';
  }

  deleteItem(type: string, id: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    let observable;
    switch (type) {
      case 'fuel': observable = this.logbookService.deleteFuel(id); break;
      case 'maintenance': observable = this.logbookService.deleteMaintenance(id); break;
      case 'incident': observable = this.logbookService.deleteIncident(id); break;
      case 'trips': observable = this.mouvementService.deleteMouvement(id); break;
    }

    if (observable) {
      observable.subscribe(() => {
        this.loadData();
      }, err => console.error('Error deleting item:', err));
    }
  }

  editItem(type: string, item: any): void {
    this.editingType = type;
    this.editingItem = { ...item };
    this.dialog.open(this.editDialog, { width: '500px', panelClass: 'custom-dialog-container', maxWidth: '95vw', maxHeight: '90vh' });
  }

  cancelEdit(): void {
    this.editingItem = null;
    this.editingType = null;
    this.dialog.closeAll();
  }

  saveItem(): void {
    if (!this.editingItem || !this.editingType) return;

    let observable;
    switch (this.editingType) {
      case 'fuel': observable = this.logbookService.updateFuel(this.editingItem._id, this.editingItem); break;
      case 'maintenance': observable = this.logbookService.updateMaintenance(this.editingItem._id, this.editingItem); break;
      case 'incident': observable = this.logbookService.updateIncident(this.editingItem._id, this.editingItem); break;
    }

    if (observable) {
      observable.subscribe(() => {
        this.cancelEdit();
        this.loadData();
      }, err => console.error('Error updating item:', err));
    }
  }

  openPhotoModal(photoUrl: string): void {
    this.selectedPhoto = photoUrl;
  }

  closePhotoModal(): void {
    this.selectedPhoto = null;
  }

  openMap(trip: any): void {
    const getCoords = (lieu: any) => {
      if (!lieu || !lieu.coordonnees) return null;
      if (typeof lieu.coordonnees === 'string') {
        const parts = lieu.coordonnees.split(',').map((s: string) => parseFloat(s.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          return { lat: parts[0], lng: parts[1] };
        }
      } else if (lieu.coordonnees.latitude !== undefined && lieu.coordonnees.longitude !== undefined) {
        return { lat: parseFloat(lieu.coordonnees.latitude), lng: parseFloat(lieu.coordonnees.longitude) };
      } else if (lieu.coordonnees.lat !== undefined && lieu.coordonnees.lng !== undefined) {
        return { lat: parseFloat(lieu.coordonnees.lat), lng: parseFloat(lieu.coordonnees.lng) };
      }
      return null;
    };

    const stops = trip.stops && trip.stops.length > 0 ? trip.stops.map((s: any) => {
      const coords = getCoords(s.lieu);
      return {
        lieuId: s.lieu?._id || s.lieu,
        nom: s.lieu?.nom || 'Stop',
        adresse: s.lieu?.adresse || '',
        lat: coords ? coords.lat : (s.lat || 0),
        lng: coords ? coords.lng : (s.lng || 0),
        dateDepart: s.dateDepart,
        dateArrivee: s.dateArrivee
      };
    }) : [];

    this.mapMouvementsData = [{
      id: trip._id,
      title: trip.objectif || trip.purpose || 'Trajet',
      demandeur: trip.chauffeur?.prenom + ' ' + trip.chauffeur?.nom,
      stops: stops,
      gpsTrace: trip.gpsTrace,
      vehiculeName: trip.vehicule?.marque ? `${trip.vehicule.marque} ${trip.vehicule.modele}` : 'Véhicule',
      vehiculeCode: trip.vehicule?.immatriculation
    }];

    this.showMapModal = true;
  }

  openMapForIncident(incident: any): void {
    if (!incident.location || !incident.location.lat) return;

    this.mapMouvementsData = [{
      id: incident._id,
      title: `Incident: ${incident.type} (${incident.severity})`,
      demandeur: 'Incident Signalé',
      stops: [{
        lieuId: 'incident_loc',
        nom: incident.description || 'Lieu Incident',
        adresse: incident.location.address || 'Coordonnées GPS',
        lat: parseFloat(incident.location.lat),
        lng: parseFloat(incident.location.lng),
        dateArrivee: incident.date,
        isIncident: true
      }],
      gpsTrace: [],
      vehiculeName: 'Véhicule',
      vehiculeCode: ''
    }];
    this.showMapModal = true;
  }

  closeMapModal(): void {
    this.showMapModal = false;
    this.mapMouvementsData = [];
  }
}
