import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { TripDetailsDialogComponent } from './trip-details-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-planning',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule, MatButtonModule, MatSnackBarModule, MatTabsModule, MatDialogModule, TranslateModule],
    templateUrl: './planning.html',
    styleUrls: ['./planning.scss']
})
export class PlanningComponent implements OnInit {
    movements: any[] = [];
    activeMovements: any[] = [];
    historyMovements: any[] = [];
    isLoading = true;
    currentUser: any = null;

    constructor(
        private http: HttpClient,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    async ngOnInit() {
        this.currentUser = this.getCurrentUser();
        await this.loadAssignedMovements();
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    async loadAssignedMovements() {
        const token = localStorage.getItem('token');
        if (!token) {
            this.router.navigate(['/login']);
            return;
        }

        const headers = new HttpHeaders({
            'x-auth-token': token
        });

        try {
            const allMovements = await this.http.get<any[]>(`${environment.apiUrl}/logbook/my-trips`, { headers }).toPromise() || [];
            console.log('Assigned movements loaded:', allMovements);
            this.movements = allMovements;

            // Filter movements
            this.activeMovements = allMovements.filter(m => ['validé', 'pris en charge', 'en cours'].includes(m.statut));
            this.historyMovements = allMovements.filter(m => ['terminé', 'annulé', 'refusé'].includes(m.statut));

        } catch (error) {
            console.error('Error loading assigned movements:', error);
            this.movements = [];
            this.activeMovements = [];
            this.historyMovements = [];
            this.snackBar.open('Erreur lors du chargement des missions', 'OK', { duration: 3000 });
        } finally {
            this.isLoading = false;
            this.cdr.detectChanges();
        }
    }

    getStatusColor(status: string): string {
        const colors: any = {
            'en attente': 'warn',
            'validé': 'accent',
            'pris en charge': 'primary',
            'en cours': 'primary',
            'terminé': '',
            'annulé': 'warn',
            'refusé': 'warn'
        };
        return colors[status] || '';
    }

    getStatusIcon(status: string): string {
        const icons: any = {
            'en attente': 'schedule',
            'validé': 'check_circle',
            'pris en charge': 'assignment_turned_in',
            'en cours': 'directions_car',
            'terminé': 'done_all',
            'annulé': 'cancel',
            'refusé': 'block'
        };
        return icons[status] || 'info';
    }

    getStatusKey(status: string): string {
        const statusMap: any = {
            'en attente': 'STATUS.WAITING',
            'validé': 'STATUS.VALIDATED',
            'pris en charge': 'STATUS.TAKEN_CHARGE',
            'en cours': 'STATUS.IN_PROGRESS',
            'terminé': 'STATUS.COMPLETED',
            'annulé': 'STATUS.CANCELLED',
            'refusé': 'STATUS.REFUSED'
        };
        return statusMap[status] || status;
    }

    canTakeCharge(movement: any): boolean {
        return movement.statut === 'validé';
    }

    canStart(movement: any): boolean {
        return movement.statut === 'pris en charge';
    }

    async takeCharge(movement: any) {
        const token = localStorage.getItem('token');
        if (!token) {
            this.router.navigate(['/login']);
            return;
        }

        const headers = new HttpHeaders({
            'x-auth-token': token
        });

        try {
            const updatedMovement = await this.http.post<any>(
                `${environment.apiUrl}/logbook/take-charge/${movement._id}`,
                {},
                { headers }
            ).toPromise();

            // Update local movement list and re-filter
            const index = this.movements.findIndex(m => m._id === movement._id);
            if (index !== -1) {
                this.movements[index] = updatedMovement;
                // Re-apply filters
                this.activeMovements = this.movements.filter(m => ['validé', 'pris en charge', 'en cours'].includes(m.statut));
                this.historyMovements = this.movements.filter(m => ['terminé', 'annulé', 'refusé'].includes(m.statut));
            }

            this.snackBar.open('Mission prise en charge avec succès !', 'OK', { duration: 3000 });
            this.cdr.detectChanges();
        } catch (error: any) {
            console.error('Error taking charge:', error);
            const message = error.error?.message || 'Erreur lors de la prise en charge';
            this.snackBar.open(message, 'OK', { duration: 5000 });
        }
    }

    startMovement(movement: any) {
        // Navigate to active-trip with movement data for pre-filling
        this.router.navigate(['/active-trip'], {
            state: {
                plannedMovement: movement
            }
        });
    }

    viewDetails(movement: any) {
        this.dialog.open(TripDetailsDialogComponent, {
            width: '95%',
            maxWidth: '500px',
            data: { movement }
        });
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }
}
