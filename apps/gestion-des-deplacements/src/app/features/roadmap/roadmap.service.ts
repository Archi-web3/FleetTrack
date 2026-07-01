import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoadmapService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = `${environment.apiUrl}/roadmap`;
  getFunctionalTree(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  saveFunctionalTree(treeData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, { treeData });
  }
}
