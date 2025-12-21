import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Assurez-vous d'importer CommonModule
import { MouvementService } from '../mouvement.service'; // Assurez-vous d'importer MouvementService
import { AuthService } from '../auth.service'; // Assurez-vous d'importer AuthService

@Component({
  selector: 'app-validation-mouvements',
  standalone: true,
  imports: [CommonModule], // CommonModule est nécessaire pour *ngIf, *ngFor, et les pipes
  templateUrl: './validation-mouvements.component.html',
  styleUrls: ['./validation-mouvements.component.css']
})
export class ValidationMouvementsComponent implements OnInit {
  mouvementsPourValidationSecurite: any[] = [];
  mouvementsPourValidationLogistique: any[] = [];
  userProfile: string | null = null; // Initialisé à null pour correspondre au type de AuthService

  constructor(
    private mouvementService: MouvementService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Récupérer le profil de l'utilisateur au démarrage
    // Le profil peut être null si non connecté ou token invalide.
    this.userProfile = this.authService.getUserProfile();
    this.loadMouvementsPourValidation();
  }

  loadMouvementsPourValidation(): void {
    if (!this.userProfile) {
      // Si l'utilisateur n'est pas connecté ou son profil n'est pas disponible,
      // on ne charge pas les mouvements et on vide les listes.
      this.mouvementsPourValidationSecurite = [];
      this.mouvementsPourValidationLogistique = [];
      console.warn('Profil utilisateur non chargé. Impossible de filtrer les mouvements pour validation.');
      return;
    }

    this.mouvementService.getMouvements().subscribe(
      (data) => {
        // Logique de filtrage des mouvements en fonction du profil
        this.mouvementsPourValidationSecurite = []; // Réinitialiser pour chaque chargement
        this.mouvementsPourValidationLogistique = []; // Réinitialiser pour chaque chargement

        if (this.userProfile === 'SuperAdmin' || this.userProfile === 'Admin' || this.userProfile === 'Superviseur') {
          // Un SuperAdmin/Admin/Superviseur peut voir les mouvements qui attendent la sécurité
          // et ceux qui attendent la logistique (car il couvre les deux rôles pour la démo)
          this.mouvementsPourValidationSecurite = data.filter(m => m.statut === 'en attente validation sécurité');
          this.mouvementsPourValidationLogistique = data.filter(m => m.statut === 'en attente');
        }
        // Si nous avions un rôle 'CoordinateurTerrain' distinct, ce serait ici:
        // else if (this.userProfile === 'CoordinateurTerrain') {
        //   this.mouvementsPourValidationSecurite = data.filter(m => m.statut === 'en attente validation sécurité');
        // }


        console.log("Mouvements pour validation logistique chargés:", this.mouvementsPourValidationLogistique);
        console.log("Mouvements pour validation sécurité chargés:", this.mouvementsPourValidationSecurite);
      },
      (error) => console.error('Erreur chargement mouvements pour validation:', error)
    );
  }

  // --- MÉTHODE UTILITAIRE POUR DÉCODER LE TOKEN (présente dans AuthService maintenant) ---
  // private decodeToken(token: string): any {
  //     try {
  //         return JSON.parse(atob(token.split('.')[1]));
  //     } catch (e) {
  //         return null;
  //     }
  // }
  // >>> CE N'EST PLUS NÉCESSAIRE ICI CAR LE PROFIL VIENT DU AUTHSERVICE.

  // --- NOUVELLE MÉTHODE POUR DEMANDER LE MOTIF DE REFUS ---
  getMotifRefus(): string | null {
    return prompt('Motif de refus :');
  }

  validerMouvement(mouvementId: string, currentStatut: string): void {
    let nouveauStatut = 'validé'; // Statut par défaut après validation logistique

    // Si le mouvement est en attente de validation sécurité, le prochain statut est 'en attente' pour la logistique
    if (currentStatut === 'en attente validation sécurité') {
      nouveauStatut = 'en attente';
    }

    this.mouvementService.updateMouvement(mouvementId, { statut: nouveauStatut }).subscribe(
      (response) => {
        alert(`Mouvement ${nouveauStatut === 'validé' ? 'validé' : 'passé en attente logistique'} avec succès !`);
        this.loadMouvementsPourValidation(); // Recharger les listes après l'action
      },
      (error) => {
        console.error('Erreur validation mouvement:', error);
        if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à valider ce mouvement.');
        else alert('Erreur lors de la validation. Vérifiez la console.');
      }
    );
  }

  refuserMouvement(mouvementId: string): void {
    const motif = this.getMotifRefus(); // Appeler la nouvelle méthode ici
    if (!motif) {
      alert('Veuillez entrer un motif de refus.');
      return;
    }
    this.mouvementService.updateMouvement(mouvementId, { statut: 'refusé', motifRefus: motif }).subscribe(
      (response) => {
        alert('Mouvement refusé avec succès !');
        this.loadMouvementsPourValidation(); // Recharger les listes après l'action
      },
      (error) => {
        console.error('Erreur refus mouvement:', error);
        if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à refuser ce mouvement.');
        else alert('Erreur lors du refus. Vérifiez la console.');
      }
    );
  }
}
