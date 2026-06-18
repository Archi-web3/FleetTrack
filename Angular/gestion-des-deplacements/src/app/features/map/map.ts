import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MouvementService } from '../../core/services/mouvement.service';
import { VehiculeService } from '../../core/services/vehicule.service';
import { MapMouvementsComponent } from '../map-mouvements/map-mouvements.component';
import { ViewChild } from '@angular/core';

import { startOfWeek, endOfWeek } from 'date-fns';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MapMouvementsComponent,
    MatButtonModule, // Added for button
    TranslateModule
  ],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements OnInit {
  @ViewChild(MapMouvementsComponent) mapMouvementsComponent!: MapMouvementsComponent;

  // Data
  allMouvements: any[] = [];
  filteredMouvements: any[] = []; // Those passed to the map
  vehicles: any[] = [];

  // Filters
  selectedVehicleId: string | 'all' = 'all';
  selectedStatus: string | 'all' = 'all'; // Default to show all active types
  selectedSearchQuery: string = '';
  filterDateStart: Date | null = null;
  filterDateEnd: Date | null = null;

  // Multi-selection
  selectedTripIds: Set<string> = new Set();
  isAllSelected: boolean = false;
  movementsToDisplay: any[] = []; // The actual list passed to the map

  // Status options for filter
  statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'en cours', label: 'En cours' },
    { value: 'validé', label: 'Validé (En attente)' },
    { value: 'terminé', label: 'Terminé' }
  ];

  constructor(
    private mouvementService: MouvementService,
    private vehiculeService: VehiculeService
  ) { }

  selectCurrentWeek(): void {
    const now = new Date();
    this.filterDateStart = startOfWeek(now, { weekStartsOn: 1 });
    this.filterDateEnd = endOfWeek(now, { weekStartsOn: 1 });
    this.applyFilters();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // 1. Load Vehicles for dropdown
    this.vehiculeService.getVehicules().subscribe(v => {
      this.vehicles = v;
    });

    // 2. Load Movements
    this.mouvementService.getMouvements().subscribe({
      next: (data: any[]) => {
        // Pre-filter to exclude completely irrelevant stuff if needed, 
        // but user might want to see history ('terminé'), so we keep reasonable set.
        this.allMouvements = data;

        // Initial filter
        this.applyFilters();
      },
      error: (err: any) => console.error('Error loading movements:', err)
    });
  }

  applyFilters(): void {
    this.filteredMouvements = this.allMouvements.filter(m => {
      // 1. Vehicle Filter
      if (this.selectedVehicleId !== 'all') {
        const mVehicleId = m.vehicule?._id || m.vehicule;
        if (mVehicleId !== this.selectedVehicleId) return false;
      }

      // 2. Status Filter
      if (this.selectedStatus !== 'all') {
        if (m.statut !== this.selectedStatus) return false;
      }

      // 3. Search Query (ID or Objectif)
      if (this.selectedSearchQuery && this.selectedSearchQuery.trim() !== '') {
        const q = this.selectedSearchQuery.trim().toLowerCase();
        const matchesId = m._id && m._id.toLowerCase().includes(q);
        const matchesObjectif = (m.objectif || m.purpose || '').toLowerCase().includes(q);
        if (!matchesId && !matchesObjectif) return false;
      } else {
        // Default 'all' view: Show Active (En cours, Validé) AND recently Completed?
        // Actually user might want to see everything.
        // Let's filter out 'annulé' or 'refusé' by default unless specifically asked?
        // For now, let's just show everything relevant to map.
      }

      // 4. Date Range Filter
      if (this.filterDateStart || this.filterDateEnd) {
        const mDate = m.dateDepart ? new Date(m.dateDepart) : null;
        if (!mDate) return false;

        if (this.filterDateStart && mDate < this.filterDateStart) return false;

        // For end date, we want to include the selected end day fully (until 23:59:59)
        if (this.filterDateEnd) {
          const endOfDay = new Date(this.filterDateEnd);
          endOfDay.setHours(23, 59, 59, 999);
          if (mDate > endOfDay) return false;
        }
      }

      // Ensure it has stops or GPS trace to be mappable

      // Ensure it has stops or GPS trace to be mappable
      const hasStops = m.stops && m.stops.length > 0;
      const hasTrace = m.gpsTrace && m.gpsTrace.length > 0;

      return hasStops || hasTrace;
    });

    // Transform for Map Component (Match interface)
    this.filteredMouvements = this.filteredMouvements.map(m => this.transformToMapMouvement(m));

    // Reset selection when filters change (optional, but safer to avoid invisible selected items)
    // this.selectedTripIds.clear(); 
    // UPDATE: User might want to keep selection even if list shrinks? 
    // Let's keep it simple: If filter changes, we might want to uncheck stuff that is no longer visible?
    // For now, let's re-evaluate what is displayed.

    this.updateMovementsToDisplay();
  }

  updateMovementsToDisplay(): void {
    if (this.selectedTripIds.size > 0) {
      // Rule: Show ONLY selected trips
      this.movementsToDisplay = this.filteredMouvements.filter(m => this.selectedTripIds.has(m.id));
    } else {
      // Rule: Show ALL filtered trips
      this.movementsToDisplay = [...this.filteredMouvements];
    }

    // Update "Select All" state
    this.isAllSelected = this.filteredMouvements.length > 0 && this.selectedTripIds.size === this.filteredMouvements.length;
  }

  toggleTripSelection(trip: any, event: any): void {
    // Prevent bubbling if clicking check box vs row
    // event.stopPropagation(); // Actually we might want row click to select?

    if (this.selectedTripIds.has(trip.id)) {
      this.selectedTripIds.delete(trip.id);
    } else {
      this.selectedTripIds.add(trip.id);
    }
    this.updateMovementsToDisplay();
  }

  toggleSelectAll(event: any): void {
    if (this.isAllSelected) {
      this.selectedTripIds.clear();
    } else {
      this.filteredMouvements.forEach(m => this.selectedTripIds.add(m.id));
    }
    this.isAllSelected = !this.isAllSelected;
    this.updateMovementsToDisplay();
  }


  transformToMapMouvement(trip: any): any {
    const stops = trip.stops && trip.stops.length > 0 ? trip.stops.map((s: any) => {
      let lat = 0;
      let lng = 0;

      // Secure Coordinate Parsing
      if (s.lieu?.coordonnees) {
        const coords = s.lieu.coordonnees;
        if (typeof coords === 'object' && coords.latitude && coords.longitude) {
          lat = parseFloat(coords.latitude);
          lng = parseFloat(coords.longitude);
        } else if (typeof coords === 'string' && coords.includes(',')) {
          const parts = coords.split(',');
          lat = parseFloat(parts[0].trim());
          lng = parseFloat(parts[1].trim());
        }
      } else if (s.lat && s.lng) {
        // Fallback to stop-level coords if they exist
        lat = parseFloat(s.lat);
        lng = parseFloat(s.lng);
      }

      return {
        lieuId: s.lieu?._id || s.lieu,
        nom: s.lieu?.nom || s.nom || 'Stop',
        adresse: s.lieu?.adresse || '',
        lat: isNaN(lat) ? 0 : lat,
        lng: isNaN(lng) ? 0 : lng,
        dateDepart: s.dateDepart,
        dateArrivee: s.dateArrivee
      };
    }) : [];

    // Filter out stops with invalid coordinates (0,0) immediately to avoid pollution
    // BUT we keep them if we want to show non-mapped stops in list? MapMouvementsComponent handles this.
    // For now, let's pass them, MapMouvementsComponent filters (lat && lng).

    return {
      id: trip._id,
      title: trip.objectif || trip.purpose || 'Trajet',
      demandeur: (trip.chauffeur?.prenom || '') + ' ' + (trip.chauffeur?.nom || ''),
      stops: stops,
      gpsTrace: trip.gpsTrace,
      vehiculeName: trip.vehicule ? `${trip.vehicule.marque || ''} ${trip.vehicule.modele || ''} (${trip.vehicule.immatriculation || '?'})` : 'Véhicule Inconnu',
      vehiculeCode: trip.vehicule?.acfCode || ''
    };
  }

  selectTrip(trip: any): void {
    if (this.mapMouvementsComponent) {
      this.mapMouvementsComponent.highlightTrip(trip.id);
    }
    // Also select it if not selected?
    if (!this.selectedTripIds.has(trip.id)) {
      this.selectedTripIds.add(trip.id);
      this.updateMovementsToDisplay();
    }
  }
}
