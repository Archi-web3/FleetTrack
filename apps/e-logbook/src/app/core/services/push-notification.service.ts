import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private http = inject(HttpClient);
  private swPush = inject(SwPush);

  // Clé publique VAPID (doit correspondre à celle du backend)
  readonly VAPID_PUBLIC_KEY =
    'BJxzSPkMqZI8jwa2YPb6ubznDd4SYxaK88u3c5qdbYkM8b5KIZaRtO2tlgDuVmJa7750MyEzwkBCmavjez6SW80';

  // Demander la permission et s'abonner (Retourne une Promise pour feedback UI)
  public requestSubscription(vehicleId: string): Promise<boolean> {
    if (!this.swPush.isEnabled) {
      return Promise.reject('Service Worker non supporté ou désactivé (Êtes-vous en HTTPS ?)');
    }

    return this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        // Convertir l'Observable en Promise pour attendre la réponse du backend
        return this.sendSubscriptionToBackend(sub, vehicleId).toPromise();
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.error('❌ [PUSH] Error:', err);
        throw err;
      });
  }

  private sendSubscriptionToBackend(subscription: PushSubscription, vehicleId: string) {
    return this.http
      .post(`${API_URL}/push/subscribe`, {
        vehicleId,
        subscription,
      })
      .pipe(
        catchError((err) => {
          console.error('❌ [PUSH] Failed to send sub to server', err);
          return throwError(() => err);
        }),
      );
  }
}
