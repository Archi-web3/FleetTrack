import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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
    intervalleVidange: {
        bonneQualite: number;
        mauvaiseQualite: number;
    };
    qualiteCarburant: 'Bonne' | 'Mauvaise' | 'Inconnue';
    actif: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class MaintenanceService {
    private apiUrl = 'https://fleettrack-api.onrender.com/api/maintenance';

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
        return this.http.get<any>(`${this.apiUrl}/stats/global`, this.getHeaders());
    }

    getAllServiceAlerts(): Observable<ServiceSchedule[]> {
        return this.http.get<ServiceSchedule[]>(`${this.apiUrl}/service/alerts`, this.getHeaders());
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
