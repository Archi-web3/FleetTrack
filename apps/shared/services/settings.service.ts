import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface VehicleTypeSetting {
    vehicleTypes: string[];
}

export interface BrandSettings {
  primaryColor?: string;
  newsBanner?: string;
  [key: string]: any;
}

export interface CO2Factors {
  diesel?: number;
  petrol?: number;
  [key: string]: unknown;
}

export interface ServiceCosts {
  [key: string]: unknown;
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number;
  isDefault: boolean;
}

export interface InfoBanners {
  [key: string]: unknown;
}

export interface SystemPreferences {
  enableGenerators?: boolean;
  [key: string]: unknown;
}

export interface SettingRecord<T = unknown> {
  key: string;
  value: T;
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private http = inject(HttpClient);

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

    getVehicleTypes(forceRefresh = false): Observable<string[]> {
        if (this.loaded && !forceRefresh) {
            return this.vehicleTypes$;
        }

        return this.http.get<string[]>(`${this.apiUrl}/vehicleTypes`).pipe(
            tap((types) => {
                this.loaded = true;
                this.vehicleTypesSubject.next(types);
            }),
            catchError((error: unknown) => {
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
            tap((types) => {
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

    saveVehicleTypes(types: string[]): Observable<unknown> {
        return this.http.post(`${this.apiUrl}/vehicleTypes`, { value: types }).pipe(
            tap(() => {
                this.vehicleTypesSubject.next(types);
            })
        );
    }

    // Brand Settings
    getBrandSettings(): Observable<BrandSettings | null> {
        return this.http.get<SettingRecord<BrandSettings>>(`${this.apiUrl}/public/brandSettings`).pipe(
            map((setting) => setting ? setting.value : null),
            catchError((err: unknown) => {
                console.error('Erreur chargement Brand Settings', err);
                return of(null);
            })
        );
    }

    saveBrandSettings(settings: BrandSettings): Observable<unknown> {
        return this.http.post(`${this.apiUrl}/brandSettings`, { value: settings });
    }

    // Récupérer les facteurs CO2
    getCO2Factors(): Observable<CO2Factors | null> {
        return this.http.get<SettingRecord<CO2Factors>>(`${this.apiUrl}/co2Factors`).pipe(
            map((setting) => setting ? setting.value : null),
            catchError((err: unknown) => {
                console.error('Erreur chargement CO2 factors', err);
                return of(null);
            })
        );
    }

    saveCO2Factors(factors: CO2Factors): Observable<unknown> {
        return this.http.post(`${this.apiUrl}/co2Factors`, { value: factors });
    }

    // Service Costs
    getServiceCosts(): Observable<ServiceCosts | null> {
        return this.http.get<SettingRecord<ServiceCosts>>(`${this.apiUrl}/serviceCosts`).pipe(
            map((setting) => setting ? setting.value : null),
            catchError((err: unknown) => {
                console.error('Erreur chargement Service Costs', err);
                return of(null);
            })
        );
    }

    saveServiceCosts(costs: ServiceCosts): Observable<unknown> {
        return this.http.post(`${this.apiUrl}/serviceCosts`, { value: costs });
    }

    // Currencies Settings
    getCurrencies(): Observable<Currency[]> {
        return this.http.get<SettingRecord<Currency[]>>(`${this.apiUrl}/currencies`).pipe(
            map((setting) => setting?.value ?? []),
            catchError((err: unknown) => {
                console.error('Erreur chargement Currencies', err);
                return of([
                    { code: 'EUR', symbol: '€', rate: 1, isDefault: true },
                    { code: 'USD', symbol: '$', rate: 1.08, isDefault: false },
                    { code: 'XOF', symbol: 'CFA', rate: 655.957, isDefault: false }
                ]);
            })
        );
    }

    saveCurrencies(currencies: Currency[]): Observable<unknown> {
        return this.http.post(`${this.apiUrl}/currencies`, { value: currencies });
    }

    // Info Banners Settings
    getInfoBanners(): Observable<InfoBanners> {
        return this.http.get<SettingRecord<InfoBanners>>(`${this.apiUrl}/infoBanners`).pipe(
            map((setting) => setting?.value ?? {}),
            catchError((err: unknown) => {
                console.error('Erreur chargement Info Banners', err);
                return of({});
            })
        );
    }

    saveInfoBanners(banners: InfoBanners): Observable<unknown> {
        return this.http.post(`${this.apiUrl}/infoBanners`, { value: banners });
    }

    // Email Settings
    getEmailSettings(contextKey = 'emailSettings_global'): Observable<string[]> {
        return this.http.get<SettingRecord<string[]>>(`${this.apiUrl}/${contextKey}`).pipe(
            map((setting) => setting?.value ?? []),
            catchError((err: unknown) => {
                console.error('Erreur chargement Email Settings', err);
                return of([]);
            })
        );
    }

    saveEmailSettings(emails: string[], contextKey = 'emailSettings_global'): Observable<unknown> {
        return this.http.post(`${this.apiUrl}/${contextKey}`, { value: emails });
    }

    // System Preferences (Feature Toggles)
    getSystemPreferences(): Observable<SystemPreferences> {
        return this.http.get<SettingRecord<SystemPreferences>>(`${this.apiUrl}/systemPreferences`).pipe(
            map((setting) => setting?.value ?? { enableGenerators: false }),
            catchError((err: unknown) => {
                console.error('Erreur chargement System Preferences', err);
                return of({ enableGenerators: false });
            })
        );
    }

    saveSystemPreferences(prefs: SystemPreferences): Observable<unknown> {
        return this.http.post(`${this.apiUrl}/systemPreferences`, { value: prefs });
    }
}
