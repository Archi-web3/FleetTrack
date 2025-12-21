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
  }[];
}

@Component({
  selector: 'app-map-mouvements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-mouvements.component.html',
  styleUrls: ['./map-mouvements.component.scss']
})
export class MapMouvementsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() mouvements: MapMouvement[] = [];
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private routingControls: any[] = []; // Using any to avoid TypeScript errors with leaflet-routing-machine

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

    // Supprimer les marqueurs et contrôles de routage existants
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
    this.routingControls.forEach(control => {
      // Utiliser un type assertion pour éviter l'erreur si map est undefined
      if (this.map && control) {
        this.map.removeControl(control);
      }
    });
    this.routingControls = [];

    if (this.mouvements.length === 0) {
      this.map.setView([0, 0], 2);
      return;
    }

    const allLatLngs: L.LatLng[] = [];

    this.mouvements.forEach(mouvement => {
      if (!mouvement.stops || mouvement.stops.length < 1) return;

      const waypoints: L.LatLng[] = [];
      const currentMarkers: L.Marker[] = [];

      mouvement.stops.forEach((stop, index) => {
        if (stop.lat !== undefined && stop.lng !== undefined && stop.lat !== null && stop.lng !== null) {
          // Déterminer l'icône en fonction de la position du stop
          let iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'; // Intermédiaire par défaut
          if (index === 0) {
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'; // Départ (vert)
          } else if (index === mouvement.stops.length - 1) {
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'; // Arrivée (rouge)
          }

          const marker = L.marker([stop.lat, stop.lng], {
            icon: L.icon({
              iconUrl: iconUrl,
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
            })
          }).bindPopup(`<b>${index === 0 ? 'Départ' : index === mouvement.stops.length - 1 ? 'Arrivée' : 'Étape ' + (index + 1)}:</b> ${stop.nom}<br>Objectif: ${mouvement.title}<br>Demandeur: ${mouvement.demandeur}`);
          currentMarkers.push(marker);
          waypoints.push(L.latLng(stop.lat, stop.lng));
          allLatLngs.push(L.latLng(stop.lat, stop.lng));
        }
      });

      // --- Dessiner l'itinéraire avec Leaflet Routing Machine ---
      if (waypoints.length >= 2) { // Il faut au moins 2 points pour un itinéraire
        const routingControl = (L.Routing as any).control({
          waypoints: waypoints,
          router: (L.Routing as any).osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            language: 'fr'
          }),
          lineOptions: {
            styles: [{ color: 'blue', weight: 6, opacity: 0.7 }]
          },
          createMarker: function (i: number, waypoint: any, n: number) { return null; }, // Pas de marqueurs LRM
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: false,
          showAlternatives: false,
          routeWhileDragging: false,
          show: false // Ne pas afficher le panneau d'instructions
        });

        routingControl.addTo(this.map);
        this.routingControls.push(routingControl);
      }

      // Ajouter les marqueurs créés par nous à la carte
      currentMarkers.forEach(marker => marker.addTo(this.map!));
    });

    // Ajuster la carte pour voir tous les marqueurs (y compris ceux des étapes)
    if (allLatLngs.length > 0) {
      const bounds = L.latLngBounds(allLatLngs);
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
}
