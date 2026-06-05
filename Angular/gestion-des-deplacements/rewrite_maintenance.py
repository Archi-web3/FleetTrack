ts_content = """import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MaintenanceTrackingService } from './maintenance-tracking.service';
import { AdminService } from '../admin.service';
import { MouvementService } from '../mouvement.service';
import { SmartCostDashboardComponent } from './smart-cost-dashboard/smart-cost-dashboard.component';
import { PredictiveDashboardComponent } from './predictive-dashboard/predictive-dashboard.component';

@Component({
  selector: 'app-maintenance-tracking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatBadgeModule,
    MatDialogModule,
    MatTabsModule,
    MatTooltipModule,
    TranslateModule,
    SmartCostDashboardComponent,
    PredictiveDashboardComponent
  ],
  templateUrl: './maintenance-tracking.component.html',
  styleUrls: ['./maintenance-tracking.component.css']
})
export class MaintenanceTrackingComponent implements OnInit {
  vehicules: any[] = [];
  alerts: any[] = [];
  bases: any[] = [];
  loading = false;
  Math = Math;

  // DataSources for tables
  vehiculesDataSource = new MatTableDataSource<any>();
  slotsDataSource = new MatTableDataSource<any>();

  @ViewChild('vehiculesPaginator') vehiculesPaginator!: MatPaginator;
  @ViewChild('vehiculesSort') vehiculesSort!: MatSort;
  
  @ViewChild('slotsPaginator') slotsPaginator!: MatPaginator;
  @ViewChild('slotsSort') slotsSort!: MatSort;

  maintenanceSlots: any[] = [];
  loadingSlots = false;

  selectedBase: string = '';
  selectedStatus: string = '';
  selectedType: string = '';

  displayedColumns: string[] = ['immatriculation', 'type', 'km', 'dernierService', 'prochainService', 'ecart', 'statut', 'actions'];
  displayedColumnsSlots: string[] = ['date', 'vehicule', 'type', 'description', 'statut', 'actions'];

  constructor(
    private trackingService: MaintenanceTrackingService,
    private adminService: AdminService,
    private mouvementService: MouvementService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadBases();
    this.loadOverview();
    this.loadAlerts();
    this.loadMaintenanceSlots();
  }

  ngAfterViewInit() {
    this.vehiculesDataSource.paginator = this.vehiculesPaginator;
    this.vehiculesDataSource.sort = this.vehiculesSort;
    this.slotsDataSource.paginator = this.slotsPaginator;
    this.slotsDataSource.sort = this.slotsSort;
  }

  loadBases() {
    const storedCountry = localStorage.getItem('selectedCountry');
    let countryId = undefined;

    if (storedCountry) {
      if (storedCountry.startsWith('{')) {
        try {
          const countryObj = JSON.parse(storedCountry);
          countryId = countryObj._id || countryObj.id;
        } catch (e) {
          countryId = storedCountry;
        }
      } else {
        countryId = storedCountry;
      }
    }

    this.adminService.getBases(countryId).subscribe(
      (data: any) => this.bases = data,
      (error: any) => console.error('Erreur chargement bases:', error)
    );
  }

  loadOverview() {
    this.loading = true;
    const filters: any = {};
    if (this.selectedBase) filters.base = this.selectedBase;
    if (this.selectedStatus) filters.statut = this.selectedStatus;
    if (this.selectedType) filters.typeVehicule = this.selectedType;

    this.trackingService.getOverview(filters).subscribe({
      next: (data: any) => {
        this.vehicules = data;
        this.vehiculesDataSource.data = this.vehicules;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur chargement overview:', error);
        this.loading = false;
      }
    });
  }

  applyVehiculesFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.vehiculesDataSource.filter = filterValue.trim().toLowerCase();
  }

  applySlotsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.slotsDataSource.filter = filterValue.trim().toLowerCase();
  }

  loadAlerts() {
    this.trackingService.getAlerts().subscribe({
      next: (data: any) => this.alerts = data,
      error: (error: any) => console.error('Erreur chargement alertes:', error)
    });
  }

  applyFilters() {
    this.loadOverview();
  }

  resetFilters() {
    this.selectedBase = '';
    this.selectedStatus = '';
    this.selectedType = '';
    this.loadOverview();
  }

  getStatusIcon(statusCode: string): string {
    switch (statusCode) {
      case 'ok': return 'check_circle';
      case 'proche': return 'info';
      case 'retard': return 'warning';
      case 'critique': return 'error';
      default: return 'help';
    }
  }

  getStatusLabel(statusCode: string): string {
    switch (statusCode) {
      case 'ok': return 'À jour';
      case 'proche': return 'Proche';
      case 'retard': return 'En retard';
      case 'critique': return 'Critique';
      default: return 'Inconnu';
    }
  }

  getStatusColor(statusCode: string): string {
    switch (statusCode) {
      case 'ok': return '#4caf50';
      case 'proche': return '#ff9800';
      case 'retard': return '#f44336';
      case 'critique': return '#9c27b0';
      default: return '#757575';
    }
  }

  formatDate(date: any): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  formatEcart(ecartKm: number | null): string {
    if (ecartKm === null) return '-';
    if (ecartKm > 0) return `Dans ${ecartKm} km`;
    return `Retard de ${Math.abs(ecartKm)} km`;
  }

  viewVehiculeDetail(vehicule: any) {
    alert(`Détail pour ${vehicule.vehicule.immatriculation} - À implémenter`);
  }

  loadMaintenanceSlots() {
    this.loadingSlots = true;
    this.mouvementService.getMouvements().subscribe({
      next: (data: any) => {
        this.maintenanceSlots = data.filter((m: any) => m.type === 'maintenance');
        this.maintenanceSlots.sort((a: any, b: any) => new Date(b.dateDepart).getTime() - new Date(a.dateDepart).getTime());
        this.slotsDataSource.data = this.maintenanceSlots;
        this.loadingSlots = false;
      },
      error: (err: any) => {
        console.error('Erreur chargement slots maintenance:', err);
        this.loadingSlots = false;
      }
    });
  }

  deleteSlot(slot: any) {
    if (confirm(`Confirmer la suppression de la maintenance "${slot.maintenanceType}" pour ${slot.vehicule?.immatriculation} ?`)) {
      this.mouvementService.deleteMouvement(slot._id).subscribe({
        next: () => {
          this.loadMaintenanceSlots();
        },
        error: (err: any) => {
          console.error('Erreur suppression maintenance:', err);
          alert('Erreur lors de la suppression.');
        }
      });
    }
  }

  editSlot(slot: any) {
    this.router.navigate(['/modifier-mouvement', slot._id]);
  }
}
"""

