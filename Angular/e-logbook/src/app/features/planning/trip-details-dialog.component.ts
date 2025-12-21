import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
    selector: 'app-trip-details-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatDividerModule,
        MatChipsModule
    ],
    template: `
    <h2 mat-dialog-title>
      <mat-icon class="title-icon">info</mat-icon>
      Détails de la mission
    </h2>
    
    <mat-dialog-content class="details-content">
      <!-- Status Chip -->
      <div class="status-container">
        <mat-chip [color]="getStatusColor(data.movement.statut)" selected>
            {{ data.movement.statut | titlecase }}
        </mat-chip>
      </div>

      <!-- General Info -->
      <div class="section">
        <h3><mat-icon>description</mat-icon> Mission</h3>
        <p><strong>Motif/Objectif:</strong> {{ data.movement.objectif || data.movement.purpose || 'Non spécifié' }}</p>
        <p><strong>Projet:</strong> {{ data.movement.projet || 'Non spécifié' }}</p>
      </div>
      
      <mat-divider></mat-divider>

      <!-- Vehicle -->
      <div class="section" *ngIf="data.movement.vehicule">
        <h3><mat-icon>directions_car</mat-icon> Véhicule</h3>
        <p>
            {{ data.movement.vehicule.marque }} {{ data.movement.vehicule.modele }}<br>
            <span class="text-secondary">Immat: {{ data.movement.vehicule.immatriculation }}</span>
        </p>
      </div>

      <mat-divider></mat-divider>

      <!-- Passengers -->
      <div class="section" *ngIf="data.movement.passagers?.length > 0">
        <h3><mat-icon>group</mat-icon> Passagers ({{data.movement.passagers.length}})</h3>
        <mat-list dense>
          <mat-list-item *ngFor="let passager of data.movement.passagers">
            <mat-icon matListItemIcon>person</mat-icon>
            <div matListItemTitle>{{ passager.nom }} {{ passager.prenom }}</div>
            <div matListItemLine class="text-secondary">{{ passager.telephone || passager.email }}</div>
          </mat-list-item>
        </mat-list>
      </div>

      <mat-divider></mat-divider>

      <!-- Itinerary -->
      <div class="section">
        <h3><mat-icon>map</mat-icon> Itinéraire</h3>
        <div class="timeline">
            <div class="timeline-item" *ngFor="let stop of data.movement.stops; let i = index; let last = last">
                <div class="timeline-marker" [class.start]="i===0" [class.end]="last"></div>
                <div class="timeline-content">
                    <h4>{{ stop.lieu?.nom || 'Lieu inconnu' }}</h4>
                    <p class="text-secondary">{{ stop.lieu?.adresse }}</p>
                    <div class="time-info">
                        <span *ngIf="stop.dateDepart">Départ: {{ stop.dateDepart | date:'shortTime' }}</span>
                        <span *ngIf="stop.dateArrivee">Arrivée: {{ stop.dateArrivee | date:'shortTime' }}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fermer</button>
    </mat-dialog-actions>
  `,
    styles: [`
    .title-icon {
        vertical-align: middle;
        margin-right: 8px;
    }
    .status-container {
        margin-bottom: 16px;
        text-align: center;
    }
    .section {
        margin: 16px 0;
    }
    h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1rem;
        color: #333;
        margin-bottom: 8px;
    }
    .text-secondary {
        color: #666;
        font-size: 0.9em;
    }
    
    /* Timeline styles */
    .timeline {
        position: relative;
        padding-left: 20px;
        border-left: 2px solid #ddd;
        margin-left: 10px;
    }
    .timeline-item {
        position: relative;
        padding-bottom: 20px;
        padding-left: 15px;
    }
    .timeline-marker {
        position: absolute;
        left: -26px; /* Adjust based on border and padding */
        top: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ccc;
        border: 2px solid #fff;
    }
    .timeline-marker.start { background: #4caf50; }
    .timeline-marker.end { background: #f44336; }
  `]
})
export class TripDetailsDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<TripDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { movement: any }
    ) { }

    getStatusColor(status: string): string {
        const colors: any = {
            'en attente': 'warn',
            'validé': 'accent',
            'pris en charge': 'primary',
            'en cours': 'primary',
            'terminé': '',
            'annulé': 'warn',
            'refusé': 'warn'
        };
        return colors[status] || '';
    }
}
