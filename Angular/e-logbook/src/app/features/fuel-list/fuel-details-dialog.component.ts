import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-fuel-details-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatListModule],
    template: `
    <h2 mat-dialog-title>Détails du Ravitaillement</h2>
    <mat-dialog-content>
      <mat-list>
        <mat-list-item>
          <mat-icon matListItemIcon>calendar_today</mat-icon>
          <div matListItemTitle>Date</div>
          <div matListItemLine>{{ data.fuel.date | date:'dd/MM/yyyy' }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>local_gas_station</mat-icon>
          <div matListItemTitle>Quantité</div>
          <div matListItemLine>{{ data.fuel.quantity }} L</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>category</mat-icon>
          <div matListItemTitle>Type de carburant</div>
          <div matListItemLine>{{ data.fuel.type }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>speed</mat-icon>
          <div matListItemTitle>Kilométrage</div>
          <div matListItemLine>{{ data.fuel.mileage }} km</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>store</mat-icon>
          <div matListItemTitle>Source</div>
          <div matListItemLine>{{ data.fuel.source }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>sync</mat-icon>
          <div matListItemTitle>Statut de synchronisation</div>
          <div matListItemLine>
            <span [style.color]="data.fuel.synced ? 'green' : 'orange'">
              {{ data.fuel.synced ? 'Synchronisé' : 'En attente' }}
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
export class FuelDetailsDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<FuelDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { fuel: any }
    ) { }
}
