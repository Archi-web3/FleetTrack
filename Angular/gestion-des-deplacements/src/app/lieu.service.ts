import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LieuService {
  private apiUrl = `${environment.apiUrl}/lieux`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getLieux(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  getLieuById(id: string): Observable<any> { // NOUVELLE MÉTHODE
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  addLieu(lieuData: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.post<any>(this.apiUrl, lieuData, { headers });
  }

  updateLieu(id: string, lieuData: any): Observable<any> { // NOUVELLE MÉTHODE
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.put<any>(`${this.apiUrl}/${id}`, lieuData, { headers });
  }

  deleteLieu(id: string): Observable<any> { // NOUVELLE MÉTHODE
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('x-auth-token', token ? token : '');
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}

