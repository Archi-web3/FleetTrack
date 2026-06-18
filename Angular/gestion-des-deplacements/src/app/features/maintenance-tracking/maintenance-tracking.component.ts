import { Component, OnInit, ViewChild } from '@angular/core';
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
import { AdminService } from '../../core/services/admin.service';
import { MouvementService } from '../../core/services/mouvement.service';
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
  styleUrls: ['./maintenance-tracking.component.scss']
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
