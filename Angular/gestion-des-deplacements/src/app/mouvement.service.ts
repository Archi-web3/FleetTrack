import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MouvementService {

  private apiUrl = 'http://localhost:3000/api/mouvements';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getMouvements(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any[]>(this.apiUrl, { headers });
  }
  getMouvementById(id: string): Observable<any> { // NOUVELLE MÉTHODE
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }
  getPlanningMouvements(): Observable<any[]> { // NOUVELLE MÉTHODE
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any[]>(`${this.apiUrl}/planning`, { headers });
  }

  addMouvement(mouvementData: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.post<any>(this.apiUrl, mouvementData, { headers });
  }

  updateMouvement(id: string, mouvementData: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.put<any>(`${this.apiUrl}/${id}`, mouvementData, { headers });
  }

  deleteMouvement(id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
  getStatsByStatus(): Observable<any[]> { // NOUVELLE MÉTHODE
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any[]>(`${this.apiUrl}/stats-by-status`, { headers });
  }

  getMouvementSuggestions(mouvementId: string): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any[]>(`${this.apiUrl}/suggestions/${mouvementId}`, { headers });
  }
}
