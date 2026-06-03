import { Component, OnInit, OnDestroy } from '@angular/core';
import { MouvementService } from '../mouvement.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MouvementDetailsDialogComponent } from './mouvement-details-dialog.component';
import { DemandeMouvementComponent } from '../demande-mouvement/demande-mouvement.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-liste-mouvements',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, TranslateModule], // <<< AJOUT MatButtonModule
  templateUrl: './liste-mouvements.component.html',
  styleUrls: ['./liste-mouvements.component.css']
})
export class ListeMouvementsComponent implements OnInit, OnDestroy {
  mouvements: any[] = [];
  filteredMouvements: any[] = []; // Liste filtrée
  showCompleted: boolean = false; // Par défaut, masquer les mouvements terminés
  userId: string | null = null;
  userProfile: string | null = null;

  private routerSubscription: Subscription | undefined;

  constructor(
    private mouvementService: MouvementService,
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.userProfile = this.authService.getUserProfile();
    console.log("UserID connecté:", this.userId);
    console.log("UserProfile connecté:", this.userProfile);

    this.getMouvements();

    // NOUVEAU : S'abonner aux événements de navigation pour recharger les données
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Recharger les mouvements chaque fois que la navigation se termine
      // (utile si l'on revient sur cette page après une modification ailleurs)
      this.getMouvements();
    });
  }

  ngOnDestroy(): void { // <<< NOUVEAU : Pour nettoyer l'abonnement
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  getMouvements() {
    this.mouvementService.getMouvements().subscribe(
      (data) => {
        this.mouvements = data;
        this.applyFilter(); // Appliquer le filtre après chargement
        console.log("Mouvements reçus et chargés dans le composant :", this.mouvements);
      },
      (error) => {
        console.error('Error fetching movements:', error);
      }
    );
  }

  applyFilter() {
    if (this.showCompleted) {
      // Historique complet : afficher SEULEMENT les mouvements terminés, annulés, refusés
      this.filteredMouvements = this.mouvements.filter(
        m => m.statut === 'terminé' || m.statut === 'annulé' || m.statut === 'refusé'
      );
    } else {
      // Vue par défaut : mouvements actifs (en attente, validé, pris en charge, en cours)
      // Exclure terminés, annulés, refusés, regroupés
      this.filteredMouvements = this.mouvements.filter(
        m => m.statut !== 'terminé' && m.statut !== 'annulé' && m.statut !== 'refusé' && m.statut !== 'regroupé' && m.type !== 'maintenance'
      );
    }
  }

  toggleCompleted() {
    this.showCompleted = !this.showCompleted;
    this.applyFilter();
  }

  deleteMouvement(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce mouvement ?')) {
      this.mouvementService.deleteMouvement(id).subscribe(
        (response) => {
          console.log('Mouvement supprimé avec succès', response);
          alert('Mouvement supprimé avec succès.');
          this.getMouvements(); // Recharger la liste après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression du mouvement', error);
          if (error.status === 403) {
            alert('Accès refusé. Vous n\'êtes pas autorisé à supprimer ce mouvement.');
          } else {
            alert('Erreur lors de la suppression. Vérifiez la console.');
          }
        }
      );
    }
  }

  viewMouvement(mouvement: any): void {
    this.dialog.open(MouvementDetailsDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: { mouvement }
    });
  }

  openNouvelleDemande(): void {
    const dialogRef = this.dialog.open(DemandeMouvementComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getMouvements();
      }
    });
  }

  getStatusKey(status: string): string {
    if (!status) return '';
    const s = status.toLowerCase();
    switch (s) {
      case 'validé': return 'PLANNING.STATUS.VALIDATED';
      case 'en attente': return 'PLANNING.STATUS.PENDING';
      case 'terminé': return 'PLANNING.STATUS.COMPLETED';
      case 'annulé': return 'PLANNING.STATUS.CANCELLED';
      case 'refusé': return 'PLANNING.STATUS.CANCELLED';
      case 'en cours': return 'PLANNING.STATUS.IN_PROGRESS';
      case 'pris en charge': return 'PLANNING.STATUS.TAKEN';
      default: return status;
    }
  }

  navigateToEdit(id: string): void {
    console.log('🔄 [liste-mouvements] Navigating to edit:', id);
    this.router.navigate(['/modifier-mouvement', id]);
  }

  completeMouvement(mouvement: any): void {
    if (confirm(`Confirmer que le voyage "${mouvement.objectif}" a bien été effectué ?\nCela clôturera le mouvement.`)) {
      this.mouvementService.updateMouvement(mouvement._id, { statut: 'terminé' }).subscribe({
        next: () => {
          alert('Voyage confirmé et terminé !');
          this.getMouvements();
        },
        error: (err) => {
          console.error('Erreur clôture mouvement:', err);
          alert('Erreur lors de la clôture du mouvement.');
        }
      });
    }
  }
}
