import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export interface VehicleTypeSetting {
    vehicleTypes: string[];
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private apiUrl = 'https://fleettrack-api.onrender.com/api/settings';

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

        return this.http.get<{ key: string, value: string[] }>(`${this.apiUrl}/vehicleTypes`).pipe(
            map(setting => setting.value),
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
        return this.http.get<{ key: string, value: string[] }>(`${this.apiUrl}/vehicleTypes`).pipe(
            tap(setting => {
                this.vehicleTypesSubject.next(setting.value);
                this.loaded = true;
            }),
            catchError(() => {
                // Initialize with defaults if not found
                this.saveVehicleTypes(this.defaultTypes).subscribe();
                this.vehicleTypesSubject.next(this.defaultTypes);
                this.loaded = true;
                return of(this.defaultTypes);
            }),
            // Return request result mapped or defaults
            tap(val => val) as any
        );
    }

    saveVehicleTypes(types: string[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/vehicleTypes`, { value: types }).pipe(
            tap(() => {
                this.vehicleTypesSubject.next(types);
            })
        );
    }
}
