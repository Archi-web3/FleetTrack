import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  qualiteCarburant: 'Bonne' | 'Mauvaise' | 'Inconnue';
  actif: boolean;
  sequenceMode?: 'Predefined' | 'Custom';
  customSequence?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/maintenance`;

  // ── Dashboard & Stats ──────────────────────────────────────────

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getMaintenanceOverview(params: any = {}): Observable<any[]> {
    const baseUrl = this.apiUrl.replace('/maintenance', '/maintenance-tracking');
    return this.http.get<any[]>(`${baseUrl}/overview`, { params });
  }

  getAllServiceAlerts(): Observable<ServiceSchedule[]> {
    return this.http.get<ServiceSchedule[]>(`${this.apiUrl}/service/alerts`);
  }

  getNextService(vehicleId: string): Observable<ServiceSchedule> {
    return this.http.get<ServiceSchedule>(`${this.apiUrl}/service/next?vehicule=${vehicleId}`);
  }

  completeService(serviceId: string, signature = 'N/A'): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/service/complete`, { serviceId, signature });
  }

  getWeeklyChecklistHistory(vehicleId: string, limit = 50): Observable<WeeklyChecklist[]> {
    return this.http.get<WeeklyChecklist[]>(
      `${this.apiUrl}/weekly/history?vehicule=${vehicleId}&limit=${limit}`,
    );
  }

  // ── Configuration ──────────────────────────────────────────────

  getConfigs(): Observable<MaintenanceConfig[]> {
    return this.http.get<MaintenanceConfig[]>(`${this.apiUrl}/config`);
  }

  createConfig(config: Partial<MaintenanceConfig>): Observable<MaintenanceConfig> {
    return this.http.post<MaintenanceConfig>(`${this.apiUrl}/config`, config);
  }

  updateConfig(id: string, config: Partial<MaintenanceConfig>): Observable<MaintenanceConfig> {
    return this.http.put<MaintenanceConfig>(`${this.apiUrl}/config/${id}`, config);
  }

  deleteConfig(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/config/${id}`);
  }

  // ── Templates ──────────────────────────────────────────────────

  getTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/template`);
  }

  createTemplate(template: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/template`, template);
  }

  updateTemplate(id: string, template: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/template/${id}`, template);
  }

  deleteTemplate(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/template/${id}`);
  }
}
