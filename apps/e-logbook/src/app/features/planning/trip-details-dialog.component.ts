import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { Movement } from '../../core/models/api.types';

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
    MatChipsModule,
    TranslateModule,
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon class="title-icon">info</mat-icon>
      {{ 'DIALOG.DETAILS.TITLE' | translate }}
    </h2>

    <mat-dialog-content class="details-content">
      <!-- Status Chip -->
      <div class="status-container">
        <mat-chip [color]="getStatusColor(data.movement.statut || '')" selected>
          {{ getStatusKey(data.movement.statut || '') | translate | titlecase }}
        </mat-chip>
      </div>

      <!-- General Info -->
      <div class="section">
        <h3><mat-icon>description</mat-icon> {{ 'DIALOG.DETAILS.MISSION' | translate }}</h3>
        <p>
          <strong>{{ 'DIALOG.DETAILS.PURPOSE' | translate }}</strong>
          {{
            data.movement.objectif ||
              data.movement.purpose ||
              ('DIALOG.DETAILS.NOT_SPECIFIED' | translate)
          }}
        </p>
        <p>
          <strong>{{ 'DIALOG.DETAILS.PROJECT' | translate }}</strong>
          {{ data.movement.objectif || ('DIALOG.DETAILS.NOT_SPECIFIED' | translate) }}
        </p>
      </div>

      <mat-divider></mat-divider>

      <!-- Vehicle -->
      @if (data.movement.vehicule) {
        <div class="section">
          <h3><mat-icon>directions_car</mat-icon> {{ 'DIALOG.DETAILS.VEHICLE' | translate }}</h3>
          <p>
            {{ getVehicleMarque(data.movement.vehicule) }} {{ getVehicleModele(data.movement.vehicule) }}<br />
            <span class="text-secondary"
              >{{ 'DIALOG.DETAILS.IMMAT' | translate }}
              {{ getVehicleImmat(data.movement.vehicule) }}</span
            >
          </p>
        </div>
      }

      <mat-divider></mat-divider>

      <!-- Passengers -->
      @if (data.movement.passagers && data.movement.passagers.length > 0) {
        <div class="section">
          <h3>
            <mat-icon>group</mat-icon> {{ 'DIALOG.DETAILS.PASSENGERS' | translate }} ({{
              data.movement.passagers.length
            }})
          </h3>
          <mat-list dense>
            @for (passager of data.movement.passagers; track passager) {
              <mat-list-item>
                <mat-icon matListItemIcon>person</mat-icon>
                <div matListItemTitle>{{ getPassagerNom(passager) }} {{ getPassagerPrenom(passager) }}</div>
                <div matListItemLine class="text-secondary">
                  {{ getPassagerPhone(passager) }}
                </div>
              </mat-list-item>
            }
          </mat-list>
        </div>
      }

      <mat-divider></mat-divider>

      <!-- Itinerary -->
      <div class="section">
        <h3><mat-icon>map</mat-icon> {{ 'DIALOG.DETAILS.ITINERARY' | translate }}</h3>
        <div class="timeline">
          @for (stop of data.movement.stops; track stop; let i = $index; let last = $last) {
            <div class="timeline-item">
              <div class="timeline-marker" [class.start]="i === 0" [class.end]="last"></div>
              <div class="timeline-content">
                <h4>{{ getLieuNom(stop.lieu) || ('DIALOG.DETAILS.UNKNOWN_LOCATION' | translate) }}</h4>
                <p class="text-secondary">{{ getLieuAdresse(stop.lieu) }}</p>
                <div class="time-info">
                  @if (stop.dateDepart) {
                    <span
                      >{{ 'DIALOG.DETAILS.DEPARTURE_TIME' | translate }}
                      {{ stop.dateDepart | date: 'shortTime' }}</span
                    >
                  }
                  @if (stop.dateArrivee) {
                    <span
                      >{{ 'DIALOG.DETAILS.ARRIVAL_TIME' | translate }}
                      {{ stop.dateArrivee | date: 'shortTime' }}</span
                    >
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'DIALOG.DETAILS.CLOSE' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
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
      .timeline-marker.start {
        background: #4caf50;
      }
      .timeline-marker.end {
        background: #f44336;
      }
    `,
  ],
})
export class TripDetailsDialogComponent {
  dialogRef = inject<MatDialogRef<TripDetailsDialogComponent>>(MatDialogRef);
  data = inject<{
    movement: Movement;
  }>(MAT_DIALOG_DATA);

  getVehicleMarque(vehicule: any): string { return typeof vehicule === 'object' && vehicule ? vehicule.marque : ''; }
  getVehicleModele(vehicule: any): string { return typeof vehicule === 'object' && vehicule ? vehicule.modele : ''; }
  getVehicleImmat(vehicule: any): string { return typeof vehicule === 'object' && vehicule ? vehicule.immatriculation : ''; }
  
  getPassagerNom(passager: any): string { return typeof passager === 'object' && passager ? passager.nom : passager; }
  getPassagerPrenom(passager: any): string { return typeof passager === 'object' && passager ? passager.prenom : ''; }
  getPassagerPhone(passager: any): string { return typeof passager === 'object' && passager ? (passager.telephone || passager.email) : ''; }

  getLieuNom(lieu: any): string { return typeof lieu === 'object' && lieu ? lieu.nom : lieu; }
  getLieuAdresse(lieu: any): string { return typeof lieu === 'object' && lieu ? lieu.adresse : ''; }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'en attente': 'warn',
      validé: 'accent',
      'pris en charge': 'primary',
      'en cours': 'primary',
      terminé: '',
      annulé: 'warn',
      refusé: 'warn',
    };
    return colors[status] || '';
  }

  getStatusKey(status: string): string {
    const statusMap: Record<string, string> = {
      'en attente': 'STATUS.WAITING',
      validé: 'STATUS.VALIDATED',
      'pris en charge': 'STATUS.TAKEN_CHARGE',
      'en cours': 'STATUS.IN_PROGRESS',
      terminé: 'STATUS.COMPLETED',
      annulé: 'STATUS.CANCELLED',
      refusé: 'STATUS.REFUSED',
    };
    return statusMap[status] || status;
  }
}
