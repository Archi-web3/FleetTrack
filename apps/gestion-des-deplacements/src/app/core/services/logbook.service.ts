import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LogbookService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/logbook`;

  // Read
  getFuelsByVehicle(vehicleId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fuels/${vehicleId}`);
  }

  getMaintenancesByVehicle(vehicleId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/maintenances/${vehicleId}`);
  }

  getIncidentsByVehicle(vehicleId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incidents/${vehicleId}`);
  }

  // Create
  addMaintenance(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/maintenances`, data);
  }

  // Delete
  deleteFuel(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/fuels/${id}`);
  }

  deleteMaintenance(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/maintenances/${id}`);
  }

  deleteIncident(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/incidents/${id}`);
  }

  // Update
  updateFuel(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/fuels/${id}`, data);
  }

  updateMaintenance(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/maintenances/${id}`, data);
  }

  updateIncident(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/incidents/${id}`, data);
  }
}
