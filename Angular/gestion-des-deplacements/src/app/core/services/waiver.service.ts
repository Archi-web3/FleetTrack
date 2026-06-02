import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Waiver {
    _id: string;
    visitorName: string;
    vehicleId: {
        _id: string;
        immatriculation: string;
        marque: string;
        modele: string;
    };
    tripId?: {
        _id: string;
        mission: string;
    };
    signatureUrl: string;
    signedAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class WaiverService {
    private apiUrl = 'https://fleettrack-api.onrender.com/api/waivers';

    constructor(private http: HttpClient) { }

    getAllWaivers(): Observable<Waiver[]> {
        return this.http.get<Waiver[]>(this.apiUrl);
    }

    deleteWaiver(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