html_content = """<div class="page-header-actions" style="margin-bottom: 20px;">
  <h2 style="margin: 0; display: flex; align-items: center; gap: 10px;">
    <mat-icon style="color: var(--primary-color);">build</mat-icon>
    {{ 'MAINTENANCE.TITLE' | translate }}
  </h2>
</div>

<!-- Alertes urgentes -->
<mat-card *ngIf="alerts.length > 0" style="margin-bottom: 20px; border-left: 5px solid #f44336;">
  <mat-card-header>
    <mat-card-title style="display: flex; align-items: center; gap: 10px; font-size: 1.2rem;">
      <mat-icon style="color: #f44336;">warning</mat-icon>
      {{ 'MAINTENANCE.ALERTS.TITLE' | translate }} ({{ alerts.length }})
    </mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px;">
      <mat-chip *ngFor="let alert of alerts.slice(0, 5)"
        [style.background-color]="alert.criticite === 'critique' ? '#9c27b0' : '#f44336'"
        style="color: white; font-weight: 500;">
        <mat-icon style="margin-right: 5px; color: white;">error</mat-icon>
        {{ alert.vehicule.immatriculation }} - Service {{ alert.service.type }}
        ({{ alert.ecartKm < 0 ? (('MAINTENANCE.ALERTS.DELAY' | translate) + ': ' + Math.abs(alert.ecartKm) + ' km' ) : alert.ecartKm + ' km' }}) 
      </mat-chip>
    </div>
  </mat-card-content>
</mat-card>

<mat-tab-group animationDuration="0ms" class="custom-tab-group">

  <!-- ONGLET 1 : SUIVI KILOMÉTRIQUE -->
  <mat-tab [label]="'MAINTENANCE.TABS.TRACKING' | translate">
    <div class="table-container" style="margin-top: 20px; box-shadow: none;">
      
      <div class="table-header-container" style="flex-wrap: wrap; gap: 15px;">
        <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
          <mat-form-field appearance="outline" style="margin-bottom: -22px; width: 200px;">
            <mat-label>{{ 'MAINTENANCE.FILTERS.BASE' | translate }}</mat-label>
            <mat-select [(ngModel)]="selectedBase" (selectionChange)="applyFilters()">
              <mat-option value="">{{ 'MAINTENANCE.FILTERS.ALL_BASES' | translate }}</mat-option>
              <mat-option *ngFor="let base of bases" [value]="base._id">{{ base.nom }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" style="margin-bottom: -22px; width: 200px;">
            <mat-label>{{ 'MAINTENANCE.FILTERS.STATUS' | translate }}</mat-label>
            <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilters()">
              <mat-option value="">{{ 'MAINTENANCE.FILTERS.ALL_STATUS' | translate }}</mat-option>
              <mat-option value="ok">À jour</mat-option>
              <mat-option value="proche">Proche</mat-option>
              <mat-option value="retard">En retard</mat-option>
              <mat-option value="critique">Critique</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-button (click)="resetFilters()" style="color: #6b7280; align-self: flex-start; margin-top: 5px;">
            <mat-icon>refresh</mat-icon> {{ 'MAINTENANCE.FILTERS.RESET_BTN' | translate }}
          </button>
        </div>

        <div class="custom-search-input">
          <mat-icon>search</mat-icon>
          <input type="text" (keyup)="applyVehiculesFilter($event)" placeholder="Rechercher un véhicule...">
        </div>
      </div>

      <div *ngIf="loading" style="text-align: center; padding: 40px; color: #6b7280;">
        <mat-icon class="spinner">autorenew</mat-icon> Chargement...
      </div>

      <div class="table-responsive" *ngIf="!loading">
        <table mat-table [dataSource]="vehiculesDataSource" matSort style="width: 100%;">
          
          <ng-container matColumnDef="immatriculation">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'MAINTENANCE.TABLE.PLATE' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <strong>{{ row.vehicule.immatriculation }}</strong><br>
              <small style="color: #6b7280;">{{ row.vehicule.marque }} {{ row.vehicule.modele }}</small>
            </td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'MAINTENANCE.TABLE.TYPE' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ row.vehicule.type || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="km">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'MAINTENANCE.TABLE.KM_CURRENT' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <strong>{{ row.vehicule.kilometrage | number:'1.0-0' }}</strong> <small>km</small>
            </td>
          </ng-container>

          <ng-container matColumnDef="dernierService">
            <th mat-header-cell *matHeaderCellDef>{{ 'MAINTENANCE.TABLE.LAST_SERVICE' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <span *ngIf="row.dernierService">
                {{ 'MAINTENANCE.TABLE.SERVICE' | translate }} <strong>{{ row.dernierService.type }}</strong><br>
                <small style="color: #6b7280;">{{ formatDate(row.dernierService.date) }} ({{ row.dernierService.km | number:'1.0-0' }} km)</small>
              </span>
              <span *ngIf="!row.dernierService" style="color: #9ca3af;">-</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="prochainService">
            <th mat-header-cell *matHeaderCellDef>{{ 'MAINTENANCE.TABLE.NEXT_SERVICE' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <span *ngIf="row.prochainService">
                {{ 'MAINTENANCE.TABLE.SERVICE' | translate }} <strong>{{ row.prochainService.type }}</strong><br>
                <small style="color: #6b7280;">{{ row.prochainService.kmPrevu | number:'1.0-0' }} km</small>
              </span>
              <span *ngIf="!row.prochainService" style="color: #9ca3af;">-</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="ecart">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'MAINTENANCE.TABLE.GAP' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <span [style.color]="row.ecartKm < 0 ? '#f44336' : '#4caf50'" style="font-weight: 500;">
                {{ formatEcart(row.ecartKm) }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="statut">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ 'MAINTENANCE.TABLE.STATUS' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <mat-chip [style.background-color]="getStatusColor(row.statusCode)" style="color: white; font-weight: 500;">
                <mat-icon style="margin-right: 5px; color: white; font-size: 18px; height: 18px; width: 18px;">{{ getStatusIcon(row.statusCode) }}</mat-icon> 
                {{ getStatusLabel(row.statusCode) }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>{{ 'MAINTENANCE.TABLE.ACTIONS' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              <div class="action-buttons">
                <button mat-icon-button color="primary" (click)="viewVehiculeDetail(row)" matTooltip="Voir détails">
                  <mat-icon>info</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
      <mat-paginator #vehiculesPaginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
    </div>
  </mat-tab>

  <!-- ONGLET 2 : LISTE DES MAINTENANCES PLANIFIÉES -->
  <mat-tab [label]="'MAINTENANCE.TABS.PLANNING' | translate">
    <div class="table-container" style="margin-top: 20px; box-shadow: none;">
      
      <div class="table-header-container">
        <h3 style="margin: 0; color: #4b5563;">{{ 'MAINTENANCE.PLANNING.TITLE' | translate }}</h3>
        
        <div style="display: flex; gap: 15px; align-items: center;">
          <button mat-icon-button (click)="loadMaintenanceSlots()" matTooltip="Rafraîchir" style="color: #6b7280;">
            <mat-icon>refresh</mat-icon>
          </button>
          <div class="custom-search-input">
            <mat-icon>search</mat-icon>
            <input type="text" (keyup)="applySlotsFilter($event)" placeholder="Rechercher une maintenance...">
          </div>
        </div>
      </div>

      <div *ngIf="loadingSlots" style="text-align: center; padding: 40px; color: #6b7280;">
        <mat-icon class="spinner">autorenew</mat-icon> Chargement...
      </div>

      <div class="table-responsive" *ngIf="!loadingSlots">
        <table mat-table [dataSource]="slotsDataSource" matSort style="width: 100%;">

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'MAINTENANCE.PLANNING.DATE' | translate }} </th>
            <td mat-cell *matCellDef="let element"> <strong>{{element.dateDepart | date:'dd/MM/yyyy HH:mm'}}</strong> </td>
          </ng-container>

          <ng-container matColumnDef="vehicule">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'MAINTENANCE.PLANNING.VEHICLE' | translate }} </th>
            <td mat-cell *matCellDef="let element">
              {{ element.vehicule?.immatriculation || 'Non assigné' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'MAINTENANCE.PLANNING.TYPE' | translate }} </th>
            <td mat-cell *matCellDef="let element">
              <span style="background-color: #f3e8ff; color: #7e22ce; padding: 4px 8px; border-radius: 4px; font-weight: 500; font-size: 12px;">
                {{ element.maintenanceType }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef> {{ 'MAINTENANCE.PLANNING.NOTES' | translate }} </th>
            <td mat-cell *matCellDef="let element" style="color: #6b7280;"> {{ element.description || '-' }} </td>
          </ng-container>

          <ng-container matColumnDef="statut">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> {{ 'MAINTENANCE.PLANNING.STATUS' | translate }} </th>
            <td mat-cell *matCellDef="let element"> 
              <span class="status-badge" [ngClass]="element.statut === 'Terminé' ? 'status-success' : 'status-warning'">
                {{ element.statut }} 
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> {{ 'MAINTENANCE.PLANNING.ACTIONS' | translate }} </th>
            <td mat-cell *matCellDef="let element">
              <div class="action-buttons">
                <button mat-icon-button color="primary" (click)="editSlot(element)" matTooltip="Modifier">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteSlot(element)" matTooltip="Supprimer">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumnsSlots"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumnsSlots;"></tr>
        </table>
      </div>
      <mat-paginator #slotsPaginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
    </div>
  </mat-tab>

  <!-- ONGLET 3 : SMART COST -->
  <mat-tab label="Smart Cost & Analytics">
    <div style="padding-top: 20px;">
      <app-smart-cost-dashboard></app-smart-cost-dashboard>
    </div>
  </mat-tab>

  <!-- ONGLET 4 : PRÉDICTIONS -->
  <mat-tab [label]="'MAINTENANCE.TABS.PREDICTIVE' | translate">
    <div style="padding-top: 20px;">
      <app-predictive-dashboard></app-predictive-dashboard>
    </div>
  </mat-tab>

</mat-tab-group>
"""

with open('src/app/maintenance-tracking/maintenance-tracking.component.ts', 'w') as f:
    f.write(ts_content)

with open('src/app/maintenance-tracking/maintenance-tracking.component.html', 'w') as f:
    f.write(html_content)

print("Rewrote Maintenance component")
