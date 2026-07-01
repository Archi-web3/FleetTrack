import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface VehicleOverview {
  vehicule: {
    _id: string;
    immatriculation: string;
    marque: string;
    modele: string;
    type: string;
    kilometrage: number;
    base: any;
  };
  dernierService: {
    type: string;
    date: Date;
    km: number;
  } | null;
  prochainService: {
    type: string;
    kmPrevu: number;
    statut: string;
  } | null;
  ecartKm: number | null;
  statusCode: 'ok' | 'proche' | 'retard' | 'critique';
}

interface VehicleDetail {
  vehicule: any;
  config: {
    intervalleService: number;
    conditionsRoute: string;
  } | null;
  historique: any[];
  aVenir: any[];
  stats: {
    totalServices: number;
    completes: number;
    enAttente: number;
  };
}

interface Alert {
  vehicule: any;
  service: any;
  ecartKm: number;
  criticite: 'critique' | 'retard' | 'proche';
}

interface PredictivePlan {
  moyenneKmParMois: number;
  historique: number;
  predictions: {
    service: { type: string; kmPrevu: number };
    kmRestants: number;
    dateEstimee: Date;
    moisEstimes: number;
  }[];
}

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceTrackingService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/maintenance-tracking`;

  /**
   * Récupère la vue d'ensemble de tous les véhicules
   */
  getOverview(filters?: {
    base?: string;
    statut?: string;
    typeVehicule?: string;
  }): Observable<VehicleOverview[]> {
    let url = `${this.apiUrl}/overview`;
    const params: string[] = [];

    if (filters?.base) params.push(`base=${filters.base}`);
    if (filters?.statut) params.push(`statut=${filters.statut}`);
    if (filters?.typeVehicule) params.push(`typeVehicule=${filters.typeVehicule}`);

    if (params.length > 0) url += '?' + params.join('&');

    return this.http.get<VehicleOverview[]>(url);
  }

  /**
   * Récupère les détails complets d'un véhicule
   */
  getVehicleDetail(vehicleId: string): Observable<VehicleDetail> {
    return this.http.get<VehicleDetail>(`${this.apiUrl}/vehicle/${vehicleId}`);
  }

  /**
   * Récupère les alertes urgentes
   */
  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}/alerts`);
  }

  /**
   * Récupère le planning prévisionnel d'un véhicule
   */
  getPredictivePlan(vehicleId: string): Observable<PredictivePlan> {
    return this.http.get<PredictivePlan>(`${this.apiUrl}/predictive/${vehicleId}`);
  }

  /**
   * Récupère la santé globale de la flotte (Maintenance Prédictive)
   */
  getFleetHealth(): Observable<any> {
    // Note: L'URL doit correspondre à celle définie dans backend/routes/predictive.js
    // index.js définit app.use('/api/predictive', ...) et router.get('/fleet-health', ...)
    // Donc URL = /api/predictive/fleet-health
    const predictiveApi = this.apiUrl.replace('maintenance-tracking', 'predictive');
    return this.http.get<any>(`${predictiveApi}/fleet-health`);
  }

  /**
   * Récupère le prochain service pour un véhicule (avec ses tâches)
   * Utilise l'API définie dans backend/routes/maintenance.js
   */
  getNextService(vehiculeId: string): Observable<any> {
    const maintenanceApi = this.apiUrl.replace('maintenance-tracking', 'maintenance');
    return this.http.get<any>(`${maintenanceApi}/service/next?vehicule=${vehiculeId}`);
  }

  /**
   * Met à jour les tâches d'un service
   */
  updateServiceTasks(serviceId: string, taches: any[]): Observable<any> {
    const maintenanceApi = this.apiUrl.replace('maintenance-tracking', 'maintenance');
    return this.http.put<any>(`${maintenanceApi}/service/${serviceId}/tasks`, { taches });
  }

  /**
   * Marque un service comme complété
   */
  completeService(serviceId: string, signature = 'WEB_VALIDATION'): Observable<any> {
    const maintenanceApi = this.apiUrl.replace('maintenance-tracking', 'maintenance');
    return this.http.post<any>(`${maintenanceApi}/service/complete`, { serviceId, signature });
  }
}
