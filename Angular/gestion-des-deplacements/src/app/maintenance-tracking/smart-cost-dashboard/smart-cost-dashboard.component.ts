import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CostAnalyticsService, TCOData, CostForecast, ReliabilityStat } from '../cost-analytics/cost-analytics.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-smart-cost-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule
    ],
    templateUrl: './smart-cost-dashboard.component.html',
    styleUrls: ['./smart-cost-dashboard.component.scss']
})
export class SmartCostDashboardComponent implements OnInit {
    tcoData: TCOData | null = null;
    forecast: CostForecast | null = null;
    reliabilityStats: ReliabilityStat[] = [];

    loading = true;

    forecastMonths = 1; // Default 1 month

    constructor(private analyticsService: CostAnalyticsService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading = true;

        // 1. TCO (Last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        this.analyticsService.getTCO(startDate.toISOString(), endDate.toISOString()).subscribe(data => {
            this.tcoData = data;
            this.checkLoading();
        });

        // 2. Forecast (Dynamic Duration)
        this.loadForecast(this.forecastMonths);

        // 3. Reliability
        this.analyticsService.getReliabilityRanking().subscribe(data => {
            this.reliabilityStats = data;
            this.checkLoading();
        });
    }

    loadForecast(months: number) {
        this.forecastMonths = months;
        // Don't set global loading true to avoid flickering everything
        this.analyticsService.getCostForecast(months).subscribe(data => {
            this.forecast = data;
            this.checkLoading();
        });
    }

    private checkLoading() {
        if (this.tcoData && this.forecast && this.reliabilityStats) {
            this.loading = false;
        }
    }

    getCostPerKm(): number {
        const estTotalKm = (this.tcoData?.vehicleCount || 1) * 1500;
        return this.tcoData ? (this.tcoData.totalCost / estTotalKm) : 0;
    }

    // NOUVEAU : Helpers pour la table de prédiction
    getHealthColor(score: number): string {
        if (score >= 80) return 'primary';
        if (score >= 50) return 'accent';
        return 'warn';
    }

    formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString();
    }
}
