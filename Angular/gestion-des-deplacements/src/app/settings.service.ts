import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

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
            tap(types => {
                this.loaded = true;
                this.vehicleTypesSubject.next(types);
            }),
            catchError(error => {
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
            tap(types => {
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
    getCO2Factors(): Observable<any> {
        return this.http.get<{ key: string, value: any }>(`${this.apiUrl}/co2Factors`).pipe(
            map(setting => setting ? setting.value : null),
            catchError(err => {
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
            map(setting => setting ? setting.value : null),
            catchError(err => {
                console.error('Erreur chargement Service Costs', err);
                return of(null);
            })
        );
    }

    saveServiceCosts(costs: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/serviceCosts`, { value: costs });
    }
}
