import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RoadmapService {
    private apiUrl = `${environment.apiUrl}/roadmap`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders().set('x-auth-token', token || '');
    }

    getFunctionalTree(): Observable<any> {
        return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
    }

    saveFunctionalTree(treeData: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, { treeData }, { headers: this.getHeaders() });
    }
}
