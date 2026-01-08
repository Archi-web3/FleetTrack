import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
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
        MatDialogModule
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
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef
    ) { }

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

        const newState = !tache.validee;

        this.maintenanceService.validateTask(
            this.checklist._id,
            tache._id,
            newState,
            tache.commentaire
        ).subscribe({
            next: (updatedChecklist) => {
                this.checklist = updatedChecklist;
                this.groupTasksByCategory();
            },
            error: (error) => {
                console.error('Erreur validation tâche:', error);
            }
        });
    }

    openManual(numeroTache: string) {
        // TODO: Ouvrir le viewer PDF à la page correspondante
        console.log('Ouvrir manuel à la tâche:', numeroTache);
        // Implémenter le viewer PDF dans une prochaine étape
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
