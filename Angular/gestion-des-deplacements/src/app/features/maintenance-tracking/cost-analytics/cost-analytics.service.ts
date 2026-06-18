import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface TCOData {
    totalCost: number;
    breakdown: {
        fuel: number;
        maintenance: number;
        incidents: number;
        fixed: number;
    };
    vehicleCount: number;
}

export interface CostForecast {
    predictedTotal: number;
    confidence: string;
    trend: string;
}

export interface ReliabilityStat {
    model: string;
    costPerKm: number;
    reliabilityScore: number;
    vehicleCount: number;
    totalIncidents: number;
}

@Injectable({
    providedIn: 'root'
})
export class CostAnalyticsService {
    private apiUrl = `${environment.apiUrl}/analytics`;

    constructor(private http: HttpClient) { }

    getTCO(startDate?: string, endDate?: string, vehicleId?: string): Observable<TCOData> {
        let params: any = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (vehicleId) params.vehicleId = vehicleId;

        return this.http.get<TCOData>(`${this.apiUrl}/costs/tco`, { params });
    }

    getCostForecast(months: number = 1): Observable<CostForecast> {
        return this.http.get<CostForecast>(`${this.apiUrl}/costs/forecast?months=${months}`);
    }

    getReliabilityRanking(): Observable<ReliabilityStat[]> {
        return this.http.get<ReliabilityStat[]>(`${this.apiUrl}/reliability`);
    }
}
