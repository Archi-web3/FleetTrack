import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface VehicleTypeSetting {
    vehicleTypes: string[];
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private apiUrl = `${environment.apiUrl}/settings`;

    // Cache pour éviter de rammener la liste à chaque fois
    private vehicleTypesSubject = new BehaviorSubject<string[]>([]);
    public vehicleTypes$ = this.vehicleTypesSubject.asObservable();
    private loaded = false;

    // Valeurs par défaut si l'API échoue ou est vide
    private readonly defaultTypes = [
        'Land Cruiser',
        'Hilux',
        'Hiace',
        'Prado',
        'Hardtop',
        'Rav4',
        'Corolla',
        'Fortuner',
        'Bus',
        'Camion',
        'Moto',
        'Autre'
    ];

    constructor(private http: HttpClient) { }

    getVehicleTypes(forceRefresh = false): Observable<string[]> {
        if (this.loaded && !forceRefresh) {
            return this.vehicleTypes$;
        }

        return this.http.get<string[]>(`${this.apiUrl}/vehicleTypes`).pipe(
            tap((types: any) => {
                this.loaded = true;
                this.vehicleTypesSubject.next(types);
            }),
            catchError((error: any) => {
                console.error('Erreur chargement types véhicules', error);
                this.loaded = true;
                this.vehicleTypesSubject.next(this.defaultTypes);
                return of(this.defaultTypes);
            })
        );
    }

    // Version propre avec map
    fetchVehicleTypes(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/vehicleTypes`).pipe(
            tap((types: any) => {
                this.vehicleTypesSubject.next(types);
                this.loaded = true;
            }),
            catchError(() => {
                // Initialize with defaults if not found
                this.saveVehicleTypes(this.defaultTypes).subscribe();
                this.vehicleTypesSubject.next(this.defaultTypes);
                this.loaded = true;
                return of(this.defaultTypes);
            })
        );
    }

    saveVehicleTypes(types: string[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/vehicleTypes`, { value: types }).pipe(
            tap(() => {
                this.vehicleTypesSubject.next(types);
            })
        );
    }

    // Récupérer les facteurs CO2
    
    // Brand Settings
    getBrandSettings(): Observable<any> {
        return this.http.get<{ key: string, value: any }>(`${this.apiUrl}/public/brandSettings`).pipe(
            map((setting: any) => setting ? setting.value : null),
            catchError((err: any) => {
                console.error('Erreur chargement Brand Settings', err);
                return of(null);
            })
        );
    }

    saveBrandSettings(settings: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/brandSettings`, { value: settings });
    }

    // Récupérer les facteurs CO2
    getCO2Factors(): Observable<any> {
        return this.http.get<{ key: string, value: any }>(`${this.apiUrl}/co2Factors`).pipe(
            map((setting: any) => setting ? setting.value : null),
            catchError((err: any) => {
                console.error('Erreur chargement CO2 factors', err);
                return of(null);
            })
        );
    }

    // Sauvegarder les facteurs CO2
    saveCO2Factors(factors: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/co2Factors`, { value: factors });
    }

    // Service Costs
    getServiceCosts(): Observable<any> {
        return this.http.get<{ key: string, value: any }>(`${this.apiUrl}/serviceCosts`).pipe(
            map((setting: any) => setting ? setting.value : null),
            catchError((err: any) => {
                console.error('Erreur chargement Service Costs', err);
                return of(null);
            })
        );
    }

    saveServiceCosts(costs: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/serviceCosts`, { value: costs });
    }

    // Currencies Settings
    getCurrencies(): Observable<any[]> {
        return this.http.get<{ key: string, value: any }>(`${this.apiUrl}/currencies`).pipe(
            map((setting: any) => setting && setting.value ? setting.value : []),
            catchError((err: any) => {
                console.error('Erreur chargement Currencies', err);
                return of([
                    { code: 'EUR', symbol: '€', rate: 1, isDefault: true },
                    { code: 'USD', symbol: '$', rate: 1.08, isDefault: false },
                    { code: 'XOF', symbol: 'CFA', rate: 655.957, isDefault: false }
                ]);
            })
        );
    }

    saveCurrencies(currencies: any[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/currencies`, { value: currencies });
    }

    // Info Banners Settings
    getInfoBanners(): Observable<any> {
        return this.http.get<{ key: string, value: any }>(`${this.apiUrl}/infoBanners`).pipe(
            map((setting: any) => setting && setting.value ? setting.value : {}),
            catchError((err: any) => {
                console.error('Erreur chargement Info Banners', err);
                return of({});
            })
        );
    }

    saveInfoBanners(banners: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/infoBanners`, { value: banners });
    }

    // Email Settings
    getEmailSettings(contextKey: string = 'emailSettings_global'): Observable<any[]> {
        return this.http.get<{ key: string, value: any }>(`${this.apiUrl}/${contextKey}`).pipe(
            map((setting: any) => setting && setting.value ? setting.value : []),
            catchError((err: any) => {
                console.error('Erreur chargement Email Settings', err);
                return of([]);
            })
        );
    }

    saveEmailSettings(emails: any[], contextKey: string = 'emailSettings_global'): Observable<any> {
        return this.http.post(`${this.apiUrl}/${contextKey}`, { value: emails });
    }

    // System Preferences (Feature Toggles)
    getSystemPreferences(): Observable<any> {
        return this.http.get<{ key: string, value: any }>(`${this.apiUrl}/systemPreferences`).pipe(
            map((setting: any) => setting && setting.value ? setting.value : { enableGenerators: false }),
            catchError((err: any) => {
                console.error('Erreur chargement System Preferences', err);
                return of({ enableGenerators: false });
            })
        );
    }

    saveSystemPreferences(prefs: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/systemPreferences`, { value: prefs });
    }
}
