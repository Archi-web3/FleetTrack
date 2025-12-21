import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {
    private readonly apiUrl: string;

    constructor() {
        // Détecte automatiquement l'environnement
        const hostname = window.location.hostname;

        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // Environnement local
            this.apiUrl = 'https://fleettrack-api.onrender.com/api';
        } else {
            // Environnement production (Vercel)
            this.apiUrl = 'https://fleettrack-api.onrender.com/api';
        }
    }

    getApiUrl(): string {
        return this.apiUrl;
    }
}

