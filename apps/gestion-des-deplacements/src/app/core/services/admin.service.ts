import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}`;

  // Country (Pays) endpoints
  getPays(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pays`);
  }

  addPays(pays: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pays`, pays);
  }

  updatePays(id: string, pays: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/pays/${id}`, pays);
  }

  deletePays(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/pays/${id}`);
  }

  // Base endpoints
  getBases(paysId?: string): Observable<any[]> {
    const url = paysId ? `${this.apiUrl}/bases?pays=${paysId}` : `${this.apiUrl}/bases`;
    return this.http.get<any[]>(url);
  }

  addBase(base: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bases`, base);
  }

  updateBase(id: string, base: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/bases/${id}`, base);
  }

  deleteBase(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/bases/${id}`);
  }

  // Vehicle endpoints
  getVehicules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehicules`);
  }
}
