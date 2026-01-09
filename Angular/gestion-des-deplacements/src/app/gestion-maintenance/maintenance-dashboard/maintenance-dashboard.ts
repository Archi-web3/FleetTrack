import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { MaintenanceService, ServiceSchedule } from '../../maintenance.service';

@Component({
    selector: 'app-maintenance-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatProgressBarModule,
        MatChipsModule,
        RouterModule
    ],
    templateUrl: './maintenance-dashboard.html',
    styleUrls: ['./maintenance-dashboard.scss']
})
export class MaintenanceDashboardComponent implements OnInit {
    alerts: ServiceSchedule[] = [];
    loading = false;
    displayedColumns: string[] = ['vehicule', 'type', 'statut', 'km', 'actions'];
    stats: any = {
        totalVehicules: 0,
        servicesDus: 0,
        checklistsRetard: 0,
        coutMoyen: 0
    };

    constructor(private maintenanceService: MaintenanceService) { }

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.loading = true;

        // Charger les alertes
        this.maintenanceService.getAllServiceAlerts().subscribe({
            next: (data) => {
                this.alerts = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Erreur chargement alertes:', error);
                this.loading = false;
            }
        });

        // Charger les statistiques réelles
        this.maintenanceService.getDashboardStats().subscribe({
            next: (stats) => {
                this.stats = stats;
            },
            error: (error) => {
                console.error('Erreur chargement stats:', error);
            }
        });
    }

    getStatusColor(statut: string): string {
        switch (statut) {
            case 'Dû': return 'warn';
            case 'En retard': return 'warn'; // Plus foncé en CSS
            case 'À venir': return 'primary';
            default: return 'accent';
        }
    }

    getKmRemaining(service: ServiceSchedule): number {
        return Math.max(0, service.kilometragePrevu - service.kilometrageActuel);
    }
}
