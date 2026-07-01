import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
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
import { OfflineService, Incident } from '../../core/services/offline.service';
import { SyncService } from '../../core/services/sync.service';
import { AuthService } from '../../core/services/auth.service';
import { IncidentDetailsDialogComponent } from './incident-details-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleRef, UserRef } from '../../core/models/api.types';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,
    MatCardModule,
    MatDialogModule,
    TranslateModule,
  ],
  templateUrl: './incident-list.html',
  styleUrls: ['./incident-list.scss'],
})
export class IncidentListComponent implements OnInit {
  private offlineService = inject(OfflineService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private syncService = inject(SyncService);
  private authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);
  private dialog = inject(MatDialog);

  incidents: Incident[] = [];
  isSyncing = false;
  selectedVehicle: VehicleRef | null = null;
  currentUser: UserRef | null = null;

  displayedColumns: string[] = ['syncStatus', 'date', 'type', 'severity', 'description', 'actions'];
  isHandset$: Observable<boolean>;

  constructor() {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay(),
    );

    // Update columns based on screen size
    this.isHandset$.subscribe((isHandset) => {
      if (isHandset) {
        this.displayedColumns = ['syncStatus', 'date', 'type', 'actions']; // Simplified for mobile
      } else {
        this.displayedColumns = [
          'syncStatus',
          'date',
          'type',
          'severity',
          'description',
          'actions',
        ];
      }
    });
  }

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    await this.loadIncidents();

    // Trigger background sync
    this.syncService
      .syncData()
      .then(() => {
        this.loadIncidents(); // Reload to show updates
      })
      .catch((err) => console.error('Background sync failed', err));
  }

  async loadIncidents() {
    // Get selected vehicle
    const selectedVehicleStr = localStorage.getItem('selectedVehicle');
    if (!selectedVehicleStr) {
      this.router.navigate(['/vehicle-selector']);
      return;
    }
    this.selectedVehicle = JSON.parse(selectedVehicleStr);
    const vehicleId = this.selectedVehicle?._id;
    if (!vehicleId) return;

    // Load incidents
    this.incidents = await this.offlineService.incidents
      .where('vehicleId')
      .equals(vehicleId)
      .reverse()
      .sortBy('date');

    this.cdr.detectChanges();
  }

  openDetails(incident: Incident) {
    this.dialog.open(IncidentDetailsDialogComponent, {
      width: '90%',
      maxWidth: '500px',
      data: { incident: incident },
    });
  }

  addIncident() {
    this.router.navigate(['/incident-form']);
  }

  async syncData() {
    this.isSyncing = true;
    this.cdr.detectChanges();

    try {
      await this.syncService.syncData();
      await this.loadIncidents();
      alert('Synchronisation réussie!');
    } catch (error: unknown) {
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
    } catch (e) {
      return false;
    }
  }

  async deleteIncident(incident: Incident, event: Event) {
    event.stopPropagation();
    if (!confirm(`Supprimer cet incident (${incident.type})?`)) return;

    try {
      if (incident.id) {
        await this.offlineService.incidents.delete(incident.id);
        // Only add to deleted items if it was synced AND has a serverId
        if (incident.synced === 1 && incident.serverId) {
          await this.offlineService.addDeletedItem('incidents', incident.serverId);
        }
        await this.loadIncidents();
        this.syncService.syncData();
      }
    } catch (error) {
      console.error('Error deleting incident:', error);
      alert('Erreur lors de la suppression.');
    }
  }
}
