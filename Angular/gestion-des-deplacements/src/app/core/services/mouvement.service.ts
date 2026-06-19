import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MouvementService {

  private apiUrl = `${environment.apiUrl}/mouvements`;

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
  
  getMouvementsByChauffeur(chauffeurId: string): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any[]>(`${this.apiUrl}?chauffeurId=${chauffeurId}`, { headers });
  }
  getPlanningMouvements(includePending: boolean = false): Observable<any[]> { // MODIFIÉ
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    const url = includePending ? `${this.apiUrl}/planning?includePending=true` : `${this.apiUrl}/planning`;
    return this.http.get<any[]>(url, { headers });
  }

  addMouvement(mouvementData: any, force: boolean = false): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    const url = force ? `${this.apiUrl}?force=true` : this.apiUrl;
    return this.http.post<any>(url, mouvementData, { headers });
  }

  updateMouvement(id: string, mouvementData: any, force: boolean = false): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    const url = force ? `${this.apiUrl}/${id}?force=true` : `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, mouvementData, { headers });
  }

  // VALIDATION SÉCURISÉE (MODULE 2)
  validateMouvement(id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.put<any>(`${this.apiUrl}/${id}/validate`, {}, { headers });
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

  cleanGhosts(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.delete<any>(`${this.apiUrl}/cleanup/ghosts`, { headers });
  }

  fixCountries(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.post<any>(`${this.apiUrl}/fix-countries`, {}, { headers });
  }
}

