import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class LogbookService {
    private apiUrl = 'https://fleettrack-api.onrender.com/api/logbook';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders().set('x-auth-token', token || '');
    }

    getFuelsByVehicle(vehicleId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/fuels/${vehicleId}`, { headers: this.getHeaders() });
    }

    getMaintenancesByVehicle(vehicleId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/maintenances/${vehicleId}`, { headers: this.getHeaders() });
    }

    getIncidentsByVehicle(vehicleId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/incidents/${vehicleId}`, { headers: this.getHeaders() });
    }

    // --- DELETE Methods ---
    deleteFuel(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/fuels/${id}`, { headers: this.getHeaders() });
    }

    deleteMaintenance(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/maintenances/${id}`, { headers: this.getHeaders() });
    }

    deleteIncident(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/incidents/${id}`, { headers: this.getHeaders() });
    }

    // --- UPDATE Methods ---
    updateFuel(id: string, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/fuels/${id}`, data, { headers: this.getHeaders() });
    }

    updateMaintenance(id: string, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/maintenances/${id}`, data, { headers: this.getHeaders() });
    }

    updateIncident(id: string, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/incidents/${id}`, data, { headers: this.getHeaders() });
    }
}

