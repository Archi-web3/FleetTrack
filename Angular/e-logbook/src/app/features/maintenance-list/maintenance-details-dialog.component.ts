import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-maintenance-details-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatListModule],
    template: `
    <h2 mat-dialog-title>Détails de la Maintenance</h2>
    <mat-dialog-content>
      <mat-list>
        <mat-list-item>
          <mat-icon matListItemIcon>calendar_today</mat-icon>
          <div matListItemTitle>Date</div>
          <div matListItemLine>{{ data.maintenance.date | date:'dd/MM/yyyy' }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>build</mat-icon>
          <div matListItemTitle>Type</div>
          <div matListItemLine>{{ data.maintenance.type }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>euro</mat-icon>
          <div matListItemTitle>Coût</div>
          <div matListItemLine>{{ data.maintenance.cost | currency:'EUR':'symbol':'1.2-2' }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>speed</mat-icon>
          <div matListItemTitle>Kilométrage</div>
          <div matListItemLine>{{ data.maintenance.mileage }} km</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>store</mat-icon>
          <div matListItemTitle>Garage</div>
          <div matListItemLine>{{ data.maintenance.garage }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>sync</mat-icon>
          <div matListItemTitle>Statut de synchronisation</div>
          <div matListItemLine>
            <span [style.color]="data.maintenance.synced ? 'green' : 'orange'">
              {{ data.maintenance.synced ? 'Synchronisé' : 'En attente' }}
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
export class MaintenanceDetailsDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<MaintenanceDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { maintenance: any }
    ) { }
}
