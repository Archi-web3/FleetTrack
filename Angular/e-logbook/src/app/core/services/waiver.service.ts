import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Waiver {
    _id?: string;
    visitorName: string;
    vehicleId: string;
    tripId?: string;
    signatureUrl: string;
    signedAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class WaiverService {
    private apiUrl = `${environment.apiUrl}/waivers`;

    constructor(private http: HttpClient) { }

    createWaiver(visitorName: string, vehicleId: string, signatureBlob: Blob, tripId?: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token || '' };

        const formData = new FormData();
        formData.append('visitorName', visitorName);
        formData.append('vehicleId', vehicleId);
        if (tripId) {
            formData.append('tripId', tripId);
        }
        formData.append('signature', signatureBlob, 'signature.png');

        return this.http.post<any>(this.apiUrl, formData, { headers });
    }
}
