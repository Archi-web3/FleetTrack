import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
import { Movement, UserRef } from '../../core/models/api.types';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDialogModule,
    TranslateModule,
  ],
  templateUrl: './planning.html',
  styleUrls: ['./planning.scss'],
})
export class PlanningComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  movements: Movement[] = [];
  activeMovements: Movement[] = [];
  historyMovements: Movement[] = [];
  isLoading = true;
  currentUser: UserRef | null = null;

  async ngOnInit() {
    this.currentUser = this.getCurrentUser();
    await this.loadAssignedMovements();
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  async loadAssignedMovements() {
    try {
      const allMovements =
      (await this.http.get<Movement[]>(`${environment.apiUrl}/logbook/my-trips`).toPromise()) || [];
      this.movements = allMovements;
      this.activeMovements = allMovements.filter((m) =>
        ['validé', 'pris en charge', 'en cours'].includes(m.statut || ''),
      );
      this.historyMovements = allMovements.filter((m) =>
        ['terminé', 'annulé', 'refusé'].includes(m.statut || ''),
      );
    } catch (error) {
      console.error('Error loading assigned movements:', error);
      this.movements = [];
      this.activeMovements = [];
      this.historyMovements = [];
      this.snackBar.open('Error loading missions', 'OK', { duration: 3000 });
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  getStatusColor(status: string | undefined): string {
    if (!status) return '';
    const colors: Record<string, string> = {
      'en attente': 'warn',
      validé: 'accent',
      'pris en charge': 'primary',
      'en cours': 'primary',
      terminé: '',
      annulé: 'warn',
      refusé: 'warn',
    };
    return colors[status] || '';
  }

  getStatusIcon(status: string | undefined): string {
    if (!status) return 'info';
    const icons: Record<string, string> = {
      'en attente': 'schedule',
      validé: 'check_circle',
      'pris en charge': 'assignment_turned_in',
      'en cours': 'directions_car',
      terminé: 'done_all',
      annulé: 'cancel',
      refusé: 'block',
    };
    return icons[status] || 'info';
  }

  getStatusKey(status: string | undefined): string {
    if (!status) return 'STATUS.UNKNOWN';
    const statusMap: Record<string, string> = {
      'en attente': 'STATUS.WAITING',
      validé: 'STATUS.VALIDATED',
      'pris en charge': 'STATUS.TAKEN_CHARGE',
      'en cours': 'STATUS.IN_PROGRESS',
      terminé: 'STATUS.COMPLETED',
      annulé: 'STATUS.CANCELLED',
      refusé: 'STATUS.REFUSED',
    };
    return statusMap[status] || status;
  }

  canTakeCharge(movement: Movement): boolean {
    return movement.statut === 'validé';
  }

  canStart(movement: Movement): boolean {
    return movement.statut === 'pris en charge';
  }

  getLieuName(lieu: any): string {
    if (!lieu) return 'Inconnu';
    return typeof lieu === 'object' ? lieu.nom : lieu;
  }

  getVehicleDesc(vehicule: any): string {
    if (!vehicule) return '';
    if (typeof vehicule === 'string') return vehicule;
    return `${vehicule.marque || ''} ${vehicule.modele || ''} (${vehicule.immatriculation || ''})`.trim();
  }

  async takeCharge(movement: Movement) {
    try {
      const updatedMovement = await this.http
        .post<Movement>(`${environment.apiUrl}/logbook/take-charge/${movement._id}`, {})
        .toPromise();

      const index = this.movements.findIndex((m) => m._id === movement._id);
      if (index !== -1 && updatedMovement) {
        this.movements[index] = updatedMovement;
        this.activeMovements = this.movements.filter((m) =>
          ['validé', 'pris en charge', 'en cours'].includes(m.statut || ''),
        );
        this.historyMovements = this.movements.filter((m) =>
          ['terminé', 'annulé', 'refusé'].includes(m.statut || ''),
        );
      }

      this.snackBar.open('Mission taken successfully!', 'OK', { duration: 3000 });
      this.cdr.detectChanges();
    } catch (error: unknown) {
      console.error('Error taking charge:', error);
      const errObj = error as { error?: { message?: string } };
      const message = errObj.error?.message || 'Error processing request';
      this.snackBar.open(message, 'OK', { duration: 5000 });
    }
  }

  startMovement(movement: Movement) {
    // Navigate to active-trip with movement data for pre-filling
    this.router.navigate(['/active-trip'], {
      state: {
        plannedMovement: movement,
      },
    });
  }

  viewDetails(movement: Movement) {
    this.dialog.open(TripDetailsDialogComponent, {
      width: '95%',
      maxWidth: '500px',
      data: { movement },
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
