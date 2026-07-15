import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = `${environment.apiUrl}/utilisateurs`;

  getUtilisateurs(scope?: string): Observable<any[]> {
    const url = scope ? `${this.apiUrl}?scope=${scope}` : this.apiUrl;
    return this.http.get<any[]>(url);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addUser(userData: any): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.post<any>(this.apiUrl, userData);
  }

  updateUser(id: string, userData: any): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.put<any>(`${this.apiUrl}/${id}`, userData);
  }

  deleteUser(id: string): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
