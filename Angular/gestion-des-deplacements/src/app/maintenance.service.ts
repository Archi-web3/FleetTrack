import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


export interface WeeklyChecklist {
    _id: string;
    vehicule: any;
    semaine: number;
    annee: number;
    chauffeur: any;
    taches: any[];
    completee: boolean;
    tauxCompletion: number;
    dateCreation: Date;
    dateCompletion?: Date;
}

export interface ServiceSchedule {
    _id: string;
    vehicule: any;
    typeService: 'A' | 'B' | 'C';
    kilometragePrevu: number;
    kilometrageActuel: number;
    statut: 'À venir' | 'Dû' | 'En retard' | 'Complété';
    dateAlerte?: Date;
    taches: any[];
    dateCreation: Date;
    dateCompletion?: Date;
}

export interface MaintenanceConfig {
    _id: string;
    typeVehicule: string;
    conditionsRoute: string;
    intervalleService: number;
    // intervalleVidange removed
    qualiteCarburant: 'Bonne' | 'Mauvaise' | 'Inconnue';
    actif: boolean;
    sequenceMode?: 'Predefined' | 'Custom';
    customSequence?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class MaintenanceService {
    private apiUrl = `${environment.apiUrl}/maintenance`;
    // private apiUrl = 'http://localhost:3000/api/maintenance';

    constructor(private http: HttpClient) { }

    private getHeaders() {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token || ''
            }
        };
    }

    // ============================================
    // DASHBOARD & STATS
    // ============================================

    getDashboardStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/stats`, this.getHeaders());
    }

    getMaintenanceOverview(params: any = {}): Observable<any[]> {
        // Note: Route is in 'maintenance-tracking', not 'maintenance'
        // Need to handle URL difference or update base URL logic if they allow it.
        // Assuming /api/maintenance-tracking is accessible.
        const baseUrl = this.apiUrl.replace('/maintenance', '/maintenance-tracking');
        return this.http.get<any[]>(`${baseUrl}/overview`, { ...this.getHeaders(), params });
    }

    getAllServiceAlerts(): Observable<ServiceSchedule[]> {
        return this.http.get<ServiceSchedule[]>(`${this.apiUrl}/service/alerts`, this.getHeaders());
    }

    getNextService(vehiculeId: string): Observable<ServiceSchedule> {
        return this.http.get<ServiceSchedule>(`${this.apiUrl}/service/next?vehicule=${vehiculeId}`, this.getHeaders());
    }

    completeService(serviceId: string, signature: string = 'N/A'): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/service/complete`, { serviceId, signature }, this.getHeaders());
    }

    getWeeklyChecklistHistory(vehiculeId: string, limit: number = 50): Observable<WeeklyChecklist[]> {
        return this.http.get<WeeklyChecklist[]>(`${this.apiUrl}/weekly/history?vehicule=${vehiculeId}&limit=${limit}`, this.getHeaders());
    }

    // ============================================
    // CONFIGURATION
    // ============================================

    getConfigs(): Observable<MaintenanceConfig[]> {
        return this.http.get<MaintenanceConfig[]>(`${this.apiUrl}/config`, this.getHeaders());
    }

    createConfig(config: Partial<MaintenanceConfig>): Observable<MaintenanceConfig> {
        return this.http.post<MaintenanceConfig>(`${this.apiUrl}/config`, config, this.getHeaders());
    }

    updateConfig(id: string, config: Partial<MaintenanceConfig>): Observable<MaintenanceConfig> {
        return this.http.put<MaintenanceConfig>(`${this.apiUrl}/config/${id}`, config, this.getHeaders());
    }

    deleteConfig(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/config/${id}`, this.getHeaders());
    }

    // ============================================
    // TEMPLATES
    // ============================================

    getTemplates(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/template`, this.getHeaders());
    }

    createTemplate(template: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/template`, template, this.getHeaders());
    }

    updateTemplate(id: string, template: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/template/${id}`, template, this.getHeaders());
    }

    deleteTemplate(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/template/${id}`, this.getHeaders());
    }
}
