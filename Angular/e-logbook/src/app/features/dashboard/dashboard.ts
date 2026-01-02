import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { OfflineService } from '../../core/services/offline.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatBadgeModule
    ],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
    selectedVehicle: any = null;
    currentUser: any = null;
    unsyncedCounts = {
        trips: 0,
        fuels: 0,
        maintenances: 0,
        incidents: 0
    };
    pendingMissionsCount = 0;

    constructor(
        private router: Router,
        private offlineService: OfflineService,
        private authService: AuthService,
        private http: HttpClient
    ) { }

    async ngOnInit() {
        const vehicleStr = localStorage.getItem('selectedVehicle');
        if (vehicleStr) {
            this.selectedVehicle = JSON.parse(vehicleStr);
        }

        // Subscribe to current user
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });

        await this.loadUnsyncedCounts();
        await this.loadPendingMissions();
    }

    async loadUnsyncedCounts() {
        const unsyncedTrips = await this.offlineService.getUnsyncedTrips();
        const unsyncedFuels = await this.offlineService.getUnsyncedFuels();
        const unsyncedMaintenances = await this.offlineService.getUnsyncedMaintenances();
        const unsyncedIncidents = await this.offlineService.getUnsyncedIncidents();

        this.unsyncedCounts = {
            trips: unsyncedTrips.length,
            fuels: unsyncedFuels.length,
            maintenances: unsyncedMaintenances.length,
            incidents: unsyncedIncidents.length
        };
    }

    async loadPendingMissions() {
        const token = localStorage.getItem('token');
        if (!token) return;

        const headers = new HttpHeaders({ 'x-auth-token': token });

        try {
            const movements = await this.http.get<any[]>(`${environment.apiUrl}/logbook/my-trips`, { headers }).toPromise() || [];
            this.pendingMissionsCount = movements.filter(m => m.statut === 'validé').length;
        } catch (error) {
            this.pendingMissionsCount = 0;
        }
    }

    navigateTo(route: string) {
        console.log('Navigating from dashboard:', route);
        this.router.navigate([route]);
    }

    changeVehicle() {
        this.router.navigate(['/vehicle-selector']);
    }

    logout() {
        if (confirm('Voulez-vous vraiment vous déconnecter?')) {
            this.authService.logout();
            this.router.navigate(['/login']);
        }
    }

    // NOUVEAU: Vérifier si un trip est actif
    hasActiveTrip(): boolean {
        return localStorage.getItem('activeTrip') !== null;
    }

    // NOUVEAU: Reprendre le trip actif
    resumeActiveTrip() {
        this.router.navigate(['/active-trip']);
    }
}
