import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuditLog {
  _id: string;
  actor: {
    userId: string;
    nom: string;
    role: string;
  };
  action: string;
  category: string;
  target: string;
  details: any;
  ip: string;
  timestamp: Date;
  pays?: {
    _id: string;
    nom: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private http = inject(HttpClient);

  private apiUrl = 'https://fleettrack-api.onrender.com/api/audit';

  getLogs(limit = 50, category?: string, countryId?: string): Observable<AuditLog[]> {
    const params: any = { limit: limit.toString() };
    if (category) params.category = category;
    if (countryId) params.pays = countryId;

    return this.http.get<AuditLog[]>(this.apiUrl, { params });
  }

  clearLogs(): Observable<any> {
    return this.http.delete(this.apiUrl);
  }
}
