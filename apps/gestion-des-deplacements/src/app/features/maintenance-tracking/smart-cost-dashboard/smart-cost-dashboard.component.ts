import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  CostAnalyticsService,
  TCOData,
  CostForecast,
  ReliabilityStat,
} from '../cost-analytics/cost-analytics.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SettingsService } from '../../../core/services/settings.service'; // Import SettingsService
import { ServiceCostDialogComponent } from './service-cost-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-smart-cost-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
    TranslateModule,
  ],
  templateUrl: './smart-cost-dashboard.component.html',
  styleUrls: ['./smart-cost-dashboard.component.scss'],
})
export class SmartCostDashboardComponent implements OnInit {
  private analyticsService = inject(CostAnalyticsService);
  private settingsService = inject(SettingsService);
  private dialog = inject(MatDialog);

  tcoData: TCOData | null = null;
  forecast: CostForecast | null = null;
  reliabilityStats: ReliabilityStat[] = [];

  loading = true;

  forecastMonths = 1;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    // 1. TCO (Last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    this.analyticsService
      .getTCO(startDate.toISOString(), endDate.toISOString())
      .subscribe((data) => {
        this.tcoData = data;
        this.checkLoading();
      });

    // 2. Forecast (Dynamic Duration)
    this.loadForecast(this.forecastMonths);

    // 3. Reliability
    this.analyticsService.getReliabilityRanking().subscribe((data) => {
      this.reliabilityStats = data;
      this.checkLoading();
    });
  }

  loadForecast(months: number) {
    this.forecastMonths = months;
    // Don't set global loading true to avoid flickering everything
    this.analyticsService.getCostForecast(months).subscribe((data) => {
      this.forecast = data;
      this.checkLoading();
    });
  }

  openConfigDialog() {
    this.settingsService.getServiceCosts().subscribe((currentCosts) => {
      const dialogRef = this.dialog.open(ServiceCostDialogComponent, {
        width: '400px',
        data: currentCosts || {}, // Pass current or empty (dialog handles defaults)
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.settingsService.saveServiceCosts(result).subscribe(() => {
            // Reload forecast to reflect changes
            this.loadForecast(this.forecastMonths);
          });
        }
      });
    });
  }

  private checkLoading() {
    if (this.tcoData && this.forecast && this.reliabilityStats) {
      this.loading = false;
    }
  }

  getCostPerKm(): number {
    const estTotalKm = (this.tcoData?.vehicleCount || 1) * 1500;
    return this.tcoData ? this.tcoData.totalCost / estTotalKm : 0;
  }

  getHealthColor(score: number): string {
    if (score >= 80) return 'primary';
    if (score >= 50) return 'accent';
    return 'warn';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }
}
