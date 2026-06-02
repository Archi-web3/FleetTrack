import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = `${environment.apiUrl}/utilisateurs`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUtilisateurs(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  addUser(userData: any): Observable<any> { // NOUVELLE MÉTHODE
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.post<any>(this.apiUrl, userData, { headers });
  }

  updateUser(id: string, userData: any): Observable<any> { // NOUVELLE MÉTHODE
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData, { headers });
  }

  deleteUser(id: string): Observable<any> { // NOUVELLE MÉTHODE
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}

