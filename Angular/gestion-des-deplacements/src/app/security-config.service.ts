import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface SecurityRule {
    level: number;
    mandatoryValidators: string[]; // List of User IDs
    requireUnanimity: boolean;
    quorum: number;
}

export interface SecurityConfig {
    pays: string;
    base?: string;
    rules: SecurityRule[];
}

@Injectable({
    providedIn: 'root'
})
export class SecurityConfigService {
    private apiUrl = `${environment.apiUrl}/security-config`;

    constructor(private http: HttpClient) { }

    getConfig(): Observable<SecurityConfig> {
        return this.http.get<SecurityConfig>(this.apiUrl);
    }

    saveConfig(config: SecurityConfig): Observable<SecurityConfig> {
        return this.http.post<SecurityConfig>(this.apiUrl, config);
    }
}
