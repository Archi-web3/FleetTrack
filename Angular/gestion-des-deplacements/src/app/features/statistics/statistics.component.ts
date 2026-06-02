import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    BaseChartDirective,
    TranslateModule
  ],
  template: `
    <div class="statistics-container">
      <h1 class="page-title">
        <mat-icon>bar_chart</mat-icon> {{ 'STATISTICS.TITLE' | translate }}
      </h1>

      <div class="charts-grid">
        <!-- Status Distribution (Pie Chart) -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>{{ 'STATISTICS.CHARTS.STATUS_TITLE' | translate }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-wrapper">
              <canvas baseChart
                [data]="pieChartData"
                [type]="'pie'"
                [options]="pieChartOptions">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Vehicle Usage (Bar Chart) -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>{{ 'STATISTICS.CHARTS.VEHICLE_TITLE' | translate }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-wrapper">
              <canvas baseChart
                [data]="barChartData"
                [type]="'bar'"
                [options]="barChartOptions">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .statistics-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .page-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #005FB6;
      margin-bottom: 24px;
    }
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }
    .chart-card {
      height: 400px;
    }
    .chart-wrapper {
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class StatisticsComponent implements OnInit {
  // Pie Chart (Status)
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  // Bar Chart (Vehicle Usage)
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Distance (km)', backgroundColor: '#005FB6' }
    ]
  };

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadStatusStats();
    this.loadVehicleStats();

    // Update chart label on language change
    this.translate.stream('STATISTICS.CHARTS.DISTANCE_LABEL').subscribe((text: string) => {
      if (this.barChartData.datasets[0]) {
        this.barChartData.datasets[0].label = text;
        // Force update? Usually creating new object works
        this.barChartData = { ...this.barChartData };
      }
    });
  }

  loadStatusStats() {
    this.http.get<any[]>('https://fleettrack-api.onrender.com/api/mouvements/stats-by-status')
      .subscribe(data => {
        // Transform API data to Chart data
        const labels = data.map(d => d.statut.toUpperCase());
        const counts = data.map(d => d.count);

        this.pieChartData = {
          labels: labels,
          datasets: [{
            data: counts,
            backgroundColor: [
              '#4caf50', // Validé (Green)
              '#2196f3', // Pris en charge (Blue)
              '#ff9800', // En cours (Orange)
              '#9e9e9e', // Terminé (Grey)
              '#f44336'  // Refusé/Attente (Red)
            ]
          }]
        };
      });
  }

  loadVehicleStats() {
    this.http.get<any[]>('https://fleettrack-api.onrender.com/api/mouvements/stats-by-vehicle')
      .subscribe(data => {
        const labels = data.map(d => `${d.marque} ${d.modele} (${d.vehicule})`);
        const distances = data.map(d => d.totalDistance);

        // Get translated label
        const label = this.translate.instant('STATISTICS.CHARTS.DISTANCE_LABEL');

        this.barChartData = {
          labels: labels,
          datasets: [
            { data: distances, label: label, backgroundColor: '#005FB6' }
          ]
        };
      });
  }
}
