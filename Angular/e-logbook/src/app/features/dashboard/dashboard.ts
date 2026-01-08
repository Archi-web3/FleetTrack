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
import { MaintenanceService } from '../../core/services/maintenance.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatBadgeModule,
        MatSnackBarModule
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
    alertsCount = 0;
    showResetButton = false;

    constructor(
        private router: Router,
        private offlineService: OfflineService,
        private authService: AuthService,
        private http: HttpClient,
        private maintenanceService: MaintenanceService,
        private snackBar: MatSnackBar
    ) { }

    async ngOnInit() {
        const vehicleStr = localStorage.getItem('selectedVehicle');
        if (vehicleStr) {
            this.selectedVehicle = JSON.parse(vehicleStr);
        }

        // Subscribe to current user
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
            console.log('📊 [Dashboard] currentUser mis à jour:', user);
            this.checkAdminStatus(); // Vérifier le statut admin
        });

        // NOUVEAU: Vérifier immédiatement le statut admin depuis localStorage
        this.checkAdminStatus();

        await this.loadUnsyncedCounts();
        await this.loadPendingMissions();
        await this.loadServiceAlerts(); // NOUVEAU: Charger les alertes serveur
    }

    // NOUVEAU: Charger les alertes de service
    async loadServiceAlerts() {
        if (!this.selectedVehicle?._id) return;

        try {
            this.maintenanceService.getNextService(this.selectedVehicle._id).subscribe({
                next: (service) => {
                    if (service && (service.statut === 'Dû' || service.statut === 'En retard')) {
                        this.alertsCount = 1;
                        this.snackBar.open(`Service ${service.typeService} est ${service.statut}`, 'VOIR', {
                            duration: 5000,
                            verticalPosition: 'top'
                        }).onAction().subscribe(() => {
                            this.router.navigate(['/scheduled-service']);
                        });
                    } else {
                        this.alertsCount = 0;
                    }
                },
                error: (err) => console.error('Erreur chargement alertes:', err)
            });
        } catch (error) {
            console.error('Erreur chargement alertes:', error);
        }
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

    // NOUVEAU: Vérifier si l'utilisateur est Admin
    isAdmin(): boolean {
        console.log('🔍 [isAdmin] Vérification profil utilisateur');
        console.log('🔍 [isAdmin] currentUser:', this.currentUser);

        // Vérifier d'abord currentUser
        if (this.currentUser?.profil === 'SuperAdmin') {
            console.log('✅ [isAdmin] SuperAdmin détecté via currentUser');
            return true;
        }

        // Fallback: vérifier localStorage
        const currentUserStr = localStorage.getItem('currentUser');
        console.log('🔍 [isAdmin] localStorage currentUser:', currentUserStr);

        if (!currentUserStr) {
            console.log('❌ [isAdmin] Pas de currentUser dans localStorage');
            return false;
        }

        try {
            const user = JSON.parse(currentUserStr);
            console.log('🔍 [isAdmin] User parsé:', user);
            console.log('🔍 [isAdmin] Profil:', user.profil);
            const isSuperAdmin = user.profil === 'SuperAdmin';
            console.log(isSuperAdmin ? '✅ [isAdmin] SuperAdmin détecté via localStorage' : '❌ [isAdmin] Pas SuperAdmin');
            return isSuperAdmin;
        } catch (e) {
            console.error('❌ [isAdmin] Error parsing currentUser from localStorage:', e);
            return false;
        }
    }

    // NOUVEAU: Vérifier et mettre à jour le statut admin
    checkAdminStatus() {
        const isAdminUser = this.isAdmin();
        this.showResetButton = isAdminUser;
        console.log('🎯 [checkAdminStatus] showResetButton =', this.showResetButton);
    }

    // NOUVEAU: Réinitialiser les données locales (SuperAdmin uniquement)
    async resetLocalData() {
        if (!this.isAdmin()) {
            alert('Accès refusé. Cette fonctionnalité est réservée aux SuperAdmins.');
            return;
        }

        const confirmation = confirm(
            '⚠️ ATTENTION ⚠️\n\n' +
            'Cette action va supprimer TOUTES les données locales non synchronisées :\n' +
            '- Trajets\n' +
            '- Ravitaillements\n' +
            '- Maintenances\n' +
            '- Incidents\n' +
            '- Trip actif\n\n' +
            'Assurez-vous d\'avoir synchronisé vos données avant de continuer.\n\n' +
            'Voulez-vous vraiment continuer ?'
        );

        if (!confirmation) return;

        try {
            // Supprimer la base de données IndexedDB
            const dbDeleted = indexedDB.deleteDatabase('eLogbookDB');

            dbDeleted.onsuccess = () => {
                console.log('✅ Base de données IndexedDB supprimée');

                // Supprimer le trip actif du localStorage
                localStorage.removeItem('activeTrip');
                console.log('✅ Trip actif supprimé du localStorage');

                alert('✅ Données locales réinitialisées avec succès !\n\nLa page va se recharger.');

                // Recharger la page
                window.location.reload();
            };

            dbDeleted.onerror = (error) => {
                console.error('❌ Erreur suppression base de données:', error);
                alert('❌ Erreur lors de la réinitialisation des données.');
            };

        } catch (error) {
            console.error('❌ Erreur réinitialisation:', error);
            alert('❌ Erreur lors de la réinitialisation des données.');
        }
    }
}
