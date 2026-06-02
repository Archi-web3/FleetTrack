import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    private apiUrl = `${environment.apiUrl}/stats`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    // Récupérer les statistiques globales avec filtres
    getStatsGlobales(dateDebut?: string, dateFin?: string, projet?: string, vehicule?: string): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('x-auth-token', token ? token : '');

        let params = new HttpParams();
        if (dateDebut) params = params.set('dateDebut', dateDebut);
        if (dateFin) params = params.set('dateFin', dateFin);
        if (projet) params = params.set('projet', projet);
        if (vehicule) params = params.set('vehicule', vehicule);

        return this.http.get(`${this.apiUrl}/global`, { headers, params });
    }

    // Récupérer les statistiques par projet avec filtres
    getStatsParProjet(dateDebut?: string, dateFin?: string, vehicule?: string): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('x-auth-token', token ? token : '');

        let params = new HttpParams();
        if (dateDebut) params = params.set('dateDebut', dateDebut);
        if (dateFin) params = params.set('dateFin', dateFin);
        if (vehicule) params = params.set('vehicule', vehicule);

        return this.http.get(`${this.apiUrl}/par-projet`, { headers, params });
    }

    // Récupérer la liste des véhicules pour le filtre
    getVehicules(): Observable<any[]> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
        return this.http.get<any[]>(`${this.apiUrl}/vehicules`, { headers });
    }

    // Récupérer la liste des projets pour le filtre
    getProjets(): Observable<string[]> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
        return this.http.get<string[]>(`${this.apiUrl}/projets`, { headers });
    }
}

