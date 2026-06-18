import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UtilisateurService } from '../../core/services/utilisateur.service';
import { AuthService } from '../../core/services/auth.service';
import { AdminService } from '../../core/services/admin.service';
import { ProjetService } from '../../core/services/projet.service';
import { PermissionsService } from '../../core/services/permissions.service';

// Imports Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InfoBannerComponent } from '../../core/info-banner/info-banner';

@Component({
  selector: 'app-gestion-utilisateurs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    TranslateModule,
    InfoBannerComponent
  ],
  templateUrl: './gestion-utilisateurs.component.html',
  styleUrls: ['./gestion-utilisateurs.component.css']
})
export class GestionUtilisateursComponent implements OnInit {
  @ViewChild('userFormDialog') userFormDialog!: TemplateRef<any>;
  
  utilisateurs: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['nom', 'profil', 'base', 'security', 'actions'];
  newUser: any = {
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    profil: 'Technicien',
    telephone: '',
    pays: '',
    base: '',
    // Champs chauffeur
    permis: '',
    disponible: true,
    formationEcoConduite: {
      effectuee: false,
      date: null
    },
    vehiculeAttitre: '',
    projet: 'Support',
    numeroEmploye: '',
    niveauValidationSecu: 1
  };
  selectedUser: any = null; // Pour la modification
  profiles: string[] = []; // Profils dynamiques

  securityLevels = [1, 2, 3, 4, 5]; // Niveaux de validation sécurité
  userProfile: string | null = null;
  userPaysId: string | null = null;
  bases: any[] = []; // Liste des bases
  paysList: any[] = []; // Liste des pays (pour SuperAdmin)
  vehicules: any[] = []; // Liste des véhicules
  projets: any[] = []; // Liste des projets (chargée dynamiquement)

  selectedPays: string = ''; // Pays sélectionné par SuperAdmin
  selectedProfileFilter: string = ''; // Filtre par profil
  
  viewMode: 'list' | 'bubble' = 'list'; // Mode d'affichage: 'list' (tableau) ou 'bubble' (cartes)

  constructor(
    private utilisateurService: UtilisateurService,
    public authService: AuthService,
    private adminService: AdminService,
    private projetService: ProjetService,
    public perms: PermissionsService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    this.userPaysId = this.authService.getUserPaysId();

    // Adapter les profils disponibles
    const allProfiles = Object.keys(this.perms.getMatrix());
    if (this.userProfile === 'SuperAdmin') {
      this.profiles = allProfiles;
      this.loadPays();
      // On ne charge pas les bases tout de suite, on attend la sélection du pays
    } else if (this.userProfile === 'Admin') {
      this.profiles = allProfiles.filter(p => p !== 'SuperAdmin' && p !== 'Admin'); // Admin ne crée pas d'autres Admins
      this.newUser.pays = this.userPaysId; // Force le pays
      this.loadBases(this.userPaysId!);
    } else {
      // Autres profils limités
      this.profiles = [];
    }

    this.loadVehicules();
    this.loadProjets(); // Charger les projets dynamiquement
    this.loadUtilisateurs();
  }

  getProfileLabel(profile: string): string {
    if (!profile) return '';
    const translationKey = 'PROFILES.' + profile;
    const translated = this.translate.instant(translationKey);
    // Si la traduction n'existe pas, ngx-translate retourne la clé
    return translated === translationKey ? profile : translated;
  }

  openUserModal(user?: any) {
    if (user) {
      this.selectUser(user);
    } else {
      this.selectedUser = null;
    }
    this.dialog.open(this.userFormDialog, {
      width: '600px',
      disableClose: true
    });
  }

  closeUserModal() {
    this.dialog.closeAll();
    this.selectedUser = null;
  }

  setViewMode(mode: 'list' | 'bubble') {
    this.viewMode = mode;
  }

  loadPays() {
    this.adminService.getPays().subscribe(data => this.paysList = data);
  }

  loadBases(paysId?: string) {
    this.adminService.getBases(paysId).subscribe(
      data => {
        this.bases = data;
      },
      error => console.error('Erreur chargement bases:', error)
    );
  }

