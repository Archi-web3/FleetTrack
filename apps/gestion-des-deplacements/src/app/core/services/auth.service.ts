import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'jwtToken';

  private _isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this._isAuthenticated.asObservable();

  private _userProfile = new BehaviorSubject<string | null>(this.getStoredProfile());
  userProfile$ = this._userProfile.asObservable();

  private _userName = new BehaviorSubject<string | null>(this.getStoredUserName());
  userName$ = this._userName.asObservable();

  private _userId = new BehaviorSubject<string | null>(this.getStoredUserId());
  userId$ = this._userId.asObservable();

  private _userPays = new BehaviorSubject<string | null>(this.getStoredPays());
  userPays$ = this._userPays.asObservable();

  private _userBase = new BehaviorSubject<string | null>(this.getStoredBase());
  userBase$ = this._userBase.asObservable();

  private _userPaysId = new BehaviorSubject<string | null>(this.getStoredPaysId());
  userPaysId$ = this._userPaysId.asObservable();

  private _userBaseId = new BehaviorSubject<string | null>(this.getStoredBaseId());
  userBaseId$ = this._userBaseId.asObservable();

  constructor() {
    const token = this.getToken();
    if (token) {
      if (this.isTokenExpired(token)) {
        // Token expiré : on nettoie discrètement (sans redirect forcé, AuthGuard s'en chargera)
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem('selectedCountry');
        this._isAuthenticated.next(false);
      } else {
        this.setProfileAndNameAndIdFromToken(token);
        this.startTokenExpirationCheck();
      }
    }
  }

  private tokenCheckInterval: any;

  private startTokenExpirationCheck() {
    // Vérifie toutes les 60 secondes si le token a expiré
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
    this.tokenCheckInterval = setInterval(() => {
      const token = this.getToken();
      if (token && this.isTokenExpired(token)) {
        console.warn(
          '[AuthService] Token expiré détecté en arrière-plan. Déconnexion automatique.',
        );
        this.logout();
      }
    }, 60000); // 1 minute
  }

  private hasToken(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (decoded && decoded.exp) {
        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decoded.exp);
        return expirationDate.valueOf() < new Date().valueOf();
      }
      return false; // Si pas de champ exp, on ne peut pas savoir
    } catch (e) {
      return true; // En cas d'erreur de parsing, on considère expiré
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // --- MÉTHODES GET SYNCHRONES POUR ACCÉDER AUX DONNÉES DE L'UTILISATEUR ---
  getUserProfile(): string | null {
    return this._userProfile.getValue();
  }

  getUserName(): string | null {
    return this._userName.getValue();
  }

  getUserId(): string | null {
    return this._userId.getValue();
  }

  getUserPays(): string | null {
    return this._userPays.getValue();
  }

  getUserBase(): string | null {
    return this._userBase.getValue();
  }
  getUserPaysId(): string | null {
    return this._userPaysId.getValue();
  }

  getUserBaseId(): string | null {
    return this._userBaseId.getValue();
  }

  getUser(): any {
    return {
      id: this.getUserId(),
      nom: this.getUserName(),
      profil: this.getUserProfile(),
      pays: this.getStoredPaysArray(),
      base: this.getStoredBaseArray(),
    };
  }

  // --- FIN MÉTHODES GET SYNCHRONES ---

  private getStoredProfile(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded?.utilisateur?.profil || null;
    }
    return null;
  }

  private getStoredUserName(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded?.utilisateur?.nom || null;
    }
    return null;
  }

  private getStoredUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded?.utilisateur?.id || null;
    }
    return null;
  }

  private getStoredPays(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      const pays = decoded?.utilisateur?.pays;
      return Array.isArray(pays) && pays.length > 0 ? pays[0].nom : null;
    }
    return null;
  }

  private getStoredBase(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      const base = decoded?.utilisateur?.base;
      return Array.isArray(base) && base.length > 0 ? base[0].nom : null;
    }
    return null;
  }

  private getStoredPaysId(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      const pays = decoded?.utilisateur?.pays;
      return Array.isArray(pays) && pays.length > 0 ? pays[0].id : null;
    }
    return null;
  }

  private getStoredBaseId(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      const base = decoded?.utilisateur?.base;
      return Array.isArray(base) && base.length > 0 ? base[0].id : null;
    }
    return null;
  }

  private getStoredPaysArray(): any[] {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return Array.isArray(decoded?.utilisateur?.pays) ? decoded.utilisateur.pays : [];
    }
    return [];
  }

  private getStoredBaseArray(): any[] {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return Array.isArray(decoded?.utilisateur?.base) ? decoded.utilisateur.base : [];
    }
    return [];
  }

  // Modifié pour inclure le nom, l'ID, le pays et la base
  private setProfileAndNameAndIdFromToken(token: string | null): void {
    if (token) {
      const decoded = this.decodeToken(token);

      if (decoded && decoded.utilisateur) {
        const paysArray = Array.isArray(decoded.utilisateur.pays) ? decoded.utilisateur.pays : [];
        const baseArray = Array.isArray(decoded.utilisateur.base) ? decoded.utilisateur.base : [];

        this._userProfile.next(decoded.utilisateur.profil || null);
        this._userName.next(decoded.utilisateur.nom || null);
        this._userId.next(decoded.utilisateur.id || null);
        this._userPays.next(paysArray.length > 0 ? paysArray[0].nom : null);
        this._userBase.next(baseArray.length > 0 ? baseArray[0].nom : null);
        this._userPaysId.next(paysArray.length > 0 ? paysArray[0].id : null);
        this._userBaseId.next(baseArray.length > 0 ? baseArray[0].id : null);

        // Fix: Automatically set selectedCountry in localStorage if user has a country assigned
        if (paysArray.length > 0) {
          const currentSelection = localStorage.getItem('selectedCountry');
          if (!currentSelection || currentSelection === 'undefined' || currentSelection === 'null') {
            localStorage.setItem('selectedCountry', paysArray[0].id);
          }
        } else if (decoded.utilisateur.profil === 'SuperAdmin' || decoded.utilisateur.profil === 'Super Admin') {
          const currentSelection = localStorage.getItem('selectedCountry');
          if (!currentSelection || currentSelection === 'undefined' || currentSelection === 'null') {
            localStorage.setItem('selectedCountry', 'all');
          }
        }
      } else {
        console.warn(
          '[AuthService] Token present but decoding failed or structure invalid. Clearing state.',
        );
        this.logout(); // Safety logout if token is garbage
      }
    } else {
      this._userProfile.next(null);
      this._userName.next(null);
      this._userId.next(null);
      this._userPays.next(null);
      this._userBase.next(null);
      this._userPaysId.next(null);
      this._userBaseId.next(null);
    }
  }

  private decodeToken(token: string): any {
    try {
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('JWT must have 3 parts');
      }
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error(
        'Erreur de décodage du token JWT:',
        e,
        'Token (partial):',
        token.substring(0, 10) + '...',
      );
      return null;
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this.setProfileAndNameAndIdFromToken(res.token); // Decode token FIRST
          this._isAuthenticated.next(true); // Then show the UI
          this.startTokenExpirationCheck();
        }
      }),
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      timeout(60000), // Timeout après 60 secondes pour laisser le temps à Render de démarrer
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this.setProfileAndNameAndIdFromToken(res.token); // Decode token FIRST
          this._isAuthenticated.next(true); // Then show the UI
          this.startTokenExpirationCheck();
        }
      }),
    );
  }

  logout(): void {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('selectedCountry'); // Clear selected country
    this._isAuthenticated.next(false);
    this._userProfile.next(null);
    this._userName.next(null);
    this._userId.next(null);
    this.router.navigate(['/login']);
  }
}
