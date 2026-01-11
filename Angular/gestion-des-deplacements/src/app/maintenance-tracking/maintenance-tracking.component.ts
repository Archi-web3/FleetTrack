import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MaintenanceTrackingService } from './maintenance-tracking.service';
import { AdminService } from '../admin.service';

@Component({
    selector: 'app-maintenance-tracking',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatChipsModule,
        MatBadgeModule,
        MatDialogModule
    ],
    templateUrl: './maintenance-tracking.component.html',
    styleUrls: ['./maintenance-tracking.component.css']
})
export class MaintenanceTrackingComponent implements OnInit {
    vehicules: any[] = [];
    alerts: any[] = [];
    bases: any[] = [];
    loading = false;

    // Filtres
    selectedBase: string = '';
    selectedStatus: string = '';
    selectedType: string = '';

    // Colonnes affichées
    displayedColumns: string[] = ['immatriculation', 'type', 'km', 'dernierService', 'prochainService', 'ecart', 'statut', 'actions'];

    constructor(
        private trackingService: MaintenanceTrackingService,
        private adminService: AdminService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.loadBases();
        this.loadOverview();
        this.loadAlerts();
    }

    loadBases() {
        this.adminService.getBases().subscribe(
            data => this.bases = data,
            error => console.error('Erreur chargement bases:', error)
        );
    }

    loadOverview() {
        this.loading = true;
        const filters: any = {};
        if (this.selectedBase) filters.base = this.selectedBase;
        if (this.selectedStatus) filters.statut = this.selectedStatus;
        if (this.selectedType) filters.typeVehicule = this.selectedType;

        this.trackingService.getOverview(filters).subscribe({
            next: (data) => {
                this.vehicules = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Erreur chargement overview:', error);
                this.loading = false;
            }
        });
    }

    loadAlerts() {
        this.trackingService.getAlerts().subscribe({
            next: (data) => this.alerts = data,
            error: (error) => console.error('Erreur chargement alertes:', error)
        });
    }

    applyFilters() {
        this.loadOverview();
    }

    resetFilters() {
        this.selectedBase = '';
        this.selectedStatus = '';
        this.selectedType = '';
        this.loadOverview();
    }

    getStatusIcon(statusCode: string): string {
        switch (statusCode) {
            case 'ok': return '🟢';
            case 'proche': return '🟡';
            case 'retard': return '🔴';
            case 'critique': return '🟣';
            default: return '⚪';
        }
    }

    getStatusLabel(statusCode: string): string {
        switch (statusCode) {
            case 'ok': return 'À jour';
            case 'proche': return 'Proche';
            case 'retard': return 'En retard';
            case 'critique': return 'Critique';
            default: return 'Inconnu';
        }
    }

    getStatusColor(statusCode: string): string {
        switch (statusCode) {
            case 'ok': return '#4caf50';
            case 'proche': return '#ff9800';
            case 'retard': return '#f44336';
            case 'critique': return '#9c27b0';
            default: return '#757575';
        }
    }

    formatDate(date: any): string {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('fr-FR');
    }

    formatEcart(ecartKm: number | null): string {
        if (ecartKm === null) return '-';
        if (ecartKm > 0) return `Dans ${ecartKm} km`;
        return `Retard de ${Math.abs(ecartKm)} km`;
    }

    viewVehiculeDetail(vehicule: any) {
        // TODO: Ouvrir dialog avec détails (Phase 2b)
        console.log('Détail véhicule:', vehicule);
        alert(`Détail pour ${vehicule.vehicule.immatriculation} - À implémenter`);
    }
}
