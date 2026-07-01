import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { Incident } from '../../core/services/offline.service';

@Component({
  selector: 'app-incident-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    TranslateModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ 'INCIDENT_PAGE.DETAILS.TITLE' | translate }}</h2>
    <mat-dialog-content>
      <mat-list>
        <mat-list-item>
          <mat-icon matListItemIcon>calendar_today</mat-icon>
          <div matListItemTitle>{{ 'INCIDENT_PAGE.DETAILS.DATE' | translate }}</div>
          <div matListItemLine>{{ data.incident.date | date: 'dd/MM/yyyy' }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>warning</mat-icon>
          <div matListItemTitle>{{ 'INCIDENT_PAGE.DETAILS.TYPE' | translate }}</div>
          <div matListItemLine>{{ data.incident.type }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>priority_high</mat-icon>
          <div matListItemTitle>{{ 'INCIDENT_PAGE.DETAILS.SEVERITY' | translate }}</div>
          <div matListItemLine>
            <span [style.color]="getSeverityColor(data.incident.severity)">
              {{ data.incident.severity }}
            </span>
          </div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>description</mat-icon>
          <div matListItemTitle>{{ 'INCIDENT_PAGE.DETAILS.DESCRIPTION' | translate }}</div>
          <div matListItemLine>{{ data.incident.description }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>sync</mat-icon>
          <div matListItemTitle>{{ 'INCIDENT_PAGE.DETAILS.SYNC_STATUS' | translate }}</div>
          <div matListItemLine>
            <span [style.color]="data.incident.synced ? 'green' : 'orange'">
              {{
                (data.incident.synced ? 'TRIP_DETAILS.SYNCED' : 'TRIP_DETAILS.WAITING') | translate
              }}
            </span>
          </div>
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'TRIP_DETAILS.CLOSE' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-list-item {
        margin-bottom: 8px;
      }
    `,
  ],
})
export class IncidentDetailsDialogComponent {
  dialogRef = inject<MatDialogRef<IncidentDetailsDialogComponent>>(MatDialogRef);
  data = inject<{
    incident: Incident;
  }>(MAT_DIALOG_DATA);

  getSeverityColor(severity: string): string {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'black';
    }
  }
}
