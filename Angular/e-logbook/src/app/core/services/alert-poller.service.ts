import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, switchMap, filter, take, EMPTY } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
// import { environment } from '../../environments/environment'; // Non utilisé ici car API_URL hardcodé

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

        timer(0, 10000).pipe( // 10 secondes
            switchMap(() => {
                console.log('[AlertPoller] Checking alerts...');
                return this.getUnreadAlerts(vehicleId);
            }),
            filter(alerts => {
                if (alerts && alerts.length > 0) {
                    console.log('[AlertPoller] Alertes reçues !', alerts);
                    return true;
                }
                return false;
            })
        ).subscribe(alerts => {
            const latestAlert = alerts[0];
            this.openAlertDialog(latestAlert, vehicleId);
        });
    }

    private getHeaders() {
        const token = localStorage.getItem('token');
        return {
            headers: { 'x-auth-token': token || '' }
        };
    }

    getUnreadAlerts(vehicleId: string): Observable<any[]> {
        return this.http.get<any[]>(`${API_URL}/unread?vehicleId=${vehicleId}`, this.getHeaders());
    }

    markAsRead(alertId: string, vehicleId: string): Observable<any> {
        return this.http.post(`${API_URL}/${alertId}/read`, { vehicleId }, this.getHeaders());
    }

    // Récupérer la liste des alertes reçues (inbox)
    getInboxAlerts(vehicleId: string): Observable<any[]> {
        const t = new Date().getTime();
        return this.http.get<any[]>(`${API_URL}/unread?vehicleId=${vehicleId}&mode=inbox&t=${t}`, this.getHeaders());
    }

    // Masquer une alerte (Inbox delete)
    hideAlert(alertId: string, vehicleId: string): Observable<any> {
        return this.http.put(`${API_URL}/${alertId}/hide`, { vehicleId }, this.getHeaders());
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
