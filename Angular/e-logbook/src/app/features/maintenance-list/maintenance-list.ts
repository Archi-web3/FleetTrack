import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { OfflineService } from '../../core/services/offline.service';
import { SyncService } from '../../core/services/sync.service';
import { AuthService } from '../../core/services/auth.service';
import { MaintenanceDetailsDialogComponent } from './maintenance-details-dialog.component';

@Component({
  selector: 'app-maintenance-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule, MatTableModule, MatTooltipModule, MatCardModule, MatDialogModule],
  templateUrl: './maintenance-list.html',
  styleUrls: ['./maintenance-list.scss']
})
export class MaintenanceListComponent implements OnInit {
  maintenances: any[] = [];
  isSyncing = false;
  selectedVehicle: any = null;
  currentUser: any = null;

  displayedColumns: string[] = ['syncStatus', 'date', 'type', 'mileage', 'garage', 'cost', 'actions'];
  isHandset$: Observable<boolean>;

  constructor(
    private offlineService: OfflineService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private syncService: SyncService,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );

    // Update columns based on screen size
    this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        this.displayedColumns = ['syncStatus', 'date', 'type', 'actions']; // Simplified for mobile
      } else {
        this.displayedColumns = ['syncStatus', 'date', 'type', 'mileage', 'garage', 'cost', 'actions'];
      }
    });
  }

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    await this.loadMaintenances();

    // Trigger background sync
    this.syncService.syncData().then(() => {
      console.log('Background sync completed');
      this.loadMaintenances(); // Reload to show updates
    }).catch(err => console.error('Background sync failed', err));
  }

  async loadMaintenances() {
    // Get selected vehicle
    const selectedVehicleStr = localStorage.getItem('selectedVehicle');
    if (!selectedVehicleStr) {
      this.router.navigate(['/vehicle-selector']);
      return;
    }
    this.selectedVehicle = JSON.parse(selectedVehicleStr);
    const vehicleId = this.selectedVehicle._id;

    // Load maintenances
    this.maintenances = await this.offlineService.maintenances
      .where('vehicleId')
      .equals(vehicleId)
      .reverse()
      .sortBy('date');

    this.cdr.detectChanges();
  }

  openDetails(maintenance: any) {
    this.dialog.open(MaintenanceDetailsDialogComponent, {
      width: '90%',
      maxWidth: '500px',
      data: { maintenance: maintenance }
    });
  }

  addMaintenance() {
    this.router.navigate(['/maintenance-form']);
  }

  async syncData() {
    this.isSyncing = true;
    this.cdr.detectChanges();

    try {
      await this.syncService.syncData();
      await this.loadMaintenances();
      alert('Synchronisation réussie!');
    } catch (error: any) {
      console.error('Sync error:', error);
      alert('Erreur de synchronisation.');
    } finally {
      this.isSyncing = false;
      this.cdr.detectChanges();
    }
  }

  get isAdmin(): boolean {
    if (this.currentUser && this.currentUser.profil === 'Admin') return true;
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) return false;
    try {
      const user = JSON.parse(currentUserStr);
      return user.profil === 'Admin';
    } catch (e) { return false; }
  }

  async deleteMaintenance(maintenance: any, event: Event) {
    event.stopPropagation();
    if (!confirm(`Supprimer cette maintenance (${maintenance.type})?`)) return;

    try {
      if (maintenance.id) {
        await this.offlineService.maintenances.delete(maintenance.id);
        // Only add to deleted items if it was synced AND has a serverId
        if (maintenance.synced === 1 && maintenance.serverId) {
          await this.offlineService.addDeletedItem('maintenances', maintenance.serverId);
        }
        await this.loadMaintenances();
        this.syncService.syncData();
      }
    } catch (error) {
      console.error('Error deleting maintenance:', error);
      alert('Erreur lors de la suppression.');
    }
  }
}
