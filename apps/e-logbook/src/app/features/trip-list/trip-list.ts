import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, shareReplay } from 'rxjs/operators';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { OfflineService, Trip, Fuel, Maintenance, Incident, Lieu, User } from '../../core/services/offline.service';
import { SyncService } from '../../core/services/sync.service';
import { AuthService } from '../../core/services/auth.service';
import { TripDetailsDialogComponent } from './trip-details-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleRef, UserRef } from '../../core/models/api.types';

@Component({
  selector: 'app-trip-list',
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
  templateUrl: './trip-list.html',
  styleUrls: ['./trip-list.scss'],
})
export class TripListComponent implements OnInit {
  private offlineService = inject(OfflineService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private syncService = inject(SyncService);
  private authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);
  private dialog = inject(MatDialog);

  trips: Trip[] = [];

  isSyncing = false;
  selectedVehicle: VehicleRef | null = null;
  currentUser: UserRef | null = null;

  displayedColumns: string[] = [
    'syncStatus',
    'date',
    'time',
    'departure',
    'arrival',
    'passengers',
    'purpose',
    'actions',
  ];
  lieuxMap = new Map<string, Lieu>();
  usersMap = new Map<string, User>();

  isHandset$: Observable<boolean>;

  constructor() {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay(),
    );

