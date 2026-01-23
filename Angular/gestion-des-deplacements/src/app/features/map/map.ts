import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
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
  private routingControls: any[] = [];
  private markers: L.Marker[] = [];

  constructor(private mouvementService: MouvementService) { }

  ngOnInit(): void {
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

    // Cleanup
    this.routingControls.forEach(control => map.removeControl(control));
    this.routingControls = [];
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    const allLatLngs: L.LatLng[] = [];

    this.mouvements.forEach(m => {
      const validStops = m.stops.filter((s: any) => {
        const lieu = s.lieu as any;
        if (!lieu || !lieu.coordonnees) return false;

        const coords = lieu.coordonnees;
        if (typeof coords === 'string') return true;
        if (typeof coords === 'object' && coords.latitude !== undefined && coords.longitude !== undefined) return true;

        console.warn(`⚠️ [MAP] Invalid coords format for movement ${m._id} stop ${lieu.nom}:`, coords);
        return false;
      });

      if (validStops.length >= 2) {
        const waypoints: L.LatLng[] = [];

        validStops.forEach((s: any, index: number) => {
          // Parse coords
          const lieu = s.lieu as any;
          let lat: number, lng: number;

          if (typeof lieu.coordonnees === 'string') {
            const parts = lieu.coordonnees.split(',').map((c: string) => parseFloat(c.trim()));
            lat = parts[0];
            lng = parts[1];
          } else {
            lat = parseFloat(lieu.coordonnees.latitude);
            lng = parseFloat(lieu.coordonnees.longitude);
          }

          waypoints.push(L.latLng(lat, lng));
          allLatLngs.push(L.latLng(lat, lng));

          // Markers
          let iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
          if (index === 0) {
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
          } else if (index === validStops.length - 1) {
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
          }

          const marker = L.marker([lat, lng], {
            icon: L.icon({
              iconUrl: iconUrl,
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
            })
          }).addTo(map);

          const type = index === 0 ? 'Départ' : (index === validStops.length - 1 ? 'Arrivée' : 'Étape');
          marker.bindPopup(this.createPopupContent(m, type));

          this.markers.push(marker);
        });

        // Routing
        const color = m.statut === 'validé' ? 'green' : (m.statut === 'en cours' ? 'blue' : 'gray');

        try {
          const routingControl = (L as any).Routing.control({
            waypoints: waypoints,
            router: (L as any).Routing.osrmv1({
              serviceUrl: 'https://router.project-osrm.org/route/v1',
              language: 'fr'
            }),
            lineOptions: {
              styles: [{ color: color, weight: 6, opacity: 0.7 }]
            },
            createMarker: function () { return null; },
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: false,
            show: false
          }).addTo(map);

          this.routingControls.push(routingControl);
        } catch (e) {
          console.error('Routing control error:', e);
        }
      }
    });

    if (allLatLngs.length > 0) {
      const bounds = L.latLngBounds(allLatLngs);
      // Ensure bounds are valid
      try {
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (e) { console.warn('Invalid bounds', e); }
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
