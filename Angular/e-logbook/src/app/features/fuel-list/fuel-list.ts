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
import { FuelDetailsDialogComponent } from './fuel-details-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-fuel-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule, MatTableModule, MatTooltipModule, MatCardModule, MatDialogModule, TranslateModule],
  templateUrl: './fuel-list.html',
  styleUrls: ['./fuel-list.scss']
})
export class FuelListComponent implements OnInit {
  fuels: any[] = [];
  isSyncing = false;
  selectedVehicle: any = null;
  currentUser: any = null;

  displayedColumns: string[] = ['syncStatus', 'date', 'quantity', 'type', 'mileage', 'source', 'actions'];
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
        this.displayedColumns = ['syncStatus', 'date', 'quantity', 'actions']; // Simplified for mobile
      } else {
        this.displayedColumns = ['syncStatus', 'date', 'quantity', 'type', 'mileage', 'source', 'actions'];
      }
    });
  }

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    await this.loadFuels();

    // Background sync re-enabled after fixing backend duplication bug
    this.syncService.syncData().then(() => {
      console.log('Background sync completed');
      this.loadFuels(); // Reload to show updates
    }).catch(err => console.error('Background sync failed', err));
  }

  async loadFuels() {
    // Get selected vehicle
    const selectedVehicleStr = localStorage.getItem('selectedVehicle');
    if (!selectedVehicleStr) {
      this.router.navigate(['/vehicle-selector']);
      return;
    }
    this.selectedVehicle = JSON.parse(selectedVehicleStr);
    const vehicleId = this.selectedVehicle._id;

    // Load fuels
    this.fuels = await this.offlineService.fuels
      .where('vehicleId')
      .equals(vehicleId)
      .reverse()
      .sortBy('date');

    this.cdr.detectChanges();
  }

  openDetails(fuel: any) {
    this.dialog.open(FuelDetailsDialogComponent, {
      width: '90%',
      maxWidth: '500px',
      data: { fuel: fuel }
    });
  }

  addFuel() {
    this.router.navigate(['/fuel-form']);
  }

  async syncData() {
    this.isSyncing = true;
    this.cdr.detectChanges();

    try {
      await this.syncService.syncData();
      await this.loadFuels();
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

  async deleteFuel(fuel: any, event: Event) {
    event.stopPropagation();
    if (!confirm(`Supprimer ce ravitaillement (${fuel.quantity}L)?`)) return;

    try {
      if (fuel.id) {
        await this.offlineService.fuels.delete(fuel.id);
        // Only add to deleted items if it was synced AND has a serverId
        if (fuel.synced === 1 && fuel.serverId) {
          await this.offlineService.addDeletedItem('fuels', fuel.serverId);
        }
        await this.loadFuels();
        this.syncService.syncData();
      }
    } catch (error) {
      console.error('Error deleting fuel:', error);
      alert('Erreur lors de la suppression.');
    }
  }
}
