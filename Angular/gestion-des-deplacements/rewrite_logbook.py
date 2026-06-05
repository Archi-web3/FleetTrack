ts_content = """import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogbookService } from '../logbook.service';
import { VehiculeService } from '../vehicule.service';
import { MouvementService } from '../mouvement.service';
import { AuthService } from '../auth.service';

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
"""

html_content = """<div class="page-header-actions" style="margin-bottom: 20px; display: flex; flex-direction: column; align-items: flex-start; gap: 15px;">
  <h2 style="margin: 0; display: flex; align-items: center; gap: 10px;">
    <mat-icon style="color: var(--primary-color);">book</mat-icon>
    {{ 'LOGBOOK.DASHBOARD.TITLE' | translate }}
  </h2>

  <mat-form-field appearance="outline" style="width: 300px;">
    <mat-label>{{ 'LOGBOOK.DASHBOARD.SELECT_VEHICLE' | translate }}</mat-label>
    <mat-select [(ngModel)]="selectedVehiculeId" (selectionChange)="onVehiculeChange()">
      <mat-option *ngFor="let v of vehicules" [value]="v._id">
        {{ v.marque }} {{ v.modele }} - {{ v.immatriculation }}
      </mat-option>
    </mat-select>
  </mat-form-field>
</div>

<mat-tab-group animationDuration="0ms" class="custom-tab-group">

  <!-- TRIPS TAB -->
  <mat-tab [label]="'LOGBOOK.TABS.TRIPS' | translate">
    <div class="table-container" style="margin-top: 20px; box-shadow: none;">
      <div class="table-header-container" style="justify-content: space-between;">
        <h3 style="margin: 0; color: #4b5563;">{{ 'LOGBOOK.TRIPS.TITLE' | translate }}</h3>
        <div class="custom-search-input">
          <mat-icon>search</mat-icon>
          <input type="text" (keyup)="applyFilter($event, tripsDataSource)" placeholder="Rechercher...">
        </div>
      </div>

      <div class="table-responsive">
        <table mat-table [dataSource]="tripsDataSource" matSort style="width: 100%;">
          
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.TRIPS.DATE' | translate }}</th>
            <td mat-cell *matCellDef="let row"><strong>{{ row.realDepartureTime | date:'short' }}</strong></td>
          </ng-container>

          <ng-container matColumnDef="driver">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.TRIPS.DRIVER' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.chauffeur?.prenom }} {{ row.chauffeur?.nom }}</td>
          </ng-container>

          <ng-container matColumnDef="objective">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.TRIPS.OBJECTIVE' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.objectif }}</td>
          </ng-container>

          <ng-container matColumnDef="start">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.TRIPS.KM_START' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.startMileage }}</td>
          </ng-container>

          <ng-container matColumnDef="end">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.TRIPS.KM_END' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.endMileage }}</td>
          </ng-container>

          <ng-container matColumnDef="distance">
            <th mat-header-cell *matHeaderCellDef>Distance</th>
            <td mat-cell *matCellDef="let row"><strong>{{ (row.endMileage - row.startMileage) | number }} km</strong></td>
          </ng-container>

          <ng-container matColumnDef="photos">
            <th mat-header-cell *matHeaderCellDef>{{ 'LOGBOOK.TRIPS.PHOTOS' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <div class="photo-thumbnails" *ngIf="row.photos?.length > 0">
                <img *ngFor="let p of row.photos" [src]="p.url || p" class="thumbnail" (click)="openPhotoModal(p.url || p)">
              </div>
              <span *ngIf="!row.photos?.length" class="no-photos" style="color: #9ca3af;">{{ 'LOGBOOK.TRIPS.NO_PHOTO' | translate }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.TRIPS.STATUS' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <span class="status-badge status-success">{{ row.statut }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="map">
            <th mat-header-cell *matHeaderCellDef>{{ 'LOGBOOK.TRIPS.MAP' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button color="primary" (click)="openMap(row)" matTooltip="Voir le trajet">
                <mat-icon>map</mat-icon>
              </button>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>{{ 'LOGBOOK.TRIPS.ACTIONS' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <button *ngIf="isAdmin()" mat-icon-button color="warn" (click)="deleteItem('trips', row._id)" matTooltip="Supprimer">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumnsTrips"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumnsTrips;"></tr>
        </table>
      </div>
      <mat-paginator #tripsPaginator [pageSizeOptions]="[10, 25]" showFirstLastButtons></mat-paginator>
    </div>
  </mat-tab>

  <!-- FUEL TAB -->
  <mat-tab [label]="'LOGBOOK.TABS.FUEL' | translate">
    <div class="table-container" style="margin-top: 20px; box-shadow: none;">
      <div class="table-header-container" style="justify-content: space-between;">
        <h3 style="margin: 0; color: #4b5563;">{{ 'LOGBOOK.FUEL.TITLE' | translate }}</h3>
        <div class="custom-search-input">
          <mat-icon>search</mat-icon>
          <input type="text" (keyup)="applyFilter($event, fuelDataSource)" placeholder="Rechercher...">
        </div>
      </div>

      <div class="table-responsive">
        <table mat-table [dataSource]="fuelDataSource" matSort style="width: 100%;">

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.FUEL.DATE' | translate }}</th>
            <td mat-cell *matCellDef="let row"><strong>{{ row.date | date:'short' }}</strong></td>
          </ng-container>

          <ng-container matColumnDef="driver">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.FUEL.DRIVER' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.chauffeur?.prenom }} {{ row.chauffeur?.nom }}</td>
          </ng-container>

          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.FUEL.QUANTITY' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.quantity }} L</td>
          </ng-container>

          <ng-container matColumnDef="mileage">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.FUEL.MILEAGE' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.mileage }} km</td>
          </ng-container>

          <ng-container matColumnDef="consumption">
            <th mat-header-cell *matHeaderCellDef>Conso</th>
            <td mat-cell *matCellDef="let row">
              <span *ngIf="row.calculatedConsumption">
                {{ row.calculatedConsumption }} L/100
                <mat-icon *ngIf="row.isOverConsumption" style="color: #f44336; font-size: 16px; margin-left: 5px; vertical-align: middle;" matTooltip="Surconsommation détectée">warning</mat-icon>
              </span>
              <span *ngIf="!row.calculatedConsumption">-</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.FUEL.TYPE' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.fuelType }}</td>
          </ng-container>

          <ng-container matColumnDef="source">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.FUEL.SOURCE' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.source }}</td>
          </ng-container>

          <ng-container matColumnDef="photos">
            <th mat-header-cell *matHeaderCellDef>{{ 'LOGBOOK.FUEL.PHOTOS' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <div class="photo-thumbnails" *ngIf="row.photos?.length > 0">
                <img *ngFor="let p of row.photos" [src]="p.url || p" class="thumbnail" (click)="openPhotoModal(p.url || p)">
              </div>
              <span *ngIf="!row.photos?.length" class="no-photos" style="color: #9ca3af;">{{ 'LOGBOOK.TRIPS.NO_PHOTO' | translate }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>{{ 'LOGBOOK.FUEL.ACTIONS' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <div class="action-buttons" *ngIf="isAdmin()">
                <button mat-icon-button color="primary" (click)="editItem('fuel', row)" matTooltip="Modifier"><mat-icon>edit</mat-icon></button>
                <button mat-icon-button color="warn" (click)="deleteItem('fuel', row._id)" matTooltip="Supprimer"><mat-icon>delete</mat-icon></button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumnsFuel"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumnsFuel;"></tr>
        </table>
      </div>
      <mat-paginator #fuelPaginator [pageSizeOptions]="[10, 25]" showFirstLastButtons></mat-paginator>
    </div>
  </mat-tab>

  <!-- MAINTENANCE TAB -->
  <mat-tab [label]="'LOGBOOK.TABS.MAINTENANCE' | translate">
    <div class="table-container" style="margin-top: 20px; box-shadow: none;">
      <div class="table-header-container" style="justify-content: space-between;">
        <h3 style="margin: 0; color: #4b5563;">{{ 'LOGBOOK.MAINTENANCE.TITLE' | translate }}</h3>
        <div class="custom-search-input">
          <mat-icon>search</mat-icon>
          <input type="text" (keyup)="applyFilter($event, maintenanceDataSource)" placeholder="Rechercher...">
        </div>
      </div>

      <div class="table-responsive">
        <table mat-table [dataSource]="maintenanceDataSource" matSort style="width: 100%;">

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.MAINTENANCE.DATE' | translate }}</th>
            <td mat-cell *matCellDef="let row"><strong>{{ row.date | date:'short' }}</strong></td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.MAINTENANCE.TYPE' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <span style="background-color: #f3e8ff; color: #7e22ce; padding: 4px 8px; border-radius: 4px; font-weight: 500; font-size: 12px;">{{ row.type }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="mileage">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.MAINTENANCE.MILEAGE' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.mileage }} km</td>
          </ng-container>

          <ng-container matColumnDef="garage">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.MAINTENANCE.GARAGE' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.garage || ('LOGBOOK.MAINTENANCE.INTERNAL' | translate) }}</td>
          </ng-container>

          <ng-container matColumnDef="cost">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.MAINTENANCE.COST' | translate }}</th>
            <td mat-cell *matCellDef="let row"><strong>{{ row.cost | currency:'EUR' }}</strong></td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>{{ 'LOGBOOK.MAINTENANCE.ACTIONS' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <div class="action-buttons" *ngIf="isAdmin()">
                <button mat-icon-button color="primary" (click)="editItem('maintenance', row)" matTooltip="Modifier"><mat-icon>edit</mat-icon></button>
                <button mat-icon-button color="warn" (click)="deleteItem('maintenance', row._id)" matTooltip="Supprimer"><mat-icon>delete</mat-icon></button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumnsMaintenance"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumnsMaintenance;"></tr>
        </table>
      </div>
      <mat-paginator #maintenancePaginator [pageSizeOptions]="[10, 25]" showFirstLastButtons></mat-paginator>
    </div>
  </mat-tab>

  <!-- INCIDENTS TAB -->
  <mat-tab [label]="'LOGBOOK.TABS.INCIDENTS' | translate">
    <div class="table-container" style="margin-top: 20px; box-shadow: none;">
      <div class="table-header-container" style="justify-content: space-between;">
        <h3 style="margin: 0; color: #4b5563;">{{ 'LOGBOOK.INCIDENTS.TITLE' | translate }}</h3>
        <div class="custom-search-input">
          <mat-icon>search</mat-icon>
          <input type="text" (keyup)="applyFilter($event, incidentsDataSource)" placeholder="Rechercher...">
        </div>
      </div>

      <div class="table-responsive">
        <table mat-table [dataSource]="incidentsDataSource" matSort style="width: 100%;">

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.INCIDENTS.DATE' | translate }}</th>
            <td mat-cell *matCellDef="let row"><strong>{{ row.date | date:'short' }}</strong></td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.INCIDENTS.TYPE' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.type }}</td>
          </ng-container>

          <ng-container matColumnDef="severity">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.INCIDENTS.SEVERITY' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <span class="status-badge" [ngClass]="row.severity === 'Critique' ? 'status-danger' : (row.severity === 'Moyenne' ? 'status-warning' : 'status-success')">{{ row.severity }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let row">{{ row.description }}</td>
          </ng-container>

          <ng-container matColumnDef="location">
            <th mat-header-cell *matHeaderCellDef>{{ 'LOGBOOK.INCIDENTS.LOCATION' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <button *ngIf="row.location?.lat" (click)="openMapForIncident(row)" mat-stroked-button color="primary">
                <mat-icon>place</mat-icon> {{ 'LOGBOOK.INCIDENTS.VIEW_MAP' | translate }}
              </button>
              <span *ngIf="!row.location?.lat" style="color: #9ca3af;">-</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="photos">
            <th mat-header-cell *matHeaderCellDef>{{ 'LOGBOOK.INCIDENTS.PHOTOS' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <div class="photo-thumbnails" *ngIf="row.photos?.length > 0">
                <img *ngFor="let p of row.photos" [src]="p.url || p" class="thumbnail" (click)="openPhotoModal(p.url || p)">
              </div>
              <span *ngIf="!row.photos?.length" class="no-photos" style="color: #9ca3af;">{{ 'LOGBOOK.TRIPS.NO_PHOTO' | translate }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'LOGBOOK.INCIDENTS.STATUS' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.status }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>{{ 'LOGBOOK.INCIDENTS.ACTIONS' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <div class="action-buttons" *ngIf="isAdmin()">
                <button mat-icon-button color="primary" (click)="editItem('incident', row)" matTooltip="Modifier"><mat-icon>edit</mat-icon></button>
                <button mat-icon-button color="warn" (click)="deleteItem('incident', row._id)" matTooltip="Supprimer"><mat-icon>delete</mat-icon></button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumnsIncidents"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumnsIncidents;"></tr>
        </table>
      </div>
      <mat-paginator #incidentsPaginator [pageSizeOptions]="[10, 25]" showFirstLastButtons></mat-paginator>
    </div>
  </mat-tab>

</mat-tab-group>

<!-- MODAL EDITION (FUEL, MAINTENANCE, INCIDENT) -->
<ng-template #editDialog>
  <div class="custom-modal-layout" style="width: 100%;">
    <div class="custom-modal-header">
      <h2>
        <mat-icon>edit</mat-icon>
        Modifier {{ editingType === 'maintenance' ? 'Réparation' : editingType }}
      </h2>
      <button class="custom-modal-close-btn" (click)="cancelEdit()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <div class="custom-modal-body" *ngIf="editingItem">
      <form (ngSubmit)="saveItem()" #editForm="ngForm" id="editForm">
        
        <!-- FUEL -->
        <div *ngIf="editingType === 'fuel'">
          <div class="modal-grid-2">
            <div class="modern-form-group">
              <label>Quantité (L)</label>
              <input class="modern-input" type="number" name="fuelQuantity" [(ngModel)]="editingItem.quantity">
            </div>
            <div class="modern-form-group">
              <label>Km</label>
              <input class="modern-input" type="number" name="fuelMileage" [(ngModel)]="editingItem.mileage">
            </div>
          </div>
          <div class="modern-form-group">
            <label>Source</label>
            <input class="modern-input" type="text" name="fuelSource" [(ngModel)]="editingItem.source">
          </div>
        </div>

        <!-- MAINTENANCE -->
        <div *ngIf="editingType === 'maintenance'">
          <div class="modal-grid-2">
            <div class="modern-form-group">
              <label>Type</label>
              <input class="modern-input" type="text" name="maintType" [(ngModel)]="editingItem.type">
            </div>
            <div class="modern-form-group">
              <label>Coût</label>
              <input class="modern-input" type="number" name="maintCost" [(ngModel)]="editingItem.cost">
            </div>
          </div>
          <div class="modern-form-group">
            <label>Garage</label>
            <input class="modern-input" type="text" name="maintGarage" [(ngModel)]="editingItem.garage">
          </div>
        </div>

        <!-- INCIDENT -->
        <div *ngIf="editingType === 'incident'">
          <div class="modal-grid-2">
            <div class="modern-form-group">
              <label>Type</label>
              <input class="modern-input" type="text" name="incType" [(ngModel)]="editingItem.type">
            </div>
            <div class="modern-form-group">
              <label>Sévérité</label>
              <select class="modern-input" name="incSeverity" [(ngModel)]="editingItem.severity">
                <option>Faible</option>
                <option>Moyenne</option>
                <option>Critique</option>
              </select>
            </div>
          </div>
          <div class="modern-form-group">
            <label>Description</label>
            <textarea class="modern-input" name="incDesc" [(ngModel)]="editingItem.description" rows="3"></textarea>
          </div>
        </div>

      </form>
    </div>
    
    <div class="custom-modal-footer">
      <button class="custom-modal-btn-cancel" type="button" (click)="cancelEdit()">
        <mat-icon>close</mat-icon> Annuler
      </button>
      <button class="custom-modal-btn-submit" type="submit" form="editForm">
        <mat-icon>save</mat-icon> Enregistrer
      </button>
    </div>
  </div>
</ng-template>

<!-- Photo Modal -->
<div *ngIf="selectedPhoto" class="photo-modal" (click)="closePhotoModal()">
  <div class="modal-content" (click)="$event.stopPropagation()">
    <button class="close-btn" (click)="closePhotoModal()">×</button>
    <img [src]="selectedPhoto" alt="Photo en grand">
  </div>
</div>

<!-- Map Modal -->
<div *ngIf="showMapModal" class="map-modal-overlay" (click)="closeMapModal()">
  <div class="map-modal-content" (click)="$event.stopPropagation()">
    <div class="map-header">
      <h3>{{ 'LOGBOOK.MODALS.MAP_TITLE' | translate }}</h3>
      <button class="close-btn" (click)="closeMapModal()">×</button>
    </div>
    <div class="map-container-wrapper">
      <app-map-mouvements [mouvements]="mapMouvementsData"></app-map-mouvements>
    </div>
    <div class="map-legend" style="padding: 10px; font-size: 0.9em; background: #f5f5f5; margin-top: 10px; border-radius: 4px;">
      <span style="color: #2196F3; font-weight: bold;">--- {{ 'LOGBOOK.MODALS.PLANNED' | translate }}</span> &nbsp;|&nbsp;
      <span style="color: #d32f2f; font-weight: bold;">___ {{ 'LOGBOOK.MODALS.REAL' | translate }}</span>
    </div>
  </div>
</div>
"""

with open('src/app/logbook-dashboard/logbook-dashboard.component.ts', 'w') as f:
    f.write(ts_content)

with open('src/app/logbook-dashboard/logbook-dashboard.component.html', 'w') as f:
    f.write(html_content)

print("Rewrote Logbook component")
