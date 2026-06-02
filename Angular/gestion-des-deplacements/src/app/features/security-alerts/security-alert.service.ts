import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alert {
    _id?: string;
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'danger';
    targetType: 'all' | 'vehicle';
    targetVehicleId?: string;
    createdBy?: any;
    createdAt?: string;
    readBy?: any[];
}

@Injectable({
    providedIn: 'root'
})
export class SecurityAlertService {
    // URL de l'API en dur comme dans AuthService (pas de fichier environment trouvé)
    private apiUrl = 'https://fleettrack-api.onrender.com/api/alerts';

    constructor(private http: HttpClient) { }

    // Créer une alerte
    createAlert(alert: Alert): Observable<Alert> {
        return this.http.post<Alert>(this.apiUrl, alert);
    }

    // Récupérer l'historique des alertes
    getAllAlerts(): Observable<Alert[]> {
        return this.http.get<Alert[]>(this.apiUrl);
    }

    // Supprimer une alerte
    deleteAlert(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
