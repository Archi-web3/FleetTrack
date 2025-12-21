import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-incident-details-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatListModule],
    template: `
    <h2 mat-dialog-title>Détails de l'Incident</h2>
    <mat-dialog-content>
      <mat-list>
        <mat-list-item>
          <mat-icon matListItemIcon>calendar_today</mat-icon>
          <div matListItemTitle>Date</div>
          <div matListItemLine>{{ data.incident.date | date:'dd/MM/yyyy' }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>warning</mat-icon>
          <div matListItemTitle>Type</div>
          <div matListItemLine>{{ data.incident.type }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>priority_high</mat-icon>
          <div matListItemTitle>Gravité</div>
          <div matListItemLine>
            <span [style.color]="getSeverityColor(data.incident.severity)">
              {{ data.incident.severity }}
            </span>
          </div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>description</mat-icon>
          <div matListItemTitle>Description</div>
          <div matListItemLine>{{ data.incident.description }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>sync</mat-icon>
          <div matListItemTitle>Statut de synchronisation</div>
          <div matListItemLine>
            <span [style.color]="data.incident.synced ? 'green' : 'orange'">
              {{ data.incident.synced ? 'Synchronisé' : 'En attente' }}
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
export class IncidentDetailsDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<IncidentDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { incident: any }
    ) { }

    getSeverityColor(severity: string): string {
        switch (severity?.toLowerCase()) {
            case 'high': return 'red';
            case 'medium': return 'orange';
            case 'low': return 'green';
            default: return 'black';
        }
    }
}
