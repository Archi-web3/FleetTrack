import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProjetService {
    private apiUrl = 'http://localhost:3000/api/projets';

    constructor(private http: HttpClient, private authService: AuthService) { }

    // Récupérer tous les projets
    getProjets(includeInactifs: boolean = false): Observable<any[]> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('x-auth-token', token ? token : '');

        let params = new HttpParams();
        if (includeInactifs) {
            params = params.set('includeInactifs', 'true');
        }

        return this.http.get<any[]>(this.apiUrl, { headers, params });
    }

    // Récupérer un projet par ID
    getProjetById(id: string): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
        return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
    }

    // Créer un projet
    addProjet(projetData: any): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
        return this.http.post<any>(this.apiUrl, projetData, { headers });
    }

    // Mettre à jour un projet
    updateProjet(id: string, projetData: any): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
        return this.http.put<any>(`${this.apiUrl}/${id}`, projetData, { headers });
    }

    // Supprimer un projet
    deleteProjet(id: string): Observable<any> {
        const token = this.authService.getToken();
        const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
    }
}
