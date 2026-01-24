import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MouvementService } from '../../mouvement.service';
import { VehiculeService } from '../../vehicule.service';
import { MapMouvementsComponent } from '../../map-mouvements/map-mouvements.component';

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
    MapMouvementsComponent
  ],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements OnInit {
  // Data
  allMouvements: any[] = [];
  filteredMouvements: any[] = []; // Those passed to the map
  vehicles: any[] = [];

  // Filters
  selectedVehicleId: string | 'all' = 'all';
  selectedStatus: string | 'all' = 'all'; // Default to show all active types

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
      } else {
        // Default 'all' view: Show Active (En cours, Validé) AND recently Completed?
        // Actually user might want to see everything.
        // Let's filter out 'annulé' or 'refusé' by default unless specifically asked?
        // For now, let's just show everything relevant to map.
      }

      // Ensure it has stops or GPS trace to be mappable
      const hasStops = m.stops && m.stops.length > 0;
      const hasTrace = m.gpsTrace && m.gpsTrace.length > 0;

      return hasStops || hasTrace;
    });

    // Transform for Map Component (Match interface)
    this.filteredMouvements = this.filteredMouvements.map(m => this.transformToMapMouvement(m));
  }

  transformToMapMouvement(trip: any): any {
    // Adapter le format pour app-map-mouvements
    const stops = trip.stops && trip.stops.length > 0 ? trip.stops.map((s: any) => ({
      lieuId: s.lieu?._id || s.lieu,
      nom: s.lieu?.nom || 'Stop',
      adresse: s.lieu?.adresse || '',
      lat: s.lieu?.coordonnees?.lat || (typeof s.lieu?.coordonnees === 'string' ? parseFloat(s.lieu.coordonnees.split(',')[0]) : 0),
      lng: s.lieu?.coordonnees?.lng || (typeof s.lieu?.coordonnees === 'string' ? parseFloat(s.lieu.coordonnees.split(',')[1]) : 0),
      dateDepart: s.dateDepart,
      dateArrivee: s.dateArrivee
    })) : [];

    return {
      id: trip._id,
      title: trip.objectif || trip.purpose || 'Trajet',
      demandeur: (trip.chauffeur?.prenom || '') + ' ' + (trip.chauffeur?.nom || ''),
      stops: stops,
      gpsTrace: trip.gpsTrace
    };
  }
}
