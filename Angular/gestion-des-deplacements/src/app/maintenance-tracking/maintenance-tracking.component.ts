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
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MaintenanceTrackingService } from './maintenance-tracking.service';
import { AdminService } from '../admin.service';
import { MouvementService } from '../mouvement.service';
import { PredictiveDashboardComponent } from './predictive-dashboard/predictive-dashboard.component'; // NOUVEAU

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
        MatDialogModule,
        MatTabsModule,
        TranslateModule,
        PredictiveDashboardComponent // NOUVEAU
    ],
    templateUrl: './maintenance-tracking.component.html',
    styleUrls: ['./maintenance-tracking.component.css']
})
export class MaintenanceTrackingComponent implements OnInit {
    vehicules: any[] = [];
    alerts: any[] = [];
    bases: any[] = [];
    loading = false;
    Math = Math; // Expose Math to template

    // Onglet 2 : Liste des Maintenances
    maintenanceSlots: any[] = [];
    loadingSlots = false;
    displayedColumnsSlots: string[] = ['date', 'vehicule', 'type', 'description', 'statut', 'actions'];

    // Filtres
    selectedBase: string = '';
    selectedStatus: string = '';
    selectedType: string = '';

    // Colonnes affichées (Onglet 1)
    displayedColumns: string[] = ['immatriculation', 'type', 'km', 'dernierService', 'prochainService', 'ecart', 'statut', 'actions'];

    constructor(
        private trackingService: MaintenanceTrackingService,
        private adminService: AdminService,
        private mouvementService: MouvementService, // NOUVEAU
        private router: Router, // NOUVEAU
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.loadBases();
        this.loadOverview();
        this.loadAlerts();
        this.loadMaintenanceSlots(); // NOUVEAU
    }

    loadBases() {
        // NOUVEAU: Récupérer le pays sélectionné (pour SuperAdmin)
        const storedCountry = localStorage.getItem('selectedCountry');
        let countryId = undefined;

        if (storedCountry) {
            // Le service stocke directement l'ID (string), pas un objet JSON
            // Mais on vérifie quand même si c'est un objet JSON au cas où (legacy)
            if (storedCountry.startsWith('{')) {
                try {
                    const countryObj = JSON.parse(storedCountry);
                    countryId = countryObj._id || countryObj.id;
                } catch (e) {
                    // Fallback: raw string
                    countryId = storedCountry;
                }
            } else {
                countryId = storedCountry;
            }
        }

        this.adminService.getBases(countryId).subscribe(
            (data: any) => this.bases = data,
            (error: any) => console.error('Erreur chargement bases:', error)
        );
    }

    loadOverview() {
        this.loading = true;
        const filters: any = {};
        if (this.selectedBase) filters.base = this.selectedBase;
        if (this.selectedStatus) filters.statut = this.selectedStatus;
        if (this.selectedType) filters.typeVehicule = this.selectedType;

        this.trackingService.getOverview(filters).subscribe({
            next: (data: any) => {
                this.vehicules = data;
                this.loading = false;
            },
            error: (error: any) => {
                console.error('Erreur chargement overview:', error);
                this.loading = false;
            }
        });
    }

    loadAlerts() {
        this.trackingService.getAlerts().subscribe({
            next: (data: any) => this.alerts = data,
            error: (error: any) => console.error('Erreur chargement alertes:', error)
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

    // --- NOUVEAU : GESTION DES SLOTS DE MAINTENANCE ---

    loadMaintenanceSlots() {
        this.loadingSlots = true;
        this.mouvementService.getMouvements().subscribe({
            next: (data: any) => {
                // Filtrer uniquement les maintenances
                this.maintenanceSlots = data.filter((m: any) => m.type === 'maintenance');
                // Trier par date décroissante
                this.maintenanceSlots.sort((a: any, b: any) => new Date(b.dateDepart).getTime() - new Date(a.dateDepart).getTime());
                this.loadingSlots = false;
            },
            error: (err: any) => {
                console.error('Erreur chargement slots maintenance:', err);
                this.loadingSlots = false;
            }
        });
    }

    deleteSlot(slot: any) {
        if (confirm(`Confirmer la suppression de la maintenance "${slot.maintenanceType}" pour ${slot.vehicule?.immatriculation} ?`)) {
            this.mouvementService.deleteMouvement(slot._id).subscribe({
                next: () => {
                    alert('Maintenance supprimée.');
                    this.loadMaintenanceSlots(); // Recharger la liste
                },
                error: (err: any) => {
                    console.error('Erreur suppression maintenance:', err);
                    alert('Erreur lors de la suppression.');
                }
            });
        }
    }

    editSlot(slot: any) {
        this.router.navigate(['/modifier-mouvement', slot._id]);
    }
}
