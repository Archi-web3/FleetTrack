import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WeeklyChecklist {
  _id: string;
  vehicule: { _id: string; immatriculation?: string };
  semaine: number;
  annee: number;
  chauffeur: { _id: string; nom?: string };
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
  vehicule: { _id: string; immatriculation?: string };
  typeService: 'A' | 'B' | 'C';
  kilometragePrevu: number;
  kilometrageActuel: number;
  statut: 'À venir' | 'Dû' | 'En retard' | 'Complété';
  dateAlerte?: Date;
  taches: Task[];
  signature?: {
    superviseur: { _id: string; nom?: string };
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

export interface ChecklistTemplate {
  _id: string;
  typeVehicule: string;
  taches: Task[];
  actif: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/maintenance`;

  // ============================================
  // WEEKLY CHECKLIST
  // ============================================

  getCurrentWeeklyChecklist(vehiculeId: string): Observable<WeeklyChecklist> {
    return this.http.get<WeeklyChecklist>(`${this.apiUrl}/weekly/current?vehicule=${vehiculeId}`);
  }

  validateTask(
    checklistId: string,
    tacheId: string,
    validee: boolean,
    commentaire?: string,
  ): Observable<WeeklyChecklist> {
    return this.http.post<WeeklyChecklist>(`${this.apiUrl}/weekly/validate-task`, {
      checklistId,
      tacheId,
      validee,
      commentaire,
    });
  }

  getWeeklyChecklistHistory(
    vehiculeId?: string,
    limit = 10,
  ): Observable<WeeklyChecklist[]> {
    const params = vehiculeId ? `?vehicule=${vehiculeId}&limit=${limit}` : `?limit=${limit}`;
    return this.http.get<WeeklyChecklist[]>(`${this.apiUrl}/weekly/history${params}`);
  }

  // ============================================
  // SERVICE SCHEDULE
  // ============================================

  getNextService(vehiculeId: string): Observable<ServiceSchedule> {
    return this.http.get<ServiceSchedule>(`${this.apiUrl}/service/next?vehicule=${vehiculeId}`);
  }

  completeService(serviceId: string, signature: string): Observable<ServiceSchedule> {
    return this.http.post<ServiceSchedule>(`${this.apiUrl}/service/complete`, {
      serviceId,
      signature,
    });
  }

  getServiceAlerts(): Observable<ServiceSchedule[]> {
    return this.http.get<ServiceSchedule[]>(`${this.apiUrl}/service/alerts`);
  }

  updateServiceTasks(serviceId: string, taches: Task[]): Observable<ServiceSchedule> {
    return this.http.put<ServiceSchedule>(`${this.apiUrl}/service/${serviceId}/tasks`, {
      taches,
    });
  }

  // ============================================
  // CONFIGURATION
  // ============================================

  getConfigs(): Observable<MaintenanceConfig[]> {
    return this.http.get<MaintenanceConfig[]>(`${this.apiUrl}/config`);
  }

  createConfig(config: Partial<MaintenanceConfig>): Observable<MaintenanceConfig> {
    return this.http.post<MaintenanceConfig>(`${this.apiUrl}/config`, config);
  }

  updateConfig(id: string, config: Partial<MaintenanceConfig>): Observable<MaintenanceConfig> {
    return this.http.put<MaintenanceConfig>(`${this.apiUrl}/config/${id}`, config);
  }

  // ============================================
  // TEMPLATES
  // ============================================

  getTemplates(): Observable<ChecklistTemplate[]> {
    return this.http.get<ChecklistTemplate[]>(`${this.apiUrl}/template`);
  }

  createTemplate(template: Partial<ChecklistTemplate>): Observable<ChecklistTemplate> {
    return this.http.post<ChecklistTemplate>(`${this.apiUrl}/template`, template);
  }

  updateTemplate(id: string, template: Partial<ChecklistTemplate>): Observable<ChecklistTemplate> {
    return this.http.put<ChecklistTemplate>(`${this.apiUrl}/template/${id}`, template);
  }
}
