import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'https://fleettrack-api.onrender.com/api';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders().set('x-auth-token', token || '');
    }

    // PAYS
    getPays(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/pays`, { headers: this.getHeaders() });
    }

    addPays(pays: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/pays`, pays, { headers: this.getHeaders() });
    }

    updatePays(id: string, pays: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/pays/${id}`, pays, { headers: this.getHeaders() });
    }

    deletePays(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/pays/${id}`, { headers: this.getHeaders() });
    }

    // BASES
    getBases(paysId?: string): Observable<any[]> {
        let url = `${this.apiUrl}/bases`;
        if (paysId) {
            url += `?pays=${paysId}`;
        }
        return this.http.get<any[]>(url, { headers: this.getHeaders() });
    }

    addBase(base: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/bases`, base, { headers: this.getHeaders() });
    }

    updateBase(id: string, base: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/bases/${id}`, base, { headers: this.getHeaders() });
    }

    deleteBase(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/bases/${id}`, { headers: this.getHeaders() });
    }

    // VEHICULES
    getVehicules(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/vehicules`, { headers: this.getHeaders() });
    }
}

