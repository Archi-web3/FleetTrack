import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WeeklyChecklist {
    _id: string;
    vehicule: any;
    semaine: number;
    annee: number;
    chauffeur: any;
    taches: Task[];
    completee: boolean;
    tauxCompletion: number;
    dateCreation: Date;
    dateCompletion?: Date;
}

export interface Task {
    _id: string;
    numero: string;
    categorie: string;
    description: string;
    numeroTacheManuel: string;
    validee: boolean;
    dateValidation?: Date;
    validatorName?: string;
    commentaire?: string;
}

export interface ServiceSchedule {
    _id: string;
    vehicule: any;
    typeService: 'A' | 'B' | 'C';
    kilometragePrevu: number;
    kilometrageActuel: number;
    statut: 'À venir' | 'Dû' | 'En retard' | 'Complété';
    dateAlerte?: Date;
    taches: Task[];
    signature?: {
        superviseur: any;
        date: Date;
        signatureData: string;
    };
    dateCreation: Date;
    dateCompletion?: Date;
    prochainService?: {
        type: 'A' | 'B' | 'C';
        kilometrage: number;
    };
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
    private apiUrl = `${environment.apiUrl}/maintenance`;

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
    // WEEKLY CHECKLIST
    // ============================================

    getCurrentWeeklyChecklist(vehiculeId: string): Observable<WeeklyChecklist> {
        return this.http.get<WeeklyChecklist>(`${this.apiUrl}/weekly/current?vehicule=${vehiculeId}`, this.getHeaders());
    }

    validateTask(checklistId: string, tacheId: string, validee: boolean, commentaire?: string): Observable<WeeklyChecklist> {
        return this.http.post<WeeklyChecklist>(`${this.apiUrl}/weekly/validate-task`, {
            checklistId,
            tacheId,
            validee,
            commentaire
        }, this.getHeaders());
    }

    getWeeklyChecklistHistory(vehiculeId?: string, limit: number = 10): Observable<WeeklyChecklist[]> {
        const params = vehiculeId ? `?vehicule=${vehiculeId}&limit=${limit}` : `?limit=${limit}`;
        return this.http.get<WeeklyChecklist[]>(`${this.apiUrl}/weekly/history${params}`, this.getHeaders());
    }

    // ============================================
    // SERVICE SCHEDULE
    // ============================================

    getNextService(vehiculeId: string): Observable<ServiceSchedule> {
        return this.http.get<ServiceSchedule>(`${this.apiUrl}/service/next?vehicule=${vehiculeId}`, this.getHeaders());
    }

    completeService(serviceId: string, signature: string): Observable<ServiceSchedule> {
        return this.http.post<ServiceSchedule>(`${this.apiUrl}/service/complete`, {
            serviceId,
            signature
        }, this.getHeaders());
    }

    getServiceAlerts(): Observable<ServiceSchedule[]> {
        return this.http.get<ServiceSchedule[]>(`${this.apiUrl}/service/alerts`, this.getHeaders());
    }

    updateServiceTasks(serviceId: string, taches: Task[]): Observable<ServiceSchedule> {
        return this.http.put<ServiceSchedule>(`${this.apiUrl}/service/${serviceId}/tasks`, {
            taches
        }, this.getHeaders());
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
}
