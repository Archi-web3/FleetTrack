import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { ManualViewerComponent } from '../../shared/components/manual-viewer/manual-viewer';

interface ServiceSchedule {
    _id: string;
    vehicule: any;
    typeService: 'A' | 'B' | 'C';
    kilometragePrevu: number;
    kilometrageActuel: number;
    statut: 'À venir' | 'Dû' | 'En retard' | 'Complété';
    dateAlerte?: Date;
    taches: ServiceTask[];
    dateCreation: Date;
    dateCompletion?: Date;
    prochainService?: {
        type: 'A' | 'B' | 'C';
        kilometrage: number;
    };
}

interface ServiceTask {
    description: string;
    numeroTacheManuel?: string;
    validee: boolean;
    dateValidation?: Date;
    mecanicien?: any;
    commentaire?: string;
}

@Component({
    selector: 'app-scheduled-service',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatChipsModule,
        MatTabsModule
    ],
    templateUrl: './scheduled-service.html',
    styleUrls: ['./scheduled-service.scss']
})
export class ScheduledServiceComponent implements OnInit {
    nextService: ServiceSchedule | null = null;
    serviceHistory: ServiceSchedule[] = [];
    loading = false;
    selectedVehicleId: string | null = null;

    constructor(
        private maintenanceService: MaintenanceService,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        console.log('🔧 [SCHEDULED SERVICE] Component initialized');
        this.selectedVehicleId = localStorage.getItem('selectedVehicleId');
        console.log('🔧 [SCHEDULED SERVICE] Vehicle ID:', this.selectedVehicleId);

        if (this.selectedVehicleId) {
            this.loadNextService();
            this.loadServiceHistory();
        } else {
            console.error('❌ [SCHEDULED SERVICE] No vehicle selected');
        }
    }

    loadNextService() {
        if (!this.selectedVehicleId) return;

        console.log('📡 [SCHEDULED SERVICE] Loading next service...');
        this.loading = true;

        this.maintenanceService.getNextService(this.selectedVehicleId).subscribe({
            next: (service) => {
                console.log('✅ [SCHEDULED SERVICE] Next service received:', service);
                this.nextService = service;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('❌ [SCHEDULED SERVICE] Error loading next service:', error);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadServiceHistory() {
        if (!this.selectedVehicleId) return;

        console.log('📡 [SCHEDULED SERVICE] Loading service history...');

        // TODO: Implémenter route history dans le service
        // this.maintenanceService.getServiceHistory(this.selectedVehicleId).subscribe({
        //   next: (history) => {
        //     this.serviceHistory = history;
        //     this.cdr.detectChanges();
        //   },
        //   error: (error) => {
        //     console.error('Error loading history:', error);
        //   }
        // });
    }

    getKmRemaining(): number {
        if (!this.nextService) return 0;
        return Math.max(0, this.nextService.kilometragePrevu - this.nextService.kilometrageActuel);
    }

    getProgressPercentage(): number {
        if (!this.nextService) return 0;
        const total = this.nextService.kilometragePrevu;
        const current = this.nextService.kilometrageActuel;
        return Math.min(100, (current / total) * 100);
    }

    getStatusColor(): string {
        if (!this.nextService) return 'primary';

        const kmRemaining = this.getKmRemaining();
        if (kmRemaining > 500) return 'primary';
        if (kmRemaining > 0) return 'accent';
        return 'warn';
    }

    getStatusIcon(): string {
        if (!this.nextService) return 'build';

        const kmRemaining = this.getKmRemaining();
        if (kmRemaining > 500) return 'check_circle';
        if (kmRemaining > 0) return 'warning';
        return 'error';
    }

    getServiceTypeLabel(): string {
        if (!this.nextService) return '';

        const labels = {
            'A': 'Service A - Léger',
            'B': 'Service B - Moyen',
            'C': 'Service C - Complet'
        };
        return labels[this.nextService.typeService] || '';
    }

    getServiceTypeColor(): string {
        if (!this.nextService) return '';

        const colors = {
            'A': '#4CAF50',
            'B': '#FF9800',
            'C': '#F44336'
        };
        return colors[this.nextService.typeService] || '#757575';
    }

    getValidatedTasksCount(): number {
        if (!this.nextService) return 0;
        return this.nextService.taches.filter(t => t.validee).length;
    }

    getTotalTasksCount(): number {
        if (!this.nextService) return 0;
        return this.nextService.taches.length;
    }

    toggleTask(task: ServiceTask) {
        task.validee = !task.validee;
        if (task.validee) {
            task.dateValidation = new Date();
        } else {
            task.dateValidation = undefined;
        }
        // TODO: Sauvegarder sur le backend
        this.cdr.detectChanges();
    }

    completeService() {
        if (!this.nextService || !this.selectedVehicleId) return;

        if (!confirm('Confirmer que ce service a été effectué conformément aux recommandations constructeur ?')) {
            return;
        }

        console.log('✅ [SCHEDULED SERVICE] Completing service...');

        // TODO: Implémenter une vraie signature électronique
        const signature = 'Validé électroniquement par ' + (localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!).nom : 'Utilisateur');

        this.maintenanceService.completeService(this.nextService._id, signature).subscribe({
            next: (result) => {
                console.log('✅ [SCHEDULED SERVICE] Service completed:', result);
                this.nextService = null; // Clear current service
                this.loadNextService(); // Reload to get the new one (next in sequence)
                this.loadServiceHistory(); // Update history
            },
            error: (error) => {
                console.error('❌ [SCHEDULED SERVICE] Error completing service:', error);
                console.error('❌ [SCHEDULEED SERVICE] Error completing service:', error);
                alert('Erreur lors de la validation du service : ' + (error.error?.message || error.message));
            }
        });
    }

    openManual(numeroTache?: string) {
        if (!numeroTache) return;

        // Logique de mapping tâche -> page
        const page = 1;

        this.dialog.open(ManualViewerComponent, {
            width: '95vw',
            height: '95vh',
            maxWidth: '100vw',
            panelClass: 'full-screen-modal',
            data: { page: page }
        });
    }
}
