import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-maintenance-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatListModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'MAINTENANCE_PAGE.DETAILS.TITLE' | translate }}</h2>
    <mat-dialog-content>
      <mat-list>
        <mat-list-item>
          <mat-icon matListItemIcon>calendar_today</mat-icon>
          <div matListItemTitle>{{ 'MAINTENANCE_PAGE.DETAILS.DATE' | translate }}</div>
          <div matListItemLine>{{ data.maintenance.date | date:'dd/MM/yyyy' }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>build</mat-icon>
          <div matListItemTitle>{{ 'MAINTENANCE_PAGE.DETAILS.TYPE' | translate }}</div>
          <div matListItemLine>{{ data.maintenance.type }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>euro</mat-icon>
          <div matListItemTitle>{{ 'MAINTENANCE_PAGE.DETAILS.COST' | translate }}</div>
          <div matListItemLine>{{ data.maintenance.cost | currency:'EUR':'symbol':'1.2-2' }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>speed</mat-icon>
          <div matListItemTitle>{{ 'MAINTENANCE_PAGE.DETAILS.MILEAGE' | translate }}</div>
          <div matListItemLine>{{ data.maintenance.mileage }} km</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>store</mat-icon>
          <div matListItemTitle>{{ 'MAINTENANCE_PAGE.DETAILS.GARAGE' | translate }}</div>
          <div matListItemLine>{{ data.maintenance.garage }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>sync</mat-icon>
          <div matListItemTitle>{{ 'MAINTENANCE_PAGE.DETAILS.SYNC_STATUS' | translate }}</div>
          <div matListItemLine>
            <span [style.color]="data.maintenance.synced ? 'green' : 'orange'">
              {{ (data.maintenance.synced ? 'TRIP_DETAILS.SYNCED' : 'TRIP_DETAILS.WAITING') | translate }}
            </span>
          </div>
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'TRIP_DETAILS.CLOSE' | translate }}</button>
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
