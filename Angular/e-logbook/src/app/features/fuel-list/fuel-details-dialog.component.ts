import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-fuel-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatListModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'FUEL_PAGE.DETAILS.TITLE' | translate }}</h2>
    <mat-dialog-content>
      <mat-list>
        <mat-list-item>
          <mat-icon matListItemIcon>calendar_today</mat-icon>
          <div matListItemTitle>{{ 'FUEL_PAGE.DETAILS.DATE' | translate }}</div>
          <div matListItemLine>{{ data.fuel.date | date:'dd/MM/yyyy' }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>local_gas_station</mat-icon>
          <div matListItemTitle>{{ 'FUEL_PAGE.DETAILS.QUANTITY' | translate }}</div>
          <div matListItemLine>{{ data.fuel.quantity }} L</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>category</mat-icon>
          <div matListItemTitle>{{ 'FUEL_PAGE.DETAILS.TYPE' | translate }}</div>
          <div matListItemLine>{{ data.fuel.type }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>speed</mat-icon>
          <div matListItemTitle>{{ 'FUEL_PAGE.DETAILS.MILEAGE' | translate }}</div>
          <div matListItemLine>{{ data.fuel.mileage }} km</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>store</mat-icon>
          <div matListItemTitle>{{ 'FUEL_PAGE.DETAILS.SOURCE' | translate }}</div>
          <div matListItemLine>{{ data.fuel.source }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>sync</mat-icon>
          <div matListItemTitle>{{ 'FUEL_PAGE.DETAILS.SYNC_STATUS' | translate }}</div>
          <div matListItemLine>
            <span [style.color]="data.fuel.synced ? 'green' : 'orange'">
              {{ (data.fuel.synced ? 'TRIP_DETAILS.SYNCED' : 'TRIP_DETAILS.WAITING') | translate }}
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
export class FuelDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FuelDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fuel: any }
  ) { }
}
