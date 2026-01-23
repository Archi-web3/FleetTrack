import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MouvementService } from '../../mouvement.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: L.Map | undefined;
  mouvements: any[] = [];

  constructor(private mouvementService: MouvementService) { }

  ngOnInit(): void {
    // Icons fix for Leaflet in Angular
    this.fixLeafletIcons();
    this.loadMouvements();
  }

  ngAfterViewInit(): void {
    // Delay init slightly to ensure container is ready
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  private initMap(): void {
    if (this.map) return;

    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    if ((mapContainer as any)._leaflet_id) {
      (mapContainer as any)._leaflet_id = null;
    }

    this.map = L.map('map').setView([4.3947, 18.557], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Relayout map to ensure tiles load correctly
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 200);
  }

  private fixLeafletIcons(): void {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  private loadMouvements(): void {
    this.mouvementService.getMouvements().subscribe({
      next: (data: any[]) => {
        this.mouvements = data.filter(m =>
          m.statut === 'en cours' || m.statut === 'validé'
        );
        console.log(`🗺️ Mouvements affichés sur la carte: ${this.mouvements.length}`);
        this.displayMouvements();
      },
      error: (err: any) => console.error('Error loading movements for map:', err)
    });
  }

  private displayMouvements(): void {
    if (!this.map) return;
    const map = this.map;
    const allLatLngs: L.LatLngExpression[] = [];

    this.mouvements.forEach(m => {
      const validStops = m.stops.filter((s: any) => s.lieu && (s.lieu as any).coordonnees);

      if (validStops.length >= 2) {
        const latLngs: L.LatLngExpression[] = validStops.map((s: any) => {
          const coords = (s.lieu as any).coordonnees;
          const [lat, lng] = coords.split(',').map((c: string) => parseFloat(c.trim()));
          return [lat, lng] as L.LatLngExpression;
        });

        // Collect points for auto-zoom
        latLngs.forEach(p => allLatLngs.push(p));

        const color = m.statut === 'validé' ? 'green' : (m.statut === 'en cours' ? 'blue' : 'gray');

        const polyline = L.polyline(latLngs, { color: color, weight: 4 }).addTo(map);

        L.marker(latLngs[0]).addTo(map)
          .bindPopup(this.createPopupContent(m, 'Départ'));

        L.marker(latLngs[latLngs.length - 1]).addTo(map)
          .bindPopup(this.createPopupContent(m, 'Arrivée'));

        polyline.bindPopup(this.createPopupContent(m, 'Trajet'));
      }
    });

    // Auto-zoom to fit all movements
    if (allLatLngs.length > 0) {
      const bounds = L.latLngBounds(allLatLngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private createPopupContent(m: any, type: string): string {
    const vehiculeInfo = m.vehicule ? `${(m.vehicule as any).marque} ${(m.vehicule as any).immatriculation}` : 'Non assigné';
    const chauffeurInfo = m.chauffeur ? `${(m.chauffeur as any).nom} ${(m.chauffeur as any).prenom}` : 'Non assigné';
    return `
      <strong>${type}</strong><br>
      <b>Véhicule:</b> ${vehiculeInfo}<br>
      <b>Chauffeur:</b> ${chauffeurInfo}<br>
      <b>Statut:</b> ${m.statut}<br>
      <b>Projet:</b> ${m.projet || 'N/A'}
    `;
  }
}
