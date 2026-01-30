import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogbookService } from '../logbook.service';
import { VehiculeService } from '../vehicule.service';
import { MouvementService } from '../mouvement.service';
import { AuthService } from '../auth.service';

import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MapMouvementsComponent } from '../map-mouvements/map-mouvements.component'; // Import Map

@Component({
    selector: 'app-logbook-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, MatTabsModule, MatTooltipModule, MapMouvementsComponent],
    templateUrl: './logbook-dashboard.component.html',
    styleUrls: ['./logbook-dashboard.component.css']
})
export class LogbookDashboardComponent implements OnInit {
    vehicules: any[] = [];
    selectedVehiculeId: string | null = null;
    activeTab: string = 'trips'; // 'trips', 'fuel', 'maintenance', 'incidents'

    trips: any[] = [];
    fuels: any[] = [];
    maintenances: any[] = [];
    incidents: any[] = [];

    // Editing State
    editingItem: any = null;
    editingType: string | null = null;

    // NOUVEAU: Photo modal
    selectedPhoto: string | null = null;

    // NOUVEAU: Map Modal
    showMapModal: boolean = false;
    mapMouvementsData: any[] = [];

    constructor(
        private vehiculeService: VehiculeService,
        private logbookService: LogbookService,
        private mouvementService: MouvementService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loadVehicules();
    }

    loadVehicules(): void {
        this.vehiculeService.getVehicules().subscribe(data => {
            this.vehicules = data;
            if (this.vehicules.length > 0) {
                this.selectedVehiculeId = this.vehicules[0]._id;
                this.onVehiculeChange();
            }
        });
    }

    onVehiculeChange(): void {
        if (!this.selectedVehiculeId) return;
        this.loadData();
    }

    loadData(): void {
        if (!this.selectedVehiculeId) return;

        // FIX: Trigger auto-repair of missing countries on every refresh
        console.log('[LogbookDashboard] Triggering auto-repair of missing countries...');
        this.mouvementService.fixCountries().subscribe({
            next: (res) => {
                console.log('[LogbookDashboard] Auto-repair result:', res);
                this._loadVehicleData();
            },
            error: (err) => {
                console.warn('[LogbookDashboard] Auto-repair failed (non-blocking):', err);
                this._loadVehicleData();
            }
        });
    }

    private _loadVehicleData(): void {
        if (!this.selectedVehiculeId) return;

        // Load Trips (Mouvements) for this vehicle
        this.mouvementService.getMouvements().subscribe(allMouvements => {
            console.log(`[LogbookDashboard] Total mouvements fetchés: ${allMouvements.length}`);

            this.trips = allMouvements.filter((m: any) => {
                // Gestion robuste de l'ID véhicule
                const mVehiculeId = m.vehicule && m.vehicule._id ? m.vehicule._id : (typeof m.vehicule === 'string' ? m.vehicule : null);

                const matchVehicule = mVehiculeId === this.selectedVehiculeId;

                // On accepte plusieurs statuts pour l'affichage
                const allowedStatuses = ['terminé', 'pris en charge', 'en cours', 'validé', 'regroupé'];
                const matchStatut = allowedStatuses.includes(m.statut);

                // Debug detailed
                // console.log(`[LogbookDashboard] Check Mvt ${m._id}: VehiculeMatch=${matchVehicule}, StatutMatch=${matchStatut} (Got: '${m.statut}'), VehiculeId=${mVehiculeId}`);

                // Ignore maintenance movements (shown in Maintenance tab)
                if (m.type === 'maintenance') return false;

                return matchVehicule && matchStatut;
            });
            console.log(`[LogbookDashboard] Trajets filtrés pour ${this.selectedVehiculeId}: ${this.trips.length}`);
        });

        // Load Fuel
        this.logbookService.getFuelsByVehicle(this.selectedVehiculeId).subscribe(data => this.fuels = data);

        // Load Maintenance
        this.logbookService.getMaintenancesByVehicle(this.selectedVehiculeId).subscribe(data => this.maintenances = data);

        // Load Incidents
        this.logbookService.getIncidentsByVehicle(this.selectedVehiculeId).subscribe(data => this.incidents = data);
    }

    setActiveTab(tab: string): void {
        this.activeTab = tab;
    }

    // --- ADMIN ACTIONS ---

    isAdmin(): boolean {
        const profile = this.authService.getUserProfile();
        return profile === 'Admin';
    }

    deleteItem(type: string, id: string): void {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

        let observable;
        switch (type) {
            case 'fuel': observable = this.logbookService.deleteFuel(id); break;
            case 'maintenance': observable = this.logbookService.deleteMaintenance(id); break;
            case 'incident': observable = this.logbookService.deleteIncident(id); break;
            case 'trips': observable = this.mouvementService.deleteMouvement(id); break; // NOUVEAU
        }

        if (observable) {
            observable.subscribe(() => {
                this.loadData(); // Reload to refresh list
            }, err => console.error('Error deleting item:', err));
        }
    }

