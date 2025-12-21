import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OfflineService } from '../../core/services/offline.service';
import { SyncService } from '../../core/services/sync.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-vehicle-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './vehicle-selector.html',
  styleUrls: ['./vehicle-selector.scss']
})
export class VehicleSelectorComponent implements OnInit {
  vehicules: any[] = [];
  selectedVehicleId: string = '';
  isAdmin: boolean = false;
  isLoading = true;



  constructor(
    private router: Router,
    private http: HttpClient,
    private offlineService: OfflineService,
    private cdr: ChangeDetectorRef,
    private syncService: SyncService
  ) { }

  async ngOnInit() {
    // Check if user is admin
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.isAdmin = user.role === 'admin';
    }
    await this.loadVehicules();

    // Trigger background sync
    this.syncService.syncData().then(() => {
      console.log('Background sync completed');
      this.loadVehicules(); // Reload to show updates
    }).catch(err => console.error('Background sync failed', err));
  }

  async loadVehicules() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // 1. Load from Local DB (Instant)
    try {
      const localVehicles = await this.offlineService.vehicles.toArray();
      if (localVehicles.length > 0) {
        console.log('Loaded vehicles from local DB:', localVehicles);
        this.vehicules = localVehicles;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error loading local vehicles:', error);
    }

    // 2. If online and no local data (first run), or just to be safe, try network if local is empty
    // (Actually syncService handles the network pull, so we might just rely on that, 
    // but for the very first login, sync might take a moment. 
    // Let's keep the direct call ONLY if local is empty to avoid blocking, 
    // OR just rely on the sync triggered in ngOnInit)

    if (this.vehicules.length === 0 && navigator.onLine) {
      // Fallback to direct API call if local DB is empty (First load)
      // ... existing logic ...
      const headers = new HttpHeaders({ 'x-auth-token': token });
      this.http.get<any[]>(`${environment.apiUrl}/vehicules`, { headers }).subscribe({
        next: async (vehicles) => {
          this.vehicules = vehicles;
          this.isLoading = false;
          this.cdr.detectChanges();
          // Save to local DB for next time
          await this.offlineService.vehicles.clear();
          await this.offlineService.vehicles.bulkPut(vehicles);
        },
        error: (error) => {
          // ... error handling ...
          this.isLoading = false;
        }
      });
    }
  }

  selectVehicle() {
    if (!this.selectedVehicleId) return;

    const vehicle = this.vehicules.find(v => v._id === this.selectedVehicleId);
    if (vehicle) {
      localStorage.setItem('selectedVehicleId', vehicle._id);
      localStorage.setItem('selectedVehicle', JSON.stringify(vehicle));
      console.log('Vehicle selected:', vehicle);
      this.router.navigate(['/dashboard']);
    }
  }

  clearVehicleSelection() {
    localStorage.removeItem('selectedVehicleId');
    localStorage.removeItem('selectedVehicle');
  }

  deleteVehicle(event: Event, vehicleId: string) {
    event.stopPropagation(); // Prevent mat-select from opening

    if (!confirm("Supprimer ce véhicule ? (Admin)")) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'x-auth-token': token || '' });

    this.http.delete(`${environment.apiUrl}/vehicules/${vehicleId}`, { headers }).subscribe({
      next: () => {
        console.log('Vehicle deleted');
        this.loadVehicules();
      },
      error: (error) => {
        console.error('Error deleting vehicle:', error);
        alert('Erreur lors de la suppression du véhicule');
      }
    });
  }
}
