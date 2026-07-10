import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AxeService, Axe } from '../../core/services/axe.service';
import { LieuService } from '../../core/services/lieu.service';
import { AppStateService } from '../../core/services/app-state.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-gestion-axes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
  ],
  templateUrl: './gestion-axes.html',
  styleUrls: ['./gestion-axes.css']
})
export class GestionAxesComponent implements OnInit, AfterViewInit {
  axes: Axe[] = [];
  lieux: any[] = [];
  displayedColumns: string[] = ['nom', 'depart', 'arrivee', 'niveau', 'actions'];
  
  showModal = false;
  selectedAxe: Partial<Axe> | null = null;
  
  private map!: L.Map;
  private polylines: L.Polyline[] = [];
  private markers: L.Marker[] = [];

  constructor(
    private axeService: AxeService,
    private lieuService: LieuService,
    public appState: AppStateService
  ) {}

  ngOnInit() {
    this.loadData();
    this.appState.context$.subscribe(() => {
      this.loadData();
    });
  }

  ngAfterViewInit() {
    // Timeout to ensure tab is rendered if map is visible
    setTimeout(() => this.initMap(), 500);
  }

  onTabChange(event: any) {
    if (event.index === 1) { // Map tab
      setTimeout(() => {
        if (!this.map) {
          this.initMap();
        } else {
          this.map.invalidateSize();
        }
        this.drawAxesOnMap();
      }, 100);
    }
  }

  loadData() {
    this.axeService.getAxes().subscribe(axes => {
      this.axes = axes;
      if (this.map) this.drawAxesOnMap();
    });
    this.lieuService.getLieux().subscribe(lieux => {
      this.lieux = lieux;
    });
  }

  openModal(axe?: Axe) {
    if (axe) {
      this.selectedAxe = { ...axe, depart: axe.depart._id || axe.depart, arrivee: axe.arrivee._id || axe.arrivee };
    } else {
      this.selectedAxe = { nom: '', depart: '', arrivee: '', niveauSecurite: 1, actif: true, pays: this.appState.getCurrentContext().paysIds[0] || '' };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedAxe = null;
  }

  saveAxe() {
    if (!this.selectedAxe) return;
    
    if (this.selectedAxe._id) {
      this.axeService.updateAxe(this.selectedAxe._id, this.selectedAxe).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    } else {
      this.axeService.createAxe(this.selectedAxe).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    }
  }

  deleteAxe(id: string) {
    if (confirm('Voulez-vous vraiment supprimer cet axe ?')) {
      this.axeService.deleteAxe(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  getLieuName(lieuId: any): string {
    if (typeof lieuId === 'object' && lieuId !== null) return lieuId.nom;
    const lieu = this.lieux.find(l => l._id === lieuId);
    return lieu ? lieu.nom : 'Inconnu';
  }
  
  getLieuObj(lieuId: any): any {
    if (typeof lieuId === 'object' && lieuId !== null) return lieuId;
    return this.lieux.find(l => l._id === lieuId);
  }

  private initMap(): void {
    if (document.getElementById('axesMap') && !this.map) {
      this.map = L.map('axesMap').setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);
    }
  }

  private drawAxesOnMap(): void {
    if (!this.map) return;

    // Clear existing
    this.polylines.forEach(p => p.remove());
    this.markers.forEach(m => m.remove());
    this.polylines = [];
    this.markers = [];

    const bounds: L.LatLng[] = [];

    this.axes.forEach(axe => {
      const depart = this.getLieuObj(axe.depart);
      const arrivee = this.getLieuObj(axe.arrivee);

      if (depart && arrivee && depart.coordonnees && arrivee.coordonnees) {
        const latLng1 = L.latLng(depart.coordonnees.latitude, depart.coordonnees.longitude);
        const latLng2 = L.latLng(arrivee.coordonnees.latitude, arrivee.coordonnees.longitude);

        bounds.push(latLng1, latLng2);

        let color = '#4caf50'; // Level 1-2 (Green)
        if (axe.niveauSecurite === 3) color = '#ff9800'; // Orange
        if (axe.niveauSecurite >= 4) color = '#f44336'; // Red

        const polyline = L.polyline([latLng1, latLng2], {
          color: color,
          weight: 5,
          opacity: 0.8
        }).addTo(this.map);
        
        polyline.bindPopup(`<b>${axe.nom}</b><br>Niveau: ${axe.niveauSecurite}<br><i>${axe.commentaire || 'Aucun commentaire'}</i>`);
        this.polylines.push(polyline);
        
        // Add markers
        const m1 = L.circleMarker(latLng1, { radius: 5, color: '#333', fillColor: '#fff', fillOpacity: 1 }).addTo(this.map).bindTooltip(depart.nom);
        const m2 = L.circleMarker(latLng2, { radius: 5, color: '#333', fillColor: '#fff', fillOpacity: 1 }).addTo(this.map).bindTooltip(arrivee.nom);
        this.markers.push(m1, m2);
      }
    });

    if (bounds.length > 0) {
      this.map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50] });
    }
  }
}
