import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
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
import { AuthService } from '../../core/services/auth.service';
import { ManualViewerComponent } from '../../shared/components/manual-viewer/manual-viewer';

interface ServiceSchedule {
    _id: string;
    vehicule: any;
    typeService: 'A' | 'B' | 'C' | string;
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
    _id?: string;
    numero?: string;
    categorie?: string;
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
        private authService: AuthService,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private router: Router,
        private location: Location
    ) { }

    ngOnInit() {
        // Get vehicle from current user or local storage
        const user = this.authService.getCurrentUser();
        const storedVehicle = localStorage.getItem('selectedVehicle');

        if (user && user.vehicule) {
            this.selectedVehicleId = typeof user.vehicule === 'object' ? user.vehicule._id : user.vehicule;
        } else if (storedVehicle) {
            try {
                const v = JSON.parse(storedVehicle);
                this.selectedVehicleId = v._id || v;
            } catch (e) {
                this.selectedVehicleId = storedVehicle;
            }
        }

        if (this.selectedVehicleId) {
            this.loadNextService();
            this.loadServiceHistory();
        } else {
            console.warn('No vehicle selected or assigned for scheduled service view.');
        }
    }

    goBack() {
        this.location.back();
    }

    loadNextService() {
        if (!this.selectedVehicleId) return;
        this.loading = true;
        this.maintenanceService.getNextService(this.selectedVehicleId).subscribe({
            next: (data) => {
                this.nextService = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading next service:', err);
                this.loading = false;
            }
        });
    }

    loadServiceHistory() {
        // Feature not yet available in frontend service, stubbing for now to prevent errors
        // or we could implement it if we add the method to MaintenanceService
        // For now, let's just log
        console.log('Service history loading not yet fully implemented in frontend service.');
        this.serviceHistory = [];
    }

    // --- Template Helpers ---

    getServiceTypeColor(): string {
        switch (this.nextService?.typeService) {
            case 'A': return '#4caf50'; // Green
            case 'B': return '#2196f3'; // Blue
            case 'C': return '#ff9800'; // Orange
            default: return '#757575'; // Grey
        }
    }

    getServiceTypeLabel(): string {
        if (!this.nextService) return '';
        switch (this.nextService.typeService) {
            case 'A': return 'Service A (Petit entretien)';
            case 'B': return 'Service B (Grand entretien)';
            case 'C': return 'Service C (Entretien majeur)';
            default: return 'Service inconnu';
        }
    }

    getStatusColor(): string {
        switch (this.nextService?.statut) {
            case 'À venir': return 'primary';
            case 'Dû': return 'accent'; // Yellow/Orange
            case 'En retard': return 'warn'; // Red
            case 'Complété': return 'primary'; // Greenish usually
            default: return '';
        }
    }

    getStatusIcon(): string {
        switch (this.nextService?.statut) {
            case 'À venir': return 'schedule';
            case 'Dû': return 'priority_high';
            case 'En retard': return 'warning';
            case 'Complété': return 'check_circle';
            default: return 'help';
        }
    }

    getKmRemaining(): number {
        if (!this.nextService) return 0;
        return Math.max(0, this.nextService.kilometragePrevu - this.nextService.kilometrageActuel);
    }

    getProgressPercentage(): number {
        if (!this.nextService) return 0;
        // Simple progress based on tasks completed
        const total = this.nextService.taches.length;
        if (total === 0) return 0;
        const validated = this.nextService.taches.filter(t => t.validee).length;
        return (validated / total) * 100;
    }

    getValidatedTasksCount(): number {
        return this.nextService?.taches.filter(t => t.validee).length || 0;
    }

    getTotalTasksCount(): number {
        return this.nextService?.taches.length || 0;
    }

    toggleTask(task: ServiceTask) {
        // ngModel a déjà mis à jour task.validee
        if (task.validee) {
            task.dateValidation = new Date();
        } else {
            task.dateValidation = undefined;
        }

        // Sauvegarder sur le backend
        if (this.nextService) {
            this.maintenanceService.updateServiceTasks(
                this.nextService._id,
                this.nextService.taches as any
            ).subscribe({
                next: () => {
                    console.log('✅ [SCHEDULED SERVICE] Task updated successfully');
                },
                error: (err) => {
                    console.error('❌ [SCHEDULED SERVICE] Error updating task:', err);
                    // Revert the change on error
                    task.validee = !task.validee;
                    task.dateValidation = undefined;
                }
            });
        }

        this.cdr.detectChanges();
    }

    completeService() {
        if (!this.nextService || !this.selectedVehicleId) return;

        if (!confirm('Confirmer que ce service a été effectué conformément aux recommandations constructeur ?')) {
            return;
        }

        console.log('✅ [SCHEDULED SERVICE] Completing service...');

        // TODO: Implémenter une vraie signature électronique
        const user = this.authService.getCurrentUser();
        const signature = 'Validé électroniquement par ' + (user ? user.nom : 'Utilisateur');

        this.maintenanceService.completeService(this.nextService._id, signature).subscribe({
            next: (result) => {
                console.log('✅ [SCHEDULED SERVICE] Service completed:', result);
                this.nextService = null; // Clear current service
                this.loadNextService(); // Reload to get the new one (next in sequence)
                this.loadServiceHistory(); // Update history
            },
            error: (error) => {
                console.error('❌ [SCHEDULED SERVICE] Error completing service:', error);
                alert('Erreur lors de la validation du service : ' + (error.error?.message || error.message));
            }
        });
    }

    openManual(numeroTache?: string) {
        if (!numeroTache) return;

        // Try to parse the task manual number as a page number
        let page = 1;

        // Extract first number from string (e.g. "Page 15" -> 15, "Ref 7" -> 7, "12" -> 12)
        const match = numeroTache.match(/(\d+)/);
        if (match) {
            const parsedPage = parseInt(match[0], 10);
            if (!isNaN(parsedPage) && parsedPage > 0) {
                page = parsedPage;
            }
        } else {
            // Fallback checking for known patterns or keeping default
            console.warn(`Manual Task Number '${numeroTache}' does not contain a valid page number. Defaulting to page 1.`);
        }

        // Always use manual.pdf for all services
        const pdfFile = 'manual.pdf';

        console.log('📖 Opening manual:', pdfFile, 'at page:', page);

        this.dialog.open(ManualViewerComponent, {
            width: '95vw',
            height: '95vh',
            maxWidth: '100vw',
            panelClass: 'full-screen-modal',
            data: { page: page, fileName: pdfFile }
        });
    }
}
