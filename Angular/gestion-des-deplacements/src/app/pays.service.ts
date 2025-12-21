import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pays {
    _id: string;
    nom: string;
    code: string;
    devise?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaysService {
    private apiUrl = 'https://fleettrack-api.onrender.com/api/pays';
    private readonly STORAGE_KEY = 'selectedCountry';

    constructor(private http: HttpClient) { }

    private getHeaders() {
        const token = localStorage.getItem('jwtToken');
        return new HttpHeaders().set('x-auth-token', token || '');
    }

    // API Calls
    getPays(): Observable<Pays[]> {
        return this.http.get<Pays[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    createPays(pays: Partial<Pays>): Observable<Pays> {
        return this.http.post<Pays>(this.apiUrl, pays, { headers: this.getHeaders() });
    }

    updatePays(id: string, pays: Partial<Pays>): Observable<Pays> {
        return this.http.put<Pays>(`${this.apiUrl}/${id}`, pays, { headers: this.getHeaders() });
    }

    deletePays(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
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

