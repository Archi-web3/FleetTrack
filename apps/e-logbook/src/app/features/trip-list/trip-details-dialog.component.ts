import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Trip, ConsumptionData } from '../../core/services/offline.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-trip-details-dialog',
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
    <h2 mat-dialog-title>
      <mat-icon class="title-icon">info</mat-icon>
      {{ 'TRIP_DETAILS.TITLE' | translate }}
    </h2>
    <mat-dialog-content class="details-content">
      <mat-list>
        <mat-list-item>
          <mat-icon matListItemIcon>calendar_today</mat-icon>
          <div matListItemTitle>{{ 'TRIP_DETAILS.DATE_TIME' | translate }}</div>
          <div matListItemLine>{{ data.trip.startDateTime | date: 'dd/MM/yyyy HH:mm' }}</div>
          @if (data.trip.endDateTime) {
            <div matListItemLine>
              {{ 'TRIP_DETAILS.END' | translate }}
              {{ data.trip.endDateTime | date: 'dd/MM/yyyy HH:mm' }}
            </div>
          }
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>place</mat-icon>
          <div matListItemTitle>{{ 'TRIP_DETAILS.ITINERARY' | translate }}</div>
          <div matListItemLine>
            {{ 'TRIP_DETAILS.DEPARTURE' | translate }} {{ data.departureName }}
          </div>
          <div matListItemLine>{{ 'TRIP_DETAILS.ARRIVAL' | translate }} {{ data.arrivalName }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>speed</mat-icon>
          <div matListItemTitle>{{ 'TRIP_DETAILS.MILEAGE' | translate }}</div>
          <div matListItemLine>
            {{ 'TRIP_DETAILS.START' | translate }} {{ data.trip.startMileage }} km
          </div>
          @if (data.trip.endMileage) {
            <div matListItemLine>
              {{ 'TRIP_DETAILS.FINISH' | translate }} {{ data.trip.endMileage }} km
            </div>
          }
          @if (data.trip.endMileage) {
            <div matListItemLine>
              {{ 'TRIP_DETAILS.DISTANCE' | translate }}
              {{ data.trip.endMileage - data.trip.startMileage }} km
            </div>
          }
        </mat-list-item>

        @if (data.consumptionData) {
          <mat-list-item>
            <mat-icon matListItemIcon>local_gas_station</mat-icon>
            <div matListItemTitle>{{ 'TRIP_DETAILS.CONSUMPTION' | translate }}</div>
            @if (data.consumptionData.accurateConsumption) {
              <div matListItemLine>
                <span style="color: green;">✓</span> {{ 'TRIP_DETAILS.ACCURATE' | translate }}
                {{ data.consumptionData.accurateConsumption | number: '1.1-1' }} L/100km
                <span style="font-size: 11px; color: #666;"
                  >({{ data.consumptionData.accurateBasedOnRefills }}
                  {{ 'TRIP_DETAILS.REFILLS' | translate }})</span
                >
              </div>
            }
            @if (
              data.consumptionData.estimatedConsumption && !data.consumptionData.accurateConsumption
            ) {
              <div matListItemLine>
                <span style="color: orange;">≈</span> {{ 'TRIP_DETAILS.ESTIMATED' | translate }}
                {{ data.consumptionData.estimatedConsumption | number: '1.1-1' }} L/100km
                <span style="font-size: 11px; color: #666;"
                  >({{ data.consumptionData.estimatedBasedOnRefills }}
                  {{ 'TRIP_DETAILS.REFILLS' | translate }})</span
                >
              </div>
            }
            @if (
              !data.consumptionData.accurateConsumption &&
              !data.consumptionData.estimatedConsumption
            ) {
              <div matListItemLine>
                <span style="color: #999;">{{ 'TRIP_DETAILS.INSUFFICIENT_DATA' | translate }}</span>
              </div>
            }
          </mat-list-item>
        }

        <mat-list-item>
          <mat-icon matListItemIcon>group</mat-icon>
          <div matListItemTitle>{{ 'TRIP_DETAILS.PASSENGERS' | translate }}</div>
          <div matListItemLine>{{ data.passengerNames }}</div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>description</mat-icon>
          <div matListItemTitle>{{ 'TRIP_DETAILS.PURPOSE' | translate }}</div>
          <div matListItemLine>
            {{ data.trip.purpose || ('TRIP_DETAILS.NO_PURPOSE' | translate) }}
          </div>
        </mat-list-item>

        <mat-list-item>
          <mat-icon matListItemIcon>sync</mat-icon>
          <div matListItemTitle>{{ 'TRIP_DETAILS.SYNC_STATUS' | translate }}</div>
          <div matListItemLine>
            <span [style.color]="data.trip.synced ? 'green' : 'orange'">
              {{ (data.trip.synced ? 'TRIP_DETAILS.SYNCED' : 'TRIP_DETAILS.WAITING') | translate }}
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
export class TripDetailsDialogComponent {
  dialogRef = inject<MatDialogRef<TripDetailsDialogComponent>>(MatDialogRef);
  data = inject<{
    trip: Trip;
    departureName: string;
    arrivalName: string;
    passengerNames: string;
    consumptionData?: ConsumptionData;
  }>(MAT_DIALOG_DATA);
}