  // Appelé quand le SuperAdmin change le pays dans le form
  onPaysChange(paysId: string) {
    this.newUser.pays = paysId; // Assigner le pays sélectionné
    this.newUser.base = ''; // Reset base selection
    this.loadBases(paysId);
  }

  loadVehicules(): void {
    // Charger la liste des véhicules via le service approprié
    // Pour l'instant, on peut utiliser un service générique ou créer un VehiculeService
    this.adminService.getVehicules().subscribe(
      (data) => this.vehicules = data,
      (error) => console.error('Erreur chargement véhicules:', error)
    );
  }

  loadProjets(): void {
    // Charger la liste des projets actifs
    this.projetService.getProjets(false).subscribe(
      (data) => {
        this.projets = data;
        console.log('Projets chargés:', this.projets);
      },
      (error) => console.error('Erreur chargement projets:', error)
    );
  }


  onProfilChange(): void {
    // Réinitialiser les champs chauffeur si on change de profil
    if (this.newUser.profil !== 'Chauffeur') {
      this.newUser.permis = '';
      this.newUser.formationEcoConduite = { effectuee: false, date: null };
      this.newUser.vehiculeAttitre = '';
      this.newUser.disponible = true;
    }
    
    if (this.newUser.autoManageSecurity !== false) {
      this.newUser.niveauValidationSecu = this.perms.getMaxSecurityLevelForProfile(this.newUser.profil);
    }
  }

  onEditProfilChange(): void {
    if (this.selectedUser.autoManageSecurity) {
      this.selectedUser.niveauValidationSecu = this.perms.getMaxSecurityLevelForProfile(this.selectedUser.profil);
    }
  }

  onAutoManageNewSecurityChange(): void {
    if (this.newUser.autoManageSecurity !== false) {
      this.newUser.niveauValidationSecu = this.perms.getMaxSecurityLevelForProfile(this.newUser.profil);
    }
  }

  onAutoManageEditSecurityChange(): void {
    if (this.selectedUser.autoManageSecurity) {
      this.selectedUser.niveauValidationSecu = this.perms.getMaxSecurityLevelForProfile(this.selectedUser.profil);
    }
  }

