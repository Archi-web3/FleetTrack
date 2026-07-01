import { Injectable, inject } from '@angular/core';
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
  providedIn: 'root',
})
export class WaiverService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/waivers`;

  createWaiver(
    visitorName: string,
    vehicleId: string,
    signatureBlob: Blob,
    tripId?: string,
  ): Observable<Waiver> {
    const formData = new FormData();
    formData.append('visitorName', visitorName);
    formData.append('vehicleId', vehicleId);
    if (tripId) {
      formData.append('tripId', tripId);
    }
    formData.append('signature', signatureBlob, 'signature.png');

    return this.http.post<Waiver>(this.apiUrl, formData);
  }
}
