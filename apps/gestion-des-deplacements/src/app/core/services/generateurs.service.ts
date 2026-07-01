import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Generateur {
  _id?: string;
  marque: string;
  modele: string;
  puissanceKVA: number;
  numeroSerie: string;
  numeroMoteur?: string;
  acfCode?: string;
  categorie?: string;
  proprietaire?: string;
  typeCarburant?: string;
  anneeFabrication?: number;
  anneePremiereUtilisation?: number;
  coutAssuranceAnnuel?: number;
  dateCommencement?: Date;
  base: any; // ID ou object populé
  pays?: any;
  siteInstallation?: string;
  statut: string;
  heuresInitiales?: number;
  heuresFonctionnement: number;
  consommationTheorique: number;
  remarques?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GenerateursService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/generateurs';

  // ==========================================
  // CRUD
  // ==========================================
  getGenerateurs(): Observable<Generateur[]> {
    return this.http.get<Generateur[]>(this.apiUrl);
  }

  getGenerateur(id: string): Observable<Generateur> {
    return this.http.get<Generateur>(`${this.apiUrl}/${id}`);
  }

  createGenerateur(data: Generateur): Observable<Generateur> {
    return this.http.post<Generateur>(this.apiUrl, data);
  }

  updateGenerateur(id: string, data: Partial<Generateur>): Observable<Generateur> {
    return this.http.put<Generateur>(`${this.apiUrl}/${id}`, data);
  }

  deleteGenerateur(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ==========================================
  // LOGBOOK
  // ==========================================
  getLogbooks(generateurId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${generateurId}/logbooks`);
  }

  addLogbook(generateurId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${generateurId}/logbooks`, data);
  }

  // ==========================================
  // INTERVENTIONS (MAINTENANCE)
  // ==========================================
  getInterventions(generateurId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${generateurId}/interventions`);
  }

  createIntervention(generateurId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${generateurId}/interventions`, data);
  }

  updateIntervention(interventionId: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/interventions/${interventionId}`, data);
  }

  // ==========================================
  // PRÉDICTION & CALENDRIER
  // ==========================================
  getMaintenanceOverview(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/maintenance/overview`);
  }
}
