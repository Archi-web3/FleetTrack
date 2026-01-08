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
        private dialog: MatDialog,
        private router: Router,
        private location: Location
    ) { }

    goBack() {
        this.location.back();
    }

    // ... (existing code)

    toggleTask(task: ServiceTask) {
        // ngModel a déjà mis à jour task.validee
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
