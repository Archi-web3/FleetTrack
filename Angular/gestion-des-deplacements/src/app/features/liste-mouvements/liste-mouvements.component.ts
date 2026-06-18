import { Component, OnInit, OnDestroy } from '@angular/core';
import { MouvementService } from '../../core/services/mouvement.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MouvementDetailsDialogComponent } from './mouvement-details-dialog.component';
import { DemandeMouvementComponent } from '../demande-mouvement/demande-mouvement.component';
import { PermissionsService } from '../../core/services/permissions.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-liste-mouvements',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDialogModule, 
    TranslateModule
  ],
  templateUrl: './liste-mouvements.component.html',
  styleUrls: ['./liste-mouvements.component.css']
})
export class ListeMouvementsComponent implements OnInit, OnDestroy {
  mouvements: any[] = [];
  filteredMouvements: any[] = []; // Liste filtrée
  showCompleted: boolean = false; // Par défaut, masquer les mouvements terminés
  userId: string | null = null;
  userProfile: string | null = null;

  searchQuery: string = '';
  selectedVehicleId: string = '';
  uniqueVehicles: any[] = [];

  private routerSubscription: Subscription | undefined;

  constructor(
    private mouvementService: MouvementService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public perms: PermissionsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.userProfile = this.authService.getUserProfile();
    console.log("UserID connecté:", this.userId);
    console.log("UserProfile connecté:", this.userProfile);

    this.route.queryParams.subscribe(params => {
      if (params['vehicule']) {
        this.selectedVehicleId = params['vehicule'];
      }
      // Si on vient de recharger, la liste des mouvements est vide, ça sera filtré après.
      // Si on a déjà les mouvements, on applique le filtre :
      if (this.mouvements.length > 0) {
        this.applyFilter();
      }
    });

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
        this.extractUniqueVehicles();
        this.applyFilter(); // Appliquer le filtre après chargement
        console.log("Mouvements reçus et chargés dans le composant :", this.mouvements);
      },
      (error) => {
        console.error('Error fetching movements:', error);
      }
    );
  }

  extractUniqueVehicles() {
    const map = new Map();
    this.mouvements.forEach(m => {
      if (m.vehicule && m.vehicule._id) {
        map.set(m.vehicule._id, m.vehicule);
      }
    });
    this.uniqueVehicles = Array.from(map.values()).sort((a, b) => 
      a.immatriculation.localeCompare(b.immatriculation)
    );
  }

  applyFilter() {
    let list = this.mouvements;

    if (this.showCompleted) {
      // Historique complet : afficher SEULEMENT les mouvements terminés, annulés, refusés
      list = list.filter(
        m => m.statut === 'terminé' || m.statut === 'annulé' || m.statut === 'refusé'
      );
    } else {
      // Vue par défaut : mouvements actifs (en attente, validé, pris en charge, en cours)
      // Exclure terminés, annulés, refusés, regroupés
      list = list.filter(
        m => m.statut !== 'terminé' && m.statut !== 'annulé' && m.statut !== 'refusé' && m.statut !== 'regroupé' && m.type !== 'maintenance'
      );
    }

    // Filtre Vehicule
    if (this.selectedVehicleId) {
      list = list.filter(m => m.vehicule && m.vehicule._id === this.selectedVehicleId);
    }

    // Filtre Recherche textuelle
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(m => {
        const obj = m.objectif ? m.objectif.toLowerCase() : '';
        const id = m._id ? m._id.toLowerCase() : '';
        const chauf = m.chauffeur ? (m.chauffeur.nom + ' ' + m.chauffeur.prenom).toLowerCase() : '';
        const depart = m.lieuDepart ? m.lieuDepart.nom.toLowerCase() : '';
        const arrivee = m.lieuArrivee ? m.lieuArrivee.nom.toLowerCase() : '';
        return obj.includes(q) || id.includes(q) || chauf.includes(q) || depart.includes(q) || arrivee.includes(q);
      });
    }

    this.filteredMouvements = list;
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
