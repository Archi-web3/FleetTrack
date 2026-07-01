import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehiculeService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = `${environment.apiUrl}/vehicules`;

  getVehicules(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getVehiculeById(id: string): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addVehicule(vehiculeData: any): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.post<any>(this.apiUrl, vehiculeData);
  }

  updateVehicule(id: string, vehiculeData: any): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.put<any>(`${this.apiUrl}/${id}`, vehiculeData);
  }

  deleteVehicule(id: string): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // --- VEHICLE 360 PROFILE METHODS ---

  getVehicleMaintenances(vehicleId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/logbook/maintenances/${vehicleId}`);
  }

  getVehicleFuels(vehicleId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/logbook/fuels/${vehicleId}`);
  }

  getVehicleIncidents(vehicleId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/logbook/incidents/${vehicleId}`);
  }

  getVehicleTrips(vehicleId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/mouvements?vehicule=${vehicleId}`);
  }

  getVehicleWeeklyChecklists(vehicleId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiUrl}/maintenance/weekly/history?vehicule=${vehicleId}`,
    );
  }
}
