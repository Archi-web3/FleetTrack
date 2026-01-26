import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, switchMap, filter, take, EMPTY } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../shared/components/alert-dialog/alert-dialog.component'; // A créer
import { environment } from '../../environments/environment';

// Définition locale de l'URL si env manquant (par sécurité)
const API_URL = 'https://fleettrack-api.onrender.com/api/alerts';

@Injectable({
    providedIn: 'root'
})
export class AlertPollerService {
    private pollingInterval = 60000; // 60 secondes
    private isPolling = false;

    constructor(private http: HttpClient, private dialog: MatDialog) { }

    startPolling(vehicleId: string): void {
        if (!vehicleId || this.isPolling) return;

        this.isPolling = true;
        console.log('[AlertPoller] Démarrage du polling pour le véhicule:', vehicleId);

        timer(0, this.pollingInterval).pipe(
            switchMap(() => this.getUnreadAlerts(vehicleId)),
            filter(alerts => alerts && alerts.length > 0)
        ).subscribe(alerts => {
            // Afficher les alertes une par une ou la plus récente
            // On prend la plus récente pour commencer
            const latestAlert = alerts[0];
            this.openAlertDialog(latestAlert, vehicleId);
        });
    }

    getUnreadAlerts(vehicleId: string): Observable<any[]> {
        return this.http.get<any[]>(`${API_URL}/unread?vehicleId=${vehicleId}`);
    }

    markAsRead(alertId: string, vehicleId: string): Observable<any> {
        return this.http.post(`${API_URL}/${alertId}/read`, { vehicleId });
    }

    private openAlertDialog(alert: any, vehicleId: string) {
        // Vérifier si une dialog est déjà ouverte pour éviter le spam
        if (this.dialog.openDialogs.length > 0) {
            // En vrai, il faudrait vérifier SI c'est une alert dialog, mais pour l'instant simple.
            // Si on veut être strict : return;
        }

        const dialogRef = this.dialog.open(AlertDialogComponent, {
            width: '90%',
            maxWidth: '400px',
            disableClose: true, // Bloquant !
            data: alert,
            panelClass: `alert-dialog-${alert.severity}` // Permettra de styliser la bordure/couleur
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'read') {
                this.markAsRead(alert._id, vehicleId).subscribe();
            }
        });
    }
}
