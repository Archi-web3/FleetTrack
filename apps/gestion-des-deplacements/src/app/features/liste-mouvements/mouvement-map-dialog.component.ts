import { Component, OnInit, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import * as L from 'leaflet';

@Component({
  selector: 'app-mouvement-map-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="custom-modal-layout" style="height: 80vh; display: flex; flex-direction: column;">
      <div class="custom-modal-header" style="flex-shrink: 0;">
        <h2>
          <mat-icon>map</mat-icon>
          Itinéraire du Trajet
        </h2>
        <button class="custom-modal-close-btn" mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="custom-modal-body" style="flex-grow: 1; padding: 0; position: relative;">
        <div id="map-{{ instanceId }}" style="height: 100%; width: 100%; border-radius: 0 0 8px 8px; z-index: 1;"></div>
      </div>
    </div>
  `,
  styles: [`
    .custom-modal-layout {
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }
    .custom-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .custom-modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .custom-modal-close-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      color: #64748b;
    }
  `]
})
export class MouvementMapDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  data = inject(MAT_DIALOG_DATA);
  private map!: L.Map;
  instanceId = Math.random().toString(36).substring(7);

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    const mapElement = document.getElementById(`map-${this.instanceId}`);
    if (!mapElement) return;

    this.map = L.map(mapElement).setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    const points: L.LatLngExpression[] = [];
    const markers: L.Marker[] = [];

    // Try to load leaflet default icons properly 
    const iconDefault = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    const mouvement = this.data.mouvement;

    // Build the itinerary coordinates
    if (mouvement.lieuDepart && mouvement.lieuDepart.coordonnees) {
      points.push([mouvement.lieuDepart.coordonnees.latitude, mouvement.lieuDepart.coordonnees.longitude]);
      markers.push(L.marker(points[0], { icon: iconDefault }).bindPopup(`<strong>Départ:</strong> ${mouvement.lieuDepart.nom}`));
    }

    if (mouvement.stops && mouvement.stops.length > 0) {
      mouvement.stops.forEach((stop: any, index: number) => {
        if (stop.lieu && stop.lieu.coordonnees) {
          const pt: L.LatLngExpression = [stop.lieu.coordonnees.latitude, stop.lieu.coordonnees.longitude];
          points.push(pt);
          const isEnd = index === mouvement.stops.length - 1;
          markers.push(L.marker(pt, { icon: iconDefault }).bindPopup(`<strong>${isEnd ? 'Arrivée' : 'Étape'}:</strong> ${stop.lieu.nom}`));
        }
      });
    }

    if (points.length > 0) {
      // Add polyline
      const polyline = L.polyline(points, { color: 'blue', weight: 4, opacity: 0.7 }).addTo(this.map);
      
      // Add markers
      markers.forEach(m => m.addTo(this.map));

      // Fit bounds
      this.map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  }
}
