import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Pays {
  _id: string;
  nom: string;
  code: string;
  devise?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaysService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/pays`;
  private readonly STORAGE_KEY = 'selectedCountry';
  // API Calls
  getPays(): Observable<Pays[]> {
    return this.http.get<Pays[]>(this.apiUrl);
  }

  createPays(pays: Partial<Pays>): Observable<Pays> {
    return this.http.post<Pays>(this.apiUrl, pays);
  }

  updatePays(id: string, pays: Partial<Pays>): Observable<Pays> {
    return this.http.put<Pays>(`${this.apiUrl}/${id}`, pays);
  }

  deletePays(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // LocalStorage Management
  getSelectedCountry(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  setSelectedCountry(countryId: string): void {
    localStorage.setItem(this.STORAGE_KEY, countryId);
  }

  clearSelectedCountry(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
