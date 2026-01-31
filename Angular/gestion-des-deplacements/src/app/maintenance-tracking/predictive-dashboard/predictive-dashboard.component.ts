import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaintenanceTrackingService } from '../maintenance-tracking.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-predictive-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatTableModule,
        MatProgressBarModule,
        MatButtonModule,
        MatChipsModule,
        MatTooltipModule,
        TranslateModule
    ],
    templateUrl: './predictive-dashboard.component.html',
    styleUrls: ['./predictive-dashboard.component.css']
})
export class PredictiveDashboardComponent implements OnInit {
    stats: any = {
        globalHealth: 100,
        alertsCount: 0,
        totalVehicles: 0
    };
    alerts: any[] = [];
    predictions: any[] = [];
    loading = false;
    displayedColumns: string[] = ['vehicule', 'currentKm', 'nextService', 'estimatedDate', 'health', 'status'];

    constructor(private service: MaintenanceTrackingService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.service.getFleetHealth().subscribe({
            next: (data) => {
                this.stats.globalHealth = data.globalHealth;
                this.stats.alertsCount = data.alertsCount;
                this.stats.totalVehicles = data.totalVehicles;
                this.alerts = data.alerts;
                this.predictions = data.predictions;
                this.loading = false;
            },
            error: (err) => {
                console.error('Erreur chargement prédictions:', err);
                this.loading = false;
            }
        });
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
