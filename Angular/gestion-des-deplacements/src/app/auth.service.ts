import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://fleettrack-api.onrender.com/api/auth';
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

  constructor(private http: HttpClient, private router: Router) {
    if (this.hasToken()) {
      this.setProfileAndNameAndIdFromToken(this.getToken());
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
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
      pays: this.getUserPaysId() ? {
        id: this.getUserPaysId(),
        nom: this.getUserPays()
      } : null,
      base: this.getUserBaseId() ? {
        id: this.getUserBaseId(),
        nom: this.getUserBase()
      } : null
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
      return decoded?.utilisateur?.pays?.nom || null;
    }
    return null;
  }

  private getStoredBase(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded?.utilisateur?.base?.nom || null;
    }
    return null;
  }

  private getStoredPaysId(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded?.utilisateur?.pays?.id || null;
    }
    return null;
  }

  private getStoredBaseId(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded?.utilisateur?.base?.id || null;
    }
    return null;
  }

  // Modifié pour inclure le nom, l'ID, le pays et la base
  private setProfileAndNameAndIdFromToken(token: string | null): void {
    if (token) {
      const decoded = this.decodeToken(token);

      this._userProfile.next(decoded?.utilisateur?.profil || null);
      this._userName.next(decoded?.utilisateur?.nom || null);
      this._userId.next(decoded?.utilisateur?.id || null);
      this._userPays.next(decoded?.utilisateur?.pays?.nom || null);
      this._userBase.next(decoded?.utilisateur?.base?.nom || null);
      this._userPaysId.next(decoded?.utilisateur?.pays?.id || null);
      this._userBaseId.next(decoded?.utilisateur?.base?.id || null);

      // Fix: Automatically set selectedCountry in localStorage if user has a country assigned
      if (decoded?.utilisateur?.pays?.id) {
        localStorage.setItem('selectedCountry', decoded.utilisateur.pays.id);
      }
    } else {
      this._userProfile.next(null);
      this._userName.next(null);
      this._userId.next(null);
      this._userPays.next(null);
      this._userBase.next(null);
      this._userPaysId.next(null);
      this._userBaseId.next(null);
      // We do not clear selectedCountry here to allow SuperAdmins to keep their selection across reloads if needed,
      // or we handle logout explicitly.
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      console.error("Erreur de décodage du token JWT:", e);
      return null;
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this._isAuthenticated.next(true);
          this.setProfileAndNameAndIdFromToken(res.token);
        }
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this._isAuthenticated.next(true);
          this.setProfileAndNameAndIdFromToken(res.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('selectedCountry'); // Clear selected country
    this._isAuthenticated.next(false);
    this._userProfile.next(null);
    this._userName.next(null);
    this._userId.next(null);
    this.router.navigate(['/login']);
  }
}

