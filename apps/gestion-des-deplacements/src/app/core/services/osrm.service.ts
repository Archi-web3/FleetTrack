import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OsrmService {
  private http = inject(HttpClient);

  private readonly API_URL = 'https://router.project-osrm.org/route/v1/driving';

  /**
   * Calculate route metrics between points using OSRM
   * @param waypoints Array of coordinates [{lat, lng}, ...]
   * @returns Observable with { distance: number (meters), duration: number (seconds) }
   */
  getRoute(
    waypoints: { lat: number; lng: number }[],
  ): Observable<{ distance: number; duration: number } | null> {
    if (!waypoints || waypoints.length < 2) {
      return of(null);
    }

    // Format coordinates: "lng,lat;lng,lat;..."
    const coordsString = waypoints.map((p) => `${p.lng},${p.lat}`).join(';');

    const url = `${this.API_URL}/${coordsString}?overview=false`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        if (response.routes && response.routes.length > 0) {
          const route = response.routes[0];
          return {
            distance: route.distance, // meters
            duration: route.duration, // seconds
          };
        }
        return null;
      }),
      catchError((error) => {
        console.error('OSRM API Error:', error);
        return of(null);
      }),
    );
  }
}
