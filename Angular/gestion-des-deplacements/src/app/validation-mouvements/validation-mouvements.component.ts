import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Assurez-vous d'importer CommonModule
import { MouvementService } from '../mouvement.service'; // Assurez-vous d'importer MouvementService
import { AuthService } from '../auth.service'; // Assurez-vous d'importer AuthService
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-validation-mouvements',
  standalone: true,
  imports: [CommonModule, TranslateModule], // CommonModule est nécessaire pour *ngIf, *ngFor, et les pipes
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
    console.log('🔍 [VALIDATION] Chargement des mouvements pour validation...');
    console.log('🔍 [VALIDATION] Profil utilisateur:', this.userProfile);

    if (!this.userProfile) {
      // Si l'utilisateur n'est pas connecté ou son profil n'est pas disponible,
      // on ne charge pas les mouvements et on vide les listes.
      this.mouvementsPourValidationSecurite = [];
      this.mouvementsPourValidationLogistique = [];
      console.warn('⚠️ [VALIDATION] Profil utilisateur non chargé. Impossible de filtrer les mouvements pour validation.');
      return;
    }

    this.mouvementService.getMouvements().subscribe(
      (data) => {
        console.log('📦 [VALIDATION] Tous les mouvements récupérés du backend:', data.length, 'mouvements');
        console.log('📦 [VALIDATION] Détails des mouvements:', data);

        // Afficher les statuts de tous les mouvements
        const statutsCount: any = {};
        data.forEach((m: any) => {
          statutsCount[m.statut] = (statutsCount[m.statut] || 0) + 1;
        });
        console.log('📊 [VALIDATION] Répartition par statut:', statutsCount);

        // Logique de filtrage des mouvements en fonction du profil
        this.mouvementsPourValidationSecurite = []; // Réinitialiser pour chaque chargement
        this.mouvementsPourValidationLogistique = []; // Réinitialiser pour chaque chargement

        if (this.userProfile === 'SuperAdmin' || this.userProfile === 'Admin') {
          // SuperAdmin/Admin voit TOUT
          this.mouvementsPourValidationSecurite = data.filter(m => m.statut === 'en attente validation sécurité');
          this.mouvementsPourValidationLogistique = data.filter(m => m.statut === 'en attente');
        } else if (this.userProfile === 'Superviseur Sécurité') {
          // Superviseur Sécurité voit SEULEMENT la sécurité
          this.mouvementsPourValidationSecurite = data.filter(m => m.statut === 'en attente validation sécurité');
        } else if (this.userProfile === 'Superviseur') {
          // Superviseur (classique) voit SEULEMENT la logistique
          this.mouvementsPourValidationLogistique = data.filter(m => m.statut === 'en attente');
        } else {
          console.log('⚠️ [VALIDATION] Profil non autorisé pour la validation:', this.userProfile);
        }

        console.log('✅ [VALIDATION] Mouvements pour validation sécurité:', this.mouvementsPourValidationSecurite.length);
        console.log('✅ [VALIDATION] Mouvements pour validation logistique:', this.mouvementsPourValidationLogistique.length);
        // Si nous avions un rôle 'CoordinateurTerrain' distinct, ce serait ici:
        // else if (this.userProfile === 'CoordinateurTerrain') {
        //   this.mouvementsPourValidationSecurite = data.filter(m => m.statut === 'en attente validation sécurité');
        // }

        if (this.mouvementsPourValidationLogistique.length === 0 && this.mouvementsPourValidationSecurite.length === 0) {
          console.log('ℹ️ [VALIDATION] Aucun mouvement à valider trouvé.');
        }

        console.log("📋 [VALIDATION] Mouvements pour validation logistique:", this.mouvementsPourValidationLogistique);
        console.log("📋 [VALIDATION] Mouvements pour validation sécurité:", this.mouvementsPourValidationSecurite);
      },
      (error) => console.error('❌ [VALIDATION] Erreur chargement mouvements pour validation:', error)
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

    // CAS 1 : Validation SÉCURITÉ (Module 2)
    if (currentStatut === 'en attente validation sécurité') {
      console.log('🛡️ [VALIDATION] Tentative de validation sécurisée...');
      this.mouvementService.validateMouvement(mouvementId).subscribe(
        (response) => {
          alert('Validation de sécurité effectuée avec succès ! Le mouvement est maintenant en attente logistique.');
          this.loadMouvementsPourValidation();
        },
        (error) => {
          console.error('Erreur validation sécurité:', error);
          if (error.status === 403) {
            alert('⛔ REFUSÉ : ' + (error.error?.message || 'Votre niveau de validation est insuffisant pour ce trajet à risque.'));
          } else {
            alert('Erreur lors de la validation sécurité. Vérifiez la console.');
          }
        }
      );
    }
    // CAS 2 : Validation LOGISTIQUE (Classique)
    else {
      const nouveauStatut = 'validé';
      this.mouvementService.updateMouvement(mouvementId, { statut: nouveauStatut }).subscribe(
        (response) => {
          alert(`Mouvement validé logistiquement avec succès !`);
          this.loadMouvementsPourValidation();
        },
        (error) => {
          console.error('Erreur validation logistique:', error);
          alert('Erreur lors de la validation. Vérifiez la console.');
        }
      );
    }
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
  // NOUVEAU: Vérifier si l'utilisateur connecté a déjà validé ce mouvement (dans la matrice)
  hasUserValidated(mouvement: any): boolean {
    if (!mouvement.securityApprovals || mouvement.securityApprovals.length === 0) return false;

    // Updated to use the public accessor from AuthService
    const userId = this.authService.getUserId();
    if (!userId) return false;

    const approval = mouvement.securityApprovals.find((a: any) =>
      (a.validator._id || a.validator) === userId // Gérer si populated ou non
    );

    return approval && approval.status === 'approved';
  }
}