  filterByProfile(): void {
    if (!this.selectedProfileFilter) {
      this.dataSource.data = [...this.utilisateurs];
    } else {
      this.dataSource.data = this.utilisateurs.filter(
        u => u.profil === this.selectedProfileFilter
      );
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadUtilisateurs(): void {
    this.utilisateurService.getUtilisateurs().subscribe(
      (data) => {
        this.utilisateurs = data;
        this.dataSource.data = [...data];
      },
      (error) => console.error('Erreur chargement utilisateurs:', error)
    );
  }

  addUser(): void {
    // Nettoyer les données avant envoi : convertir les chaînes vides en null pour les ObjectId
    const userData = { ...this.newUser };
    if (userData.pays === '') userData.pays = null;
    if (userData.base === '') userData.base = null;
    if (userData.vehiculeAttitre === '') userData.vehiculeAttitre = null;

    // Force security level calculation if auto-manage is checked
    if (userData.autoManageSecurity !== false) {
      userData.niveauValidationSecu = this.perms.getMaxSecurityLevelForProfile(userData.profil);
    }

    console.log('Données envoyées au serveur:', userData); // DEBUG
    this.utilisateurService.addUser(userData).subscribe(
      (response) => {
        alert('Utilisateur créé avec succès !');
        // Reset form, keeping context if Admin
        const currentPays = this.userProfile === 'Admin' ? this.userPaysId : '';
        const currentBase = this.userProfile === 'Admin' ? this.newUser.base : '';
        this.newUser = {
          nom: '',
          prenom: '',
          email: '',
          motDePasse: '',
          profil: 'Technicien',
          telephone: '',
          pays: currentPays,
          base: currentBase,
          // Champs chauffeur
          permis: '',
          disponible: true,
          formationEcoConduite: {
            effectuee: false,
            date: null
          },
          vehiculeAttitre: '',
          projet: 'Support',
          numeroEmploye: '',
          niveauValidationSecu: 1,
          autoManageSecurity: true
        };
        if (this.userProfile === 'Admin') {
          this.loadBases(this.userPaysId!);
        }
        this.loadUtilisateurs();
        this.closeUserModal();
      },
      (error) => {
        console.error('Erreur création utilisateur:', error);
        console.error('Détails erreur:', error.error); // DEBUG
        if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à créer des utilisateurs.');
        else alert('Erreur lors de la création de l\'utilisateur: ' + (error.error?.message || error.message));
      }
    );
  }

  selectUser(user: any): void {
    this.selectedUser = { ...user, motDePasse: '' }; // Copie l'utilisateur pour modification
    if (this.selectedUser.autoManageSecurity === undefined) {
      this.selectedUser.autoManageSecurity = true; // Par défaut pour les anciens utilisateurs
    }

    // Si base est un objet peuplé, on garde juste l'ID pour le select
    if (this.selectedUser.base && this.selectedUser.base._id) {
      this.selectedUser.base = this.selectedUser.base._id;
    }

    // Si pays est un objet peuplé, extraire l'ID
    let paysId = this.selectedUser.pays;
    if (this.selectedUser.pays && this.selectedUser.pays._id) {
      paysId = this.selectedUser.pays._id;
      this.selectedUser.pays = paysId; // Garder l'ID pour le select
    }

    // Charger les bases pour ce pays (pour SuperAdmin et Admin)
    if (paysId) {
      this.loadBases(paysId);
    } else if (this.userProfile === 'Admin' && this.userPaysId) {
      // Si pas de pays défini mais Admin, charger les bases de son pays
      this.loadBases(this.userPaysId);
    }

    // Auto-calculate security level on open if checked
    if (this.selectedUser.autoManageSecurity) {
      this.selectedUser.niveauValidationSecu = this.perms.getMaxSecurityLevelForProfile(this.selectedUser.profil);
    }
  }

  // Appelé quand le SuperAdmin change le pays dans le formulaire d'édition
  onEditPaysChange(paysId: string) {
    if (this.selectedUser) {
      this.selectedUser.pays = paysId;
      this.selectedUser.base = ''; // Reset base selection
      this.loadBases(paysId);
    }
  }

  updateUser(): void {
    if (!this.selectedUser) return;

    // Nettoyer l'objet avant envoi
    const userData = { ...this.selectedUser };
    
    // Force security level calculation if auto-manage is checked
    if (userData.autoManageSecurity) {
      userData.niveauValidationSecu = this.perms.getMaxSecurityLevelForProfile(userData.profil);
    }
    if (!userData.motDePasse || userData.motDePasse.trim() === '') {
      delete userData.motDePasse;
    }
    if (userData.pays === '') userData.pays = null;
    if (userData.base === '') userData.base = null;
    if (userData.vehiculeAttitre === '') userData.vehiculeAttitre = null;

    console.log('Données envoyées pour mise à jour utilisateur:', userData);
    this.utilisateurService.updateUser(this.selectedUser._id, userData).subscribe(
      (response) => {
        alert('Utilisateur mis à jour avec succès !');
        this.selectedUser = null;
        this.loadUtilisateurs();
        this.closeUserModal();
      },
      (error) => {
        console.error('Erreur mise à jour utilisateur:', error);
        if (error.status === 403) alert('Accès refusé.');
        else alert('Erreur lors de la mise à jour: ' + (error.error?.message || error.message));
      }
    );
  }

  deleteUser(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.utilisateurService.deleteUser(id).subscribe(
        (response) => {
          alert('Utilisateur supprimé avec succès !');
          this.loadUtilisateurs();
        },
        (error) => {
          console.error('Erreur suppression utilisateur:', error);
          if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à supprimer des utilisateurs.');
          else alert('Erreur lors de la suppression de l\'utilisateur.');
        }
      );
    }
  }
}
