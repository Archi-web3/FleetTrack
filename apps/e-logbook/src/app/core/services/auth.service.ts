import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { SyncService } from './sync.service';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  _id: string;
  nom: string;
  email: string;
  profil: string;
  pays?: string;
  base?: string;
  token: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  token: string;
  user: Omit<AuthUser, 'token'>;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private syncService = inject(SyncService);

  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, motDePasse: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, motDePasse }).pipe(
      tap(async (response) => {
        if (response && response.token) {
          // Store user details and jwt token in local storage to keep user logged in between page refreshes
          const user = {
            ...response.user,
            token: response.token,
          } as AuthUser;
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', response.token); // Store token separately for easy access
          this.currentUserSubject.next(user);

          // Trigger reference data sync immediately
          try {
            await this.syncService.syncReferenceData();
          } catch (e) {
            console.error('Failed to sync reference data on login:', e);
          }
        }
      }),
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('selectedVehicle');
    this.currentUserSubject.next(null);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}
