import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MaintenanceService, WeeklyChecklist, Task } from '../../core/services/maintenance.service';
import { ManualViewerComponent } from '../../shared/components/manual-viewer/manual-viewer';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-weekly-checklist',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatTooltipModule,
        MatDialogModule,
        TranslateModule
    ],
    templateUrl: './weekly-checklist.html',
    styleUrls: ['./weekly-checklist.scss']
})
export class WeeklyChecklistComponent implements OnInit {
    checklist: WeeklyChecklist | null = null;
    loading = false;
    selectedVehicleId: string | null = null;

    // Grouper les tâches par catégorie
    tachesParCategorie: { [key: string]: Task[] } = {};
    categories: string[] = [];

    constructor(
        private maintenanceService: MaintenanceService,
        private authService: AuthService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private router: Router,
        private location: Location
    ) { }

    goBack() {
        this.location.back();
    }

    ngOnInit() {
        console.log('🔍 [WEEKLY CHECKLIST] Component initialized');
        // Récupérer l'ID du véhicule depuis localStorage
        this.selectedVehicleId = localStorage.getItem('selectedVehicleId');
        console.log('🔍 [WEEKLY CHECKLIST] selectedVehicleId from localStorage:', this.selectedVehicleId);

        if (this.selectedVehicleId) {
            console.log('✅ [WEEKLY CHECKLIST] Vehicle ID found, loading checklist...');
            this.loadChecklist();
        } else {
            console.error('❌ [WEEKLY CHECKLIST] Aucun véhicule sélectionné dans localStorage');
        }
    }

    loadChecklist() {
        if (!this.selectedVehicleId) return;

        console.log('📡 [WEEKLY CHECKLIST] Calling API with vehicleId:', this.selectedVehicleId);
        this.loading = true;
        this.maintenanceService.getCurrentWeeklyChecklist(this.selectedVehicleId).subscribe({
            next: (data) => {
                console.log('✅ [WEEKLY CHECKLIST] Data received:', data);
                this.checklist = data;
                this.groupTasksByCategory();
                this.loading = false;
                console.log('🎬 [WEEKLY CHECKLIST] Loading set to false, checklist:', this.checklist ? 'EXISTS' : 'NULL');
                console.log('🎬 [WEEKLY CHECKLIST] Categories count:', this.categories.length);
                console.log('🔄 [WEEKLY CHECKLIST] Forcing change detection...');
                this.cdr.detectChanges();
                console.log('✅ [WEEKLY CHECKLIST] Change detection triggered!');
            },
            error: (error) => {
                console.error('❌ [WEEKLY CHECKLIST] Erreur chargement checklist:', error);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    groupTasksByCategory() {
        console.log('📂 [GROUP TASKS] Starting grouping...');
        if (!this.checklist) {
            console.log('❌ [GROUP TASKS] No checklist');
            return;
        }

        console.log('📂 [GROUP TASKS] Checklist has', this.checklist.taches.length, 'tasks');
        this.tachesParCategorie = {};
        this.checklist.taches.forEach((tache, index) => {
            console.log(`📂 [GROUP TASKS] Task ${index}:`, tache.categorie, '-', tache.description);
            if (!this.tachesParCategorie[tache.categorie]) {
                this.tachesParCategorie[tache.categorie] = [];
            }
            this.tachesParCategorie[tache.categorie].push(tache);
        });

        this.categories = Object.keys(this.tachesParCategorie);
        console.log('📂 [GROUP TASKS] Categories:', this.categories);
        console.log('📂 [GROUP TASKS] Tasks by category:', this.tachesParCategorie);
    }

    toggleTask(tache: Task) {
        if (!this.checklist) return;

        // Note: La valeur de tache.validee est déjà mise à jour par le ngModel avant cet appel
        // Si l'utilisateur clique alors qu'elle était true, elle devient false.

        const newState = tache.validee;

        this.maintenanceService.validateTask(
            this.checklist._id,
            tache._id,
            newState,
            tache.commentaire
        ).subscribe({
            next: (updatedChecklist) => {
                // On met à jour sans écraser toute la checklist pour éviter des sauts d'UI
                // Mais pour la consistance on met à jour le taux
                this.checklist!.tauxCompletion = updatedChecklist.tauxCompletion;
                this.checklist!.completee = updatedChecklist.completee;

                // Mettre à jour la date de validation locale et le nom du validateur
                if (newState) {
                    tache.dateValidation = new Date();
                    const currentUser = this.authService.getCurrentUser();
                    if (currentUser) {
                        tache.validatorName = `${currentUser.prenom} ${currentUser.nom}`;
                    }
                } else {
                    tache.dateValidation = undefined;
                    tache.validatorName = undefined;
                }

                this.groupTasksByCategory();
            },
            error: (error) => {
                console.error('Erreur validation tâche:', error);
                // Revert en cas d'erreur
                tache.validee = !newState;
            }
        });
    }

    openManual(numeroTache: string) {
        if (!numeroTache) return;

        // Try to parse the task manual number as a page number
        let page = 1;

        // If the manual number is simple (e.g., "7", "12"), use it directly
        const parsedPage = parseInt(numeroTache, 10);
        if (!isNaN(parsedPage) && parsedPage > 0) {
            page = parsedPage;
        } else {
            // Fallback checking for known patterns or keeping default
            console.warn(`Manual Task Number '${numeroTache}' is not a valid page number. Defaulting to page 1.`);
        }

        this.dialog.open(ManualViewerComponent, {
            width: '95vw',
            height: '95vh',
            maxWidth: '100vw',
            panelClass: 'full-screen-modal',
            data: { page: page }
        });
    }

    getCategoryIcon(categorie: string): string {
        const icons: { [key: string]: string } = {
            'Détection': 'hearing',
            'Moteur': 'settings',
            'Pneus': 'album',
            'Électricité': 'flash_on',
            'Sécurité': 'security',
            'Communication': 'wifi',
            'Nettoyage': 'cleaning_services',
            'Finalisation': 'check_circle'
        };
        return icons[categorie] || 'task';
    }

    getValidatedTasksCount(categorie: string): number {
        if (!this.tachesParCategorie[categorie]) return 0;
        return this.tachesParCategorie[categorie].filter(t => t.validee).length;
    }

    getTotalValidatedTasks(): number {
        if (!this.checklist) return 0;
        return this.checklist.taches.filter(t => t.validee).length;
    }

    getCategoryColor(categorie: string): string {
        const colors: { [key: string]: string } = {
            'Détection': '#005fb6',
            'Moteur': '#52ae32',
            'Pneus': '#9c27b0',
            'Électricité': '#ff9800',
            'Sécurité': '#f44336',
            'Communication': '#00bcd4',
            'Nettoyage': '#795548',
            'Finalisation': '#4caf50'
        };
        return colors[categorie] || '#666';
    }
}
