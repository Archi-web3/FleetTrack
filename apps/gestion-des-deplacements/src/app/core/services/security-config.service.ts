import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SecurityRule {
  level: number;
  mandatoryValidators: string[]; // List of User IDs
  requireUnanimity: boolean;
  quorum: number;
  includeLowerLevels?: boolean;
}

export interface SecurityConfig {
  pays: string;
  base?: string;
  rules: SecurityRule[];
}

@Injectable({
  providedIn: 'root',
})
export class SecurityConfigService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/security-config`;

  getConfig(baseId?: string | null): Observable<SecurityConfig> {
    let params = new HttpParams();
    if (baseId !== undefined) {
      params = params.set('baseId', baseId === null ? 'null' : baseId);
    }
    return this.http.get<SecurityConfig>(this.apiUrl, { params });
  }

  saveConfig(config: SecurityConfig, baseId?: string | null): Observable<SecurityConfig> {
    return this.http.post<SecurityConfig>(this.apiUrl, {
      ...config,
      base: baseId === undefined ? config.base : baseId,
    });
  }
}
