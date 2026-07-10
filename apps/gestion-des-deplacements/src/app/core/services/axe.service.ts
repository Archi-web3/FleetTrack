import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Axe {
  _id?: string;
  nom: string;
  depart: any;
  arrivee: any;
  niveauSecurite: number;
  commentaire?: string;
  actif: boolean;
  pays: string;
  base?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AxeService {
  private apiUrl = `${environment.apiUrl}/axes`;

  constructor(private http: HttpClient) {}

  getAxes(): Observable<Axe[]> {
    return this.http.get<Axe[]>(this.apiUrl);
  }

  getAxeById(id: string): Observable<Axe> {
    return this.http.get<Axe>(`${this.apiUrl}/${id}`);
  }

  createAxe(axe: Partial<Axe>): Observable<Axe> {
    return this.http.post<Axe>(this.apiUrl, axe);
  }

  updateAxe(id: string, axe: Partial<Axe>): Observable<Axe> {
    return this.http.put<Axe>(`${this.apiUrl}/${id}`, axe);
  }

  deleteAxe(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
