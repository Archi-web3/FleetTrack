// @ts-nocheck
import { Component, OnInit, OnChanges, SimpleChanges, Input, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Pour *ngIf, etc.
import * as L from 'leaflet'; // Import Leaflet
import 'leaflet-routing-machine'; // Import pour la bibliothèque de routage

// Interface pour mieux typer les mouvements reçus
interface MapMouvement {
  id: string;
  title: string;
  demandeur: string;
  stops: {
    lieuId: string;
    nom: string;
    adresse: string;
    lat: number;
    lng: number;
    dateDepart?: string;
    dateArrivee?: string;
    dateArrivee?: string;
  }[];
  gpsTrace?: { lat: number; lng: number }[];
  vehiculeName?: string; // NOUVEAU
}

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-map-mouvements',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './map-mouvements.component.html',
  styleUrls: ['./map-mouvements.component.scss']
})
export class MapMouvementsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() mouvements: MapMouvement[] = [];

  // NOUVEAU: Filtres
  showPlanned: boolean = true;
  showReal: boolean = true;

  private map!: L.Map;
  private markersMap: { [tripId: string]: L.Marker } = {}; // Map trip ID to Marker for fast access
  private markers: L.Marker[] = [];
  private realTraceLayers: L.Layer[] = []; // Stocker les traces rouges
  private plannedRouteLayers: L.Routing.Control[] = []; // Stocker les routes bleues
  private lastPositionsMarkers: L.CircleMarker[] = [];

  constructor() { }

  ngOnInit(): void {
    // Initialisation légère ici, le gros est dans ngAfterViewInit
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
      this.updateMapMarkers();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Mettre à jour la carte si les mouvements changent et que la carte est initialisée
    if (changes['mouvements'] && this.map) {
      this.updateMapMarkers();
    }
  }

  private initMap(): void {
    // Vérifier si la carte n'est pas déjà initialisée et si l'élément 'map' existe
    if (!this.map && document.getElementById('map')) {
      this.map = L.map('map').setView([48.8566, 2.3522], 6); // Vue initiale (Paris)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    }
  }

  private updateMapMarkers(): void {
    if (!this.map) return;

    // Nettoyage complet
    this.markers.forEach(m => m.remove());
    this.markers = [];
    this.markersMap = {};
    this.realTraceLayers.forEach(l => l.remove());
    this.realTraceLayers = [];
    this.lastPositionsMarkers.forEach(m => m.remove());
    this.lastPositionsMarkers = [];

    // Nettoyage Routing controls
    this.plannedRouteLayers.forEach(c => {
      try { this.map.removeControl(c); } catch (e) { }
    });
    this.plannedRouteLayers = [];

    if (this.mouvements.length === 0) {
      this.map.setView([0, 0], 2);
      return;
    }

    const allLatLngs: L.LatLng[] = [];

    this.mouvements.forEach(mouvement => {
      // 1. GESTION DU PLANIFIÉ (BLEU)
      if (this.showPlanned && mouvement.stops && mouvement.stops.length >= 1) {
        const waypoints: L.LatLng[] = [];

        mouvement.stops.forEach((stop, index) => {
          if (stop.lat && stop.lng) {
            // Markers des stops (Toujours visibles si Planned activé ?? Ou séparé ?)
            // On les lie à "Show Planned" pour l'instant
            let iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
            if (index === 0) iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
            else if (index === mouvement.stops.length - 1) iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';

            const marker = L.marker([stop.lat, stop.lng], {
              icon: L.icon({
                iconUrl: iconUrl,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
              })
            }).bindPopup(`<b>${index === 0 ? 'Départ Planifié' : 'Arrivée Planifiée'}</b><br>${mouvement.vehiculeName || 'Véhicule Inconnu'}<br>${stop.nom}<br><i>${mouvement.title}</i>`);

            marker.addTo(this.map);
            marker.addTo(this.map);
            this.markers.push(marker);

            // Map the START marker to the trip ID for selection
            if (index === 0) {
              this.markersMap[mouvement.id] = marker;
            }

            waypoints.push(L.latLng(stop.lat, stop.lng));
            allLatLngs.push(L.latLng(stop.lat, stop.lng));
          }
        });

        // Tracé Bleu (OSRM)
        if (waypoints.length >= 2) {
          const routingControl = (L.Routing as any).control({
            waypoints: waypoints,
            router: (L.Routing as any).osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1', language: 'fr' }),
            lineOptions: { styles: [{ color: '#2196F3', weight: 6, opacity: 0.6, dashArray: '10, 10' }] }, // Bleu pointillé
            createMarker: () => null, // Pas de markers par défaut du routing
            addWaypoints: false, draggableWaypoints: false, fitSelectedRoutes: false, show: false
          });
          routingControl.addTo(this.map);
          this.plannedRouteLayers.push(routingControl);
        }
      }

      // 2. GESTION DU RÉEL (ROUGE)
      if (this.showReal && mouvement.gpsTrace && mouvement.gpsTrace.length > 1) {
        const gpsLatLngs = mouvement.gpsTrace.map(pt => L.latLng(pt.lat, pt.lng));

        // Polyligne Rouge
        const polyline = L.polyline(gpsLatLngs, {
          color: '#d32f2f', // Rouge Mat
          weight: 4,
          opacity: 0.9
        }).addTo(this.map!);
        this.realTraceLayers.push(polyline);

        allLatLngs.push(...gpsLatLngs);

        // Markers Départ/Arrivée Réels
        const startMarker = L.circleMarker(gpsLatLngs[0], { radius: 6, fillOpacity: 1, color: '#2e7d32', fillColor: '#4caf50' })
          .bindPopup(`<b>Départ Réel GPS</b><br>${mouvement.vehiculeName || ''}<br>${mouvement.title}`).addTo(this.map!);
        this.realTraceLayers.push(startMarker);

        const endMarker = L.circleMarker(gpsLatLngs[gpsLatLngs.length - 1], { radius: 6, fillOpacity: 1, color: '#c62828', fillColor: '#ef5350' })
          .bindPopup(`<b>Dernière Position Connue</b><br>${mouvement.vehiculeName || ''}<br>${mouvement.title}`).addTo(this.map!);
        this.realTraceLayers.push(endMarker);

        // Stocker pour le bouton urgence
        this.lastPositionsMarkers.push(endMarker);
      }
    });

    // Auto-zoomer
    if (allLatLngs.length > 0) {
      this.map.fitBounds(L.latLngBounds(allLatLngs), { padding: [50, 50] });
    }
  }

  // Méthode appelée quand on change les filtres
  onFilterChange(): void {
    this.updateMapMarkers();
  }

  // Bouton Urgence
  zoomToLastPositions(): void {
    if (this.lastPositionsMarkers.length > 0) {
      const group = L.featureGroup(this.lastPositionsMarkers as any);
      this.map.fitBounds(group.getBounds(), { maxZoom: 15, padding: [50, 50] });
      this.lastPositionsMarkers.forEach(m => m.openPopup());
    } else {
      alert('Aucune position réelle connue disponible.');
    }
  }

  // Highlight a specific trip
  public highlightTrip(tripId: string): void {
    const marker = this.markersMap[tripId];
    if (marker && this.map) {
      // Zoom to marker and open popup
      this.map.setView(marker.getLatLng(), 14);
      marker.openPopup();
    }
  }
}
