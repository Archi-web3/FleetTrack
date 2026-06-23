import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChauffeurService } from '../../core/services/chauffeur.service'; // Gardé pour la liste initiale via route /chauffeurs
import { UtilisateurService } from '../../core/services/utilisateur.service'; // Pour update/delete complet
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
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ViewChild, TemplateRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-gestion-chauffeurs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './gestion-chauffeurs.component.html',
  styleUrls: ['./gestion-chauffeurs.component.scss']
})
export class GestionChauffeursComponent implements OnInit, AfterViewInit {
  chauffeurs: any[] = [];
  selectedChauffeur: any = null; // Pour la modification
  userProfile: string | null = null;
  userPaysId: string | null = null;

  // Données pour les listes déroulantes (comme GestionUtilisateurs)
  profiles = ['Chauffeur']; // Ici on cible surtout chauffeur, mais on garde la logic générique si besoin
  bases: any[] = [];
  paysList: any[] = [];
  vehicules: any[] = [];
  projets: any[] = [];

  // Table Data
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('chauffeurFormDialog') chauffeurFormDialog!: TemplateRef<any>;

  allColumns = [
    { def: 'nom', label: 'DRIVERS.COL_NAME' },
    { def: 'email', label: 'DRIVERS.COL_EMAIL' },
    { def: 'pays', label: 'DRIVERS.COL_COUNTRY' },
    { def: 'base', label: 'DRIVERS.COL_BASE' },
    { def: 'vehiculeAttitre', label: 'DRIVERS.COL_ASSIGNED_VEHICLE' },
    { def: 'actions', label: 'DRIVERS.COL_ACTIONS' }
  ];
  displayedColumns: string[] = ['nom', 'email', 'pays', 'base', 'vehiculeAttitre', 'actions'];

  constructor(
    private chauffeurService: ChauffeurService,
    private utilisateurService: UtilisateurService,
    private authService: AuthService,
    private adminService: AdminService,
    private projetService: ProjetService,
    public perms: PermissionsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    this.userPaysId = this.authService.getUserPaysId();

    if (this.userProfile === 'SuperAdmin') {
      this.loadPays();
    } else if (this.userProfile === 'Admin') {
      this.loadBases(this.userPaysId!);
    }

    this.loadVehicules();
    this.loadProjets();
    this.loadChauffeurs();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = Object.keys(data).reduce((currentTerm, key) => {
        return currentTerm + (data as { [key: string]: any })[key] + '◬';
      }, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openChauffeurModal(chauffeur?: any) {
    if (chauffeur) {
      this.selectChauffeur(chauffeur);
    } else {
      // Pour l'ajout on utilise toujours Utilisateurs. Ici on n'implémente que l'édition car
      // la page ne proposait pas d'ajout (l'ajout se fait via Admin Utilisateurs).
      this.selectedChauffeur = null;
    }
    this.dialog.open(this.chauffeurFormDialog, { width: '800px', panelClass: 'custom-dialog-container', maxWidth: '95vw', maxHeight: '90vh' });
  }

  closeChauffeurModal() {
    this.dialog.closeAll();
  }

  loadChauffeurs(): void {
    // On continue d'utiliser le service chauffeur qui tape sur /api/chauffeurs (qui renvoie les Utilisateurs 'Chauffeur')
    this.chauffeurService.getChauffeurs().subscribe(
      (data) => {
        this.chauffeurs = data;
        this.dataSource.data = this.chauffeurs;
      },
      (error) => console.error('Erreur chargement chauffeurs:', error)
    );
  }

  loadPays() {
    this.adminService.getPays().subscribe(data => this.paysList = data);
  }

  loadBases(paysId?: string) {
    this.adminService.getBases(paysId).subscribe(
      data => this.bases = data,
      error => console.error('Erreur chargement bases:', error)
    );
  }

  loadVehicules(): void {
    this.adminService.getVehicules().subscribe(
      (data) => this.vehicules = data,
      (error) => console.error('Erreur chargement véhicules:', error)
    );
  }

  loadProjets(): void {
    this.projetService.getProjets(false).subscribe(
      (data) => this.projets = data,
      (error) => console.error('Erreur chargement projets:', error)
    );
  }

  selectChauffeur(chauffeur: any): void {
    this.selectedChauffeur = { ...chauffeur, motDePasse: '' }; // Copie pour modif

    // Gestion des objets peuplés (base, pays) -> extraction ID
    if (this.selectedChauffeur.base && this.selectedChauffeur.base._id) {
      this.selectedChauffeur.base = this.selectedChauffeur.base._id;
    }
    let paysId = this.selectedChauffeur.pays;
    if (this.selectedChauffeur.pays && this.selectedChauffeur.pays._id) {
      paysId = this.selectedChauffeur.pays._id;
      this.selectedChauffeur.pays = paysId;
    }

    // Chargement des bases contextuelles
    if (paysId) {
      this.loadBases(paysId);
    } else if (this.userProfile === 'Admin' && this.userPaysId) {
      this.loadBases(this.userPaysId);
    }

    // Initialiser formationEcoConduite si manquant
    if (!this.selectedChauffeur.formationEcoConduite) {
      this.selectedChauffeur.formationEcoConduite = { effectuee: false, date: null };
    }
  }

  onEditPaysChange(paysId: string) {
    if (this.selectedChauffeur) {
      this.selectedChauffeur.pays = paysId;
      this.selectedChauffeur.base = '';
      this.loadBases(paysId);
    }
  }

  updateChauffeur(): void {
    if (!this.selectedChauffeur) return;

    // Nettoyage avant envoi
    const userData = { ...this.selectedChauffeur };
    if (!userData.motDePasse || userData.motDePasse.trim() === '') {
      delete userData.motDePasse;
    }
    if (userData.pays === '') userData.pays = null;
    if (userData.base === '') userData.base = null;
    if (userData.vehiculeAttitre === '') userData.vehiculeAttitre = null;

    // Utilisation de UtilisateurService pour mise à jour complète
    this.utilisateurService.updateUser(this.selectedChauffeur._id, userData).subscribe(
      (response) => {
        alert('Chauffeur mis à jour avec succès !');
        this.selectedChauffeur = null;
        this.loadChauffeurs();
        this.closeChauffeurModal();
      },
      (error) => {
        console.error('Erreur mise à jour chauffeur:', error);
        if (error.status === 403) alert('Accès refusé.');
        else alert('Erreur lors de la mise à jour: ' + (error.error?.message || error.message));
      }
    );
  }

  deleteChauffeur(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur ?')) {
      // Utilisation de UtilisateurService pour suppression complète
      this.utilisateurService.deleteUser(id).subscribe(
        (response) => {
          alert('Chauffeur supprimé avec succès !');
          this.loadChauffeurs();
        },
        (error) => {
          console.error('Erreur suppression chauffeur:', error);
          if (error.status === 403) alert('Accès refusé.');
          else alert('Erreur lors de la suppression.');
        }
      );
    }
  }
}
