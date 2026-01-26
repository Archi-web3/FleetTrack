import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {
    private apiUrl = 'https://fleettrack-api.onrender.com/api/environment';

    constructor(private http: HttpClient) { }

    // --- ACTIONS (Roadmap) ---
    getActions(year: number, base: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/actions?year=${year}&base=${base}`);
    }

    createAction(action: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/actions`, action);
    }

    updateAction(id: string, action: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/actions/${id}`, action);
    }

    deleteAction(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/actions/${id}`);
    }

    // --- DATA (Monthly IAP) ---
    getData(year: number, base: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/data?year=${year}&base=${base}`);
    }

    saveData(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/data`, data);
    }

    // --- AUTOMATION (Auto-fill) ---
    getAggregatedStats(year: number, month: number, base: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/aggregate?year=${year}&month=${month}&base=${base}`);
    }
}
