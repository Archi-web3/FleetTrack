import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LieuService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = `${environment.apiUrl}/lieux`;

  getLieux(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getLieuById(id: string): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addLieu(lieuData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, lieuData);
  }

  updateLieu(id: string, lieuData: any): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.put<any>(`${this.apiUrl}/${id}`, lieuData);
  }

  deleteLieu(id: string): Observable<any> {
    // NOUVELLE MÉTHODE

    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
