import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
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
    TranslateModule,
  ],
  templateUrl: './weekly-checklist.html',
  styleUrls: ['./weekly-checklist.scss'],
})
export class WeeklyChecklistComponent implements OnInit {
  private maintenanceService = inject(MaintenanceService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private location = inject(Location);

  checklist: WeeklyChecklist | null = null;
  loading = false;
  selectedVehicleId: string | null = null;

  // Grouper les tâches par catégorie
  tachesParCategorie: Record<string, Task[]> = {};
  categories: string[] = [];

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    // Récupérer l'ID du véhicule depuis localStorage
    this.selectedVehicleId = localStorage.getItem('selectedVehicleId');
    if (this.selectedVehicleId) {
      this.loadChecklist();
    } else {
      console.error('❌ [WEEKLY CHECKLIST] Aucun véhicule sélectionné dans localStorage');
    }
  }

  loadChecklist() {
    if (!this.selectedVehicleId) return;

    this.loading = true;
    this.maintenanceService.getCurrentWeeklyChecklist(this.selectedVehicleId).subscribe({
      next: (data) => {
        this.checklist = data;
        this.groupTasksByCategory();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('❌ [WEEKLY CHECKLIST] Erreur chargement checklist:', error);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  groupTasksByCategory() {
    if (!this.checklist) {
      return;
    }

    this.tachesParCategorie = {};
    this.checklist.taches.forEach((tache, index) => {
      if (!this.tachesParCategorie[tache.categorie]) {
        this.tachesParCategorie[tache.categorie] = [];
      }
      this.tachesParCategorie[tache.categorie].push(tache);
    });

    this.categories = Object.keys(this.tachesParCategorie);
  }

  toggleTask(tache: Task) {
    if (!this.checklist) return;

    // Note: La valeur de tache.validee est déjà mise à jour par le ngModel avant cet appel
    // Si l'utilisateur clique alors qu'elle était true, elle devient false.

    const newState = tache.validee;

    this.maintenanceService
      .validateTask(this.checklist._id, tache._id, newState, tache.commentaire)
      .subscribe({
        next: (updatedChecklist: WeeklyChecklist) => {
          // On met à jour sans écraser toute la checklist pour éviter des sauts d'UI
          // Mais pour la consistance on met à jour le taux
          this.checklist!.tauxCompletion = updatedChecklist.tauxCompletion;
          this.checklist!.completee = updatedChecklist.completee;

          // Mettre à jour la date de validation locale et le nom du validateur
          if (newState) {
            tache.dateValidation = new Date();
            const currentUser = this.authService.getCurrentUser();
            if (currentUser) {
              tache.validatorName = `${currentUser['prenom'] || ''} ${currentUser['nom'] || ''}`.trim();
            }
          } else {
            tache.dateValidation = undefined;
            tache.validatorName = undefined;
          }

          this.groupTasksByCategory();
        },
        error: (error: unknown) => {
          console.error('Erreur validation tâche:', error);
          // Revert en cas d'erreur
          tache.validee = !newState;
        },
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
      console.warn(
        `Manual Task Number '${numeroTache}' is not a valid page number. Defaulting to page 1.`,
      );
    }

    this.dialog.open(ManualViewerComponent, {
      width: '95vw',
      height: '95vh',
      maxWidth: '100vw',
      panelClass: 'full-screen-modal',
      data: { page: page },
    });
  }

  getCategoryIcon(categorie: string): string {
    const icons: Record<string, string> = {
      Détection: 'hearing',
      Moteur: 'settings',
      Pneus: 'album',
      Électricité: 'flash_on',
      Sécurité: 'security',
      Communication: 'wifi',
      Nettoyage: 'cleaning_services',
      Finalisation: 'check_circle',
    };
    return icons[categorie] || 'task';
  }

  getValidatedTasksCount(categorie: string): number {
    if (!this.tachesParCategorie[categorie]) return 0;
    return this.tachesParCategorie[categorie].filter((t) => t.validee).length;
  }

  getTotalValidatedTasks(): number {
    if (!this.checklist) return 0;
    return this.checklist.taches.filter((t) => t.validee).length;
  }

  getCategoryColor(categorie: string): string {
    const colors: Record<string, string> = {
      Détection: '#8b5cf6',
      Moteur: '#52ae32',
      Pneus: '#9c27b0',
      Électricité: '#ff9800',
      Sécurité: '#f44336',
      Communication: '#00bcd4',
      Nettoyage: '#795548',
      Finalisation: '#4caf50',
    };
    return colors[categorie] || '#666';
  }
}
