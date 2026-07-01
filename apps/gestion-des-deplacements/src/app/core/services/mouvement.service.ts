import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MouvementService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = `${environment.apiUrl}/mouvements`;

  getMouvements(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getMouvementById(id: string): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getMouvementsByChauffeur(chauffeurId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?chauffeurId=${chauffeurId}`);
  }
  getPlanningMouvements(includePending = false): Observable<any[]> {
    // MODIFIÉ

    const url = includePending
      ? `${this.apiUrl}/planning?includePending=true`
      : `${this.apiUrl}/planning`;
    return this.http.get<any[]>(url);
  }

  addMouvement(mouvementData: any, force = false): Observable<any> {
    const url = force ? `${this.apiUrl}?force=true` : this.apiUrl;
    return this.http.post<any>(url, mouvementData);
  }

  updateMouvement(id: string, mouvementData: any, force = false): Observable<any> {
    const url = force ? `${this.apiUrl}/${id}?force=true` : `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, mouvementData);
  }

  // VALIDATION SÉCURISÉE (MODULE 2)
  validateMouvement(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/validate`, {});
  }

  deleteMouvement(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  getStatsByStatus(): Observable<any[]> {
    // NOUVELLE MÉTHODE

    return this.http.get<any[]>(`${this.apiUrl}/stats-by-status`);
  }

  getMouvementSuggestions(mouvementId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/suggestions/${mouvementId}`);
  }

  cleanGhosts(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cleanup/ghosts`);
  }

  fixCountries(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/fix-countries`, {});
  }
}
