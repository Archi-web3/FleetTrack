import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Trip, ConsumptionData } from '../../core/services/offline.service';

@Component({
  selector: 'app-trip-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatListModule],
  template: `
    <h2 mat-dialog-title>Détails du Trajet</h2>
    <mat-dialog-content>
      <mat-list>
        <mat-list-item>
          <mat-icon matListItemIcon>calendar_today</mat-icon>
          <div matListItemTitle>Date & Heure</div>
          <div matListItemLine>{{ data.trip.startDateTime | date:'dd/MM/yyyy HH:mm' }}</div>
          <div matListItemLine *ngIf="data.trip.endDateTime">Fin: {{ data.trip.endDateTime | date:'dd/MM/yyyy HH:mm' }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>place</mat-icon>
          <div matListItemTitle>Itinéraire</div>
          <div matListItemLine>Départ: {{ data.departureName }}</div>
          <div matListItemLine>Arrivée: {{ data.arrivalName }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>speed</mat-icon>
          <div matListItemTitle>Kilométrage</div>
          <div matListItemLine>Début: {{ data.trip.startMileage }} km</div>
          <div matListItemLine *ngIf="data.trip.endMileage">Fin: {{ data.trip.endMileage }} km</div>
          <div matListItemLine *ngIf="data.trip.endMileage">Distance: {{ data.trip.endMileage - data.trip.startMileage }} km</div>
        </mat-list-item>

        <mat-list-item *ngIf="data.consumptionData">
          <mat-icon matListItemIcon>local_gas_station</mat-icon>
          <div matListItemTitle>Consommation</div>
          <div matListItemLine *ngIf="data.consumptionData.accurateConsumption">
            <span style="color: green;">✓</span> Précise: {{ data.consumptionData.accurateConsumption | number:'1.1-1' }} L/100km
            <span style="font-size: 11px; color: #666;">({{ data.consumptionData.accurateBasedOnRefills }} pleins)</span>
          </div>
          <div matListItemLine *ngIf="data.consumptionData.estimatedConsumption && !data.consumptionData.accurateConsumption">
            <span style="color: orange;">≈</span> Estimée: {{ data.consumptionData.estimatedConsumption | number:'1.1-1' }} L/100km
            <span style="font-size: 11px; color: #666;">({{ data.consumptionData.estimatedBasedOnRefills }} ravitaillements)</span>
          </div>
          <div matListItemLine *ngIf="!data.consumptionData.accurateConsumption && !data.consumptionData.estimatedConsumption">
            <span style="color: #999;">Données insuffisantes</span>
          </div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>group</mat-icon>
          <div matListItemTitle>Passagers</div>
          <div matListItemLine>{{ data.passengerNames }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>description</mat-icon>
          <div matListItemTitle>Motif</div>
          <div matListItemLine>{{ data.trip.purpose || 'Aucun motif spécifié' }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>sync</mat-icon>
          <div matListItemTitle>Statut de synchronisation</div>
          <div matListItemLine>
            <span [style.color]="data.trip.synced ? 'green' : 'orange'">
              {{ data.trip.synced ? 'Synchronisé' : 'En attente' }}
            </span>
          </div>
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fermer</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-list-item {
      margin-bottom: 8px;
    }
  `]
})
export class TripDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TripDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      trip: Trip,
      departureName: string,
      arrivalName: string,
      passengerNames: string,
      consumptionData?: ConsumptionData
    }
  ) { }
}
