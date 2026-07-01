import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = `${environment.apiUrl}/stats`;

  // Récupérer les statistiques globales avec filtres
  getStatsGlobales(
    dateDebut?: string,
    dateFin?: string,
    projet?: string,
    vehicule?: string,
  ): Observable<any> {
    let params = new HttpParams();
    if (dateDebut) params = params.set('dateDebut', dateDebut);
    if (dateFin) params = params.set('dateFin', dateFin);
    if (projet) params = params.set('projet', projet);
    if (vehicule) params = params.set('vehicule', vehicule);

    return this.http.get(`${this.apiUrl}/global`, { params });
  }

  // Récupérer les statistiques par projet avec filtres
  getStatsParProjet(dateDebut?: string, dateFin?: string, vehicule?: string): Observable<any> {
    let params = new HttpParams();
    if (dateDebut) params = params.set('dateDebut', dateDebut);
    if (dateFin) params = params.set('dateFin', dateFin);
    if (vehicule) params = params.set('vehicule', vehicule);

    return this.http.get(`${this.apiUrl}/par-projet`, { params });
  }

  // Récupérer la liste des véhicules pour le filtre
  getVehicules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehicules`);
  }

  // Récupérer la liste des projets pour le filtre
  getProjets(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/projets`);
  }
}
