import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjetService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = `${environment.apiUrl}/projets`;

  // Récupérer tous les projets
  getProjets(includeInactifs = false): Observable<any[]> {
    let params = new HttpParams();
    if (includeInactifs) {
      params = params.set('includeInactifs', 'true');
    }

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // Récupérer un projet par ID
  getProjetById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Créer un projet
  addProjet(projetData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, projetData);
  }

  // Mettre à jour un projet
  updateProjet(id: string, projetData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, projetData);
  }

  // Supprimer un projet
  deleteProjet(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
