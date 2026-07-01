import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, switchMap, filter } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';

export interface VehicleAlert {
  _id: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  vehicleId: string;
  read: boolean;
  hidden?: boolean;
  createdAt?: Date;
}

// Définition locale de l'URL si env manquant (par sécurité)
const API_URL = 'https://fleettrack-api.onrender.com/api/alerts';

@Injectable({
  providedIn: 'root',
})
export class AlertPollerService {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  private isPolling = false;

  startPolling(vehicleId: string): void {
    if (!vehicleId || this.isPolling) return;

    this.isPolling = true;
    timer(0, 10000)
      .pipe(
        switchMap(() => {
          return this.getUnreadAlerts(vehicleId);
        }),
        filter((alerts) => alerts && alerts.length > 0),
      )
      .subscribe((alerts) => {
        const latestAlert = alerts[0];
        this.openAlertDialog(latestAlert, vehicleId);
      });
  }

  getUnreadAlerts(vehicleId: string): Observable<VehicleAlert[]> {
    return this.http.get<VehicleAlert[]>(`${API_URL}/unread?vehicleId=${vehicleId}`);
  }

  markAsRead(alertId: string, vehicleId: string): Observable<unknown> {
    return this.http.post(`${API_URL}/${alertId}/read`, { vehicleId });
  }

  // Récupérer la liste des alertes reçues (inbox)
  getInboxAlerts(vehicleId: string): Observable<VehicleAlert[]> {
    const t = new Date().getTime();
    return this.http.get<VehicleAlert[]>(`${API_URL}/unread?vehicleId=${vehicleId}&mode=inbox&t=${t}`);
  }

  // Masquer une alerte (Inbox delete)
  hideAlert(alertId: string, vehicleId: string): Observable<unknown> {
    return this.http.put(`${API_URL}/${alertId}/hide`, { vehicleId });
  }

  private openAlertDialog(alert: VehicleAlert, vehicleId: string) {
    if (this.dialog.openDialogs.length > 0) {
      // Si on veut bloquer l'ouverture multiple : return;
    }

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '90%',
      maxWidth: '400px',
      disableClose: true,
      data: alert,
      panelClass: `alert-dialog-${alert.severity}`,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'read') {
        this.markAsRead(alert._id, vehicleId).subscribe();
      }
    });
  }
}