    editItem(type: string, item: any): void {
        this.editingType = type;
        this.editingItem = { ...item }; // Copy to avoid direct mutation
    }

    cancelEdit(): void {
        this.editingItem = null;
        this.editingType = null;
    }

    saveItem(): void {
        if (!this.editingItem || !this.editingType) return;

        let observable;
        switch (this.editingType) {
            case 'fuel': observable = this.logbookService.updateFuel(this.editingItem._id, this.editingItem); break;
            case 'maintenance': observable = this.logbookService.updateMaintenance(this.editingItem._id, this.editingItem); break;
            case 'incident': observable = this.logbookService.updateIncident(this.editingItem._id, this.editingItem); break;
        }

        if (observable) {
            observable.subscribe(() => {
                this.editingItem = null;
                this.editingType = null;
                this.loadData(); // Reload
            }, err => console.error('Error updating item:', err));
        }
    }

    // NOUVEAU: Méthodes pour le modal photo
    openPhotoModal(photoUrl: string): void {
        this.selectedPhoto = photoUrl;
    }

    closePhotoModal(): void {
        this.selectedPhoto = null;
    }

    // NOUVEAU: Gestion Map Modal
    openMap(trip: any): void {
        console.log('Opening map for trip:', trip);
        console.log('Trip GPS Trace length:', trip.gpsTrace ? trip.gpsTrace.length : 'undefined');

        // Helper pour extraire lat/lon peu importe le format
        const getCoords = (lieu: any) => {
            if (!lieu || !lieu.coordonnees) return null;

            // Cas 1: coordonnees est un string "lat,lon"
            if (typeof lieu.coordonnees === 'string') {
                const parts = lieu.coordonnees.split(',').map((s: string) => parseFloat(s.trim()));
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                    return { lat: parts[0], lng: parts[1] };
                }
            }
            // Cas 2: coordonnees est un objet avec latitude/longitude (Backend Model)
            else if (lieu.coordonnees.latitude !== undefined && lieu.coordonnees.longitude !== undefined) {
                return { lat: parseFloat(lieu.coordonnees.latitude), lng: parseFloat(lieu.coordonnees.longitude) };
            }
            // Cas 3: coordonnees est un objet avec lat/lng (Leaflet style)
            else if (lieu.coordonnees.lat !== undefined && lieu.coordonnees.lng !== undefined) {
                return { lat: parseFloat(lieu.coordonnees.lat), lng: parseFloat(lieu.coordonnees.lng) };
            }
            return null;
        };

        const stops = trip.stops && trip.stops.length > 0 ? trip.stops.map((s: any) => {
            const coords = getCoords(s.lieu);
            return {
                lieuId: s.lieu?._id || s.lieu,
                nom: s.lieu?.nom || 'Stop',
                adresse: s.lieu?.adresse || '',
                lat: coords ? coords.lat : (s.lat || 0), // Fallback si plat
                lng: coords ? coords.lng : (s.lng || 0),
                dateDepart: s.dateDepart,
                dateArrivee: s.dateArrivee
            };
        }) : [];

        // Si pas de stops mais trace GPS, on peut afficher quand même

        this.mapMouvementsData = [{
            id: trip._id,
            title: trip.objectif || trip.purpose || 'Trajet',
            demandeur: trip.chauffeur?.prenom + ' ' + trip.chauffeur?.nom,
            stops: stops,
            gpsTrace: trip.gpsTrace, // Passer la trace GPS
            vehiculeName: trip.vehicule?.marque ? `${trip.vehicule.marque} ${trip.vehicule.modele}` : 'Véhicule', // Ajout details
            vehiculeCode: trip.vehicule?.immatriculation // Ajout plaque
        }];

        this.showMapModal = true;
    }

    // NOUVEAU: Gestion Map Incident
    openMapForIncident(incident: any): void {
        console.log('Opening map for incident:', incident);

        if (!incident.location || !incident.location.lat) {
            console.warn('No location for this incident');
            return;
        }

        const lat = parseFloat(incident.location.lat);
        const lng = parseFloat(incident.location.lng);

        this.mapMouvementsData = [{
            id: incident._id,
            title: `Incident: ${incident.type} (${incident.severity})`,
            demandeur: 'Incident Signalé',
            stops: [{
                lieuId: 'incident_loc',
                nom: incident.description || 'Lieu Incident',
                adresse: incident.location.address || 'Coordonnées GPS',
                lat: lat,
                lng: lng,
                dateArrivee: incident.date,
                isIncident: true // Flag pour icône spécifique si besoin
            }],
            gpsTrace: [], // Pas de trace pour un incident ponctuel
            vehiculeName: 'Véhicule', // On pourrait aller chercher le nom du véhicule via ID
            vehiculeCode: ''
        }];

        this.showMapModal = true;
    }

    closeMapModal(): void {
        this.showMapModal = false;
        this.mapMouvementsData = [];
    }
}