    // Reload data when navigation ends (e.g. coming back from active-trip)
    // BUT avoid infinite loop when redirecting to vehicle-selector
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Only reload if we're actually on the trips page
        if (event.url === '/trips' || event.url.startsWith('/trips?')) {
          this.loadTrips();
        }
      });

    // Update columns based on screen size
    this.isHandset$.subscribe((isHandset) => {
      if (isHandset) {
        this.displayedColumns = ['syncStatus', 'date', 'departure', 'actions']; // Simplified for mobile
      } else {
        this.displayedColumns = [
          'syncStatus',
          'date',
          'time',
          'departure',
          'arrival',
          'passengers',
          'purpose',
          'actions',
        ];
      }
    });
  }

  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    await this.loadTrips();

    // Background sync re-enabled after fixing backend duplication bug
    this.syncService
      .syncData()
      .then(() => {
        this.loadTrips(); // Reload to show updates
      })
      .catch((err) => console.error('Background sync failed', err));
  }

  async loadTrips() {
    // Get selected vehicle
    const selectedVehicleStr = localStorage.getItem('selectedVehicle');
    if (!selectedVehicleStr) {
      this.router.navigate(['/vehicle-selector']);
      return;
    }
    this.selectedVehicle = JSON.parse(selectedVehicleStr);
    const vehicleId = this.selectedVehicle?._id;
    if (!vehicleId) return;

    // Get all trips for this vehicle
    const allTrips = await this.offlineService.trips
      .where('vehicleId')
      .equals(vehicleId)
      .reverse()
      .sortBy('startDateTime');

    // Filter out duplicates:
    // When a planned movement is completed, TWO trips exist with the same serverId:
    // 1. The original planned movement (serverId set, NO plannedMovementId)
    // 2. The completed trip (serverId set, HAS plannedMovementId = serverId)
    // We want to keep #2 and remove #1

    const completedPlannedMovementIds = new Set(
      allTrips
        .filter((trip) => trip.plannedMovementId) // Trips that were started from planning
        .map((trip) => trip.plannedMovementId),
    );

    // Keep trips that are either:
    // 1. Have a plannedMovementId (completed from planning - the REAL trip), OR
    // 2. Don't have a serverId matching a completed planned movement (not a duplicate)
    // 3. NOUVEAU: Have an endDateTime (completed trips only, not active)
    this.trips = allTrips.filter((trip) => {
      // NOUVEAU: Exclure les trips actifs (sans endDateTime)
      if (!trip.endDateTime) {
        return false;
      }

      // If trip has plannedMovementId, it's a real completed trip - KEEP
      if (trip.plannedMovementId) {
        return true;
      }

      // If trip's serverId matches a completed planned movement, it's the original duplicate - REMOVE
      if (trip.serverId && completedPlannedMovementIds.has(trip.serverId)) {
        return false;
      }

      return true; // Keep everything else
    });

    // Load users for passenger names
    const users = await this.offlineService.users.toArray();
    this.usersMap.clear();
    users.forEach((user) => this.usersMap.set(user._id, user));

    // Manually trigger change detection to update the view
    this.cdr.detectChanges();
  }

  getDepartureName(trip: Trip): string {
    const lieu = this.lieuxMap.get(trip.departurePlaceId || '');
    return lieu?.nom || '-';
  }

  getArrivalName(trip: Trip): string {
    const lieu = this.lieuxMap.get(trip.arrivalPlaceId || '');
    return lieu?.nom || '-';
  }

  getPassengerNames(trip: Trip): string {
    if (!trip.passengerIds || trip.passengerIds.length === 0) {
      return 'Aucun passager';
    }

    // Get passenger names from users
    const passengers = trip.passengerIds
      .map((id) => {
        const user = this.usersMap.get(id);
        return user?.nom || 'Inconnu';
      })
      .filter((name) => name !== 'Inconnu');

    return passengers.length > 0 ? passengers.join(', ') : 'Aucun passager';
  }

  async openDetails(trip: Trip) {
    // Calculate consumption data for the vehicle
    if (!this.selectedVehicle) return;
    const consumptionData = await this.offlineService.calculateConsumption(
      this.selectedVehicle._id,
    );

    this.dialog.open(TripDetailsDialogComponent, {
      width: '90%',
      maxWidth: '500px',
      data: {
        trip: trip,
        departureName: this.getDepartureName(trip),
        arrivalName: this.getArrivalName(trip),
        passengerNames: this.getPassengerNames(trip),
        consumptionData: consumptionData,
      },
    });
  }

  startNewTrip() {
    this.router.navigate(['/active-trip']);
  }

  addFuel() {
    this.router.navigate(['/fuel-form']);
  }

  addMaintenance() {
    this.router.navigate(['/maintenance-form']);
  }

  addIncident() {
    this.router.navigate(['/incident-form']);
  }

  goToPlanning() {
    this.router.navigate(['/planning']);
  }

  async syncData() {
    this.isSyncing = true;
    this.cdr.detectChanges();

    try {
      await this.syncService.syncData();
      // Reload trips to show updated sync status
      await this.loadTrips();
      alert('Synchronisation réussie!');
    } catch (error: unknown) {
      console.error('Sync error:', error);
      let errorMessage = 'Erreur de synchronisation.';
      if (error && typeof error === 'object' && 'error' in error) {
        const errObj = error as { error?: { message?: string } };
        if (errObj.error && errObj.error.message) {
          errorMessage += ` ${errObj.error.message}`;
        }
      }
      alert(errorMessage);
    } finally {
      this.isSyncing = false;
      this.cdr.detectChanges();
    }
  }

  get isAdmin(): boolean {
    // First check the currentUser property
    if (this.currentUser && this.currentUser.profil === 'Admin') {
      return true;
    }

    // Fallback to localStorage
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) return false;

    try {
      const user = JSON.parse(currentUserStr);
      return user.profil === 'Admin';
    } catch (e) {
      console.error('Error parsing currentUser from localStorage:', e);
      return false;
    }
  }

  async deleteTrip(trip: Trip, event: Event) {
    event.stopPropagation();

    if (!confirm(`Supprimer le trajet "${trip.purpose}"?`)) {
      return;
    }

    try {
      if (trip.id) {
        // Delete locally
        await this.offlineService.trips.delete(trip.id);

        // Only add to deleted items if it was synced AND has a serverId
        if (trip.synced === 1 && trip.serverId) {
          await this.offlineService.addDeletedItem('trips', trip.serverId);
        }

        await this.loadTrips();

        // Trigger sync to push deletion
        this.syncService.syncData();
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Erreur lors de la suppression du trajet.');
    }
  }

  async deleteFuel(fuel: Fuel, event: Event) {
    event.stopPropagation();

    if (!confirm(`Supprimer ce ravitaillement (${fuel.quantity}L)?`)) {
      return;
    }

    try {
      if (fuel.id) {
        await this.offlineService.fuels.delete(fuel.id);
        if (fuel.synced === 1) {
          await this.offlineService.addDeletedItem('fuels', fuel.id.toString());
        }
        await this.loadTrips();
        this.syncService.syncData();
      }
    } catch (error) {
      console.error('Error deleting fuel:', error);
      alert('Erreur lors de la suppression du ravitaillement.');
    }
  }

  async deleteMaintenance(maintenance: Maintenance, event: Event) {
    event.stopPropagation();

    if (!confirm(`Supprimer cette maintenance (${maintenance.type})?`)) {
      return;
    }

    try {
      if (maintenance.id) {
        await this.offlineService.maintenances.delete(maintenance.id);
        if (maintenance.synced === 1) {
          await this.offlineService.addDeletedItem('maintenances', maintenance.id.toString());
        }
        await this.loadTrips();
        this.syncService.syncData();
      }
    } catch (error) {
      console.error('Error deleting maintenance:', error);
      alert('Erreur lors de la suppression de la maintenance.');
    }
  }

  async deleteIncident(incident: Incident, event: Event) {
    event.stopPropagation();

    if (!confirm(`Supprimer cet incident (${incident.type})?`)) {
      return;
    }

    try {
      if (incident.id) {
        await this.offlineService.incidents.delete(incident.id);
        if (incident.synced === 1) {
          await this.offlineService.addDeletedItem('incidents', incident.id.toString());
        }
        await this.loadTrips();
        this.syncService.syncData();
      }
    } catch (error) {
      console.error('Error deleting incident:', error);
      alert("Erreur lors de la suppression de l'incident.");
    }
  }

  logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
