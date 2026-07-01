import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChauffeurService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = `${environment.apiUrl}/chauffeurs`;

  getChauffeurs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getChauffeurById(id: string): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addChauffeur(chauffeurData: any): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.post<any>(this.apiUrl, chauffeurData);
  }

  updateChauffeur(id: string, chauffeurData: any): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.put<any>(`${this.apiUrl}/${id}`, chauffeurData);
  }

  deleteChauffeur(id: string): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
