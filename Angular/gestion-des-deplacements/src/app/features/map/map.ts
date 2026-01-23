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
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  private initMap(): void {
    // Prevent re-initialization
    if (this.map) return;

    // Check if the container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Clean up if somehow Leaflet thinks it's strictly bound but we lost the ref
    if ((mapContainer as any)._leaflet_id) {
      (mapContainer as any)._leaflet_id = null;
    }

    // Centered on Central African Republic (Bangui) by default
    this.map = L.map('map').setView([4.3947, 18.557], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
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
      next: (data) => {
        // Filter for active/validated movements
        this.mouvements = data.filter(m =>
          m.statut === 'en cours' || m.statut === 'validé'
        );
        this.displayMouvements();
      },
      error: (err) => console.error('Error loading movements for map:', err)
    });
  }

  private displayMouvements(): void {
    if (!this.map) return;
    const map = this.map; // Capture for callback

    this.mouvements.forEach(m => {
      // Ensure we have stops with coordinates
      const validStops = m.stops.filter((s: any) => s.lieu && (s.lieu as any).coordonnees);

      if (validStops.length >= 2) {
        const latLngs: L.LatLngExpression[] = validStops.map((s: any) => {
          const coords = (s.lieu as any).coordonnees; // formatted as "lat,lng" string
          const [lat, lng] = coords.split(',').map((c: string) => parseFloat(c.trim()));
          return [lat, lng] as L.LatLngExpression;
        });

        const color = m.statut === 'validé' ? 'green' : (m.statut === 'en cours' ? 'blue' : 'gray');

        // Draw Polyline
        const polyline = L.polyline(latLngs, { color: color, weight: 4 }).addTo(map);

        // Add Markers for Start and End
        // Start
        L.marker(latLngs[0]).addTo(map)
          .bindPopup(this.createPopupContent(m, 'Départ'));

        // End
        L.marker(latLngs[latLngs.length - 1]).addTo(map)
          .bindPopup(this.createPopupContent(m, 'Arrivée'));

        // Bind popup to line as well
        polyline.bindPopup(this.createPopupContent(m, 'Trajet'));
      }
    });
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
