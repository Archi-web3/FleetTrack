import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl = `${environment.apiUrl}/vehicules`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getVehicules(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  getVehiculeById(id: string): Observable<any> { // NOUVELLE MÉTHODE
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  addVehicule(vehiculeData: any): Observable<any> { // NOUVELLE MÉTHODE
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.post<any>(this.apiUrl, vehiculeData, { headers });
  }

  updateVehicule(id: string, vehiculeData: any): Observable<any> { // NOUVELLE MÉTHODE
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.put<any>(`${this.apiUrl}/${id}`, vehiculeData, { headers });
  }

  deleteVehicule(id: string): Observable<any> { // NOUVELLE MÉTHODE
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

  // --- VEHICLE 360 PROFILE METHODS ---
  
  getVehicleMaintenances(vehicleId: string): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any[]>(`${environment.apiUrl}/logbook/maintenances/${vehicleId}`, { headers });
  }

  getVehicleFuels(vehicleId: string): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any[]>(`${environment.apiUrl}/logbook/fuels/${vehicleId}`, { headers });
  }

  getVehicleIncidents(vehicleId: string): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any[]>(`${environment.apiUrl}/logbook/incidents/${vehicleId}`, { headers });
  }

  getVehicleTrips(vehicleId: string): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any[]>(`${environment.apiUrl}/mouvements?vehicule=${vehicleId}`, { headers });
  }

  getVehicleWeeklyChecklists(vehicleId: string): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any[]>(`${environment.apiUrl}/maintenance/weekly/history?vehicule=${vehicleId}`, { headers });
  }
}

