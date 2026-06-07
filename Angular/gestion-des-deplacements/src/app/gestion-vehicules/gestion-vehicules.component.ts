import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculeService } from '../vehicule.service';
import { AuthService } from '../auth.service';
import { AdminService } from '../admin.service';
import { SettingsService } from '../settings.service';
import { ChauffeurService } from '../chauffeur.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-gestion-vehicules',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TranslateModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatIconModule, MatButtonModule, MatSelectModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, RouterModule
  ],
  templateUrl: './gestion-vehicules.component.html',
  styleUrls: ['./gestion-vehicules.component.css']
})
export class GestionVehiculesComponent implements OnInit, AfterViewInit {
  vehicules: any[] = [];
  newVehicule: any = {
    marque: '',
    modele: '',
    immatriculation: '',
    acfCode: '',
    typePropriete: 'ACF',
    locationDetails: { nomLoueur: '', dateDebut: null, dateFin: null },
    achatDetails: { dateAchat: null, valeurAchat: null },
    type: 'Voiture',
    distanceUnit: 'Kilometers',
    resourcesCode: '',
    nickname: '',
    permanentlyAssigned: false,
    assignedDriverId: null,
    usageType: 'Mixed',
    bcfSpoNumber: '',
    technicalInspectionDueDate: null,
    capacitePassagers: 1,
    kilometrageInitial: 0,
    enService: true,
    enableGpsTracking: false,
    pays: '',
    base: '',
    emissionsCO2: { valeur: null, source: 'Constructeur' },
    consommation: { valeur: null, source: 'Constructeur', dateTest: null },
    assurance: { nomAssureur: '', dateFin: null, certificatUrl: '' }
  };
  selectedVehicule: any = null;
  vehicleTypes: string[] = [];
  ownershipTypes: string[] = ['ACF', 'Location'];
  chauffeurs: any[] = [];
  statuses: string[] = ['En Service', 'Hors Service', 'Vendu', 'Archivé', 'Restitué'];
  userProfile: string | null = null;
  userPaysId: string | null = null;
  userBaseId: string | null = null;

  // Table Data
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('vehiculeFormDialog') vehiculeFormDialog!: TemplateRef<any>;

  allColumns = [
    { def: 'immatriculation', label: 'Immatriculation' },
    { def: 'marque', label: 'Marque/Modèle' },
    { def: 'acfCode', label: 'Code ACF' },
    { def: 'typePropriete', label: 'Propriété' },
    { def: 'statut', label: 'Statut' },
    { def: 'actions', label: 'Actions' }
  ];
  displayedColumns: string[] = ['immatriculation', 'marque', 'acfCode', 'typePropriete', 'statut', 'actions'];

  // Pour SuperAdmin
  paysList: any[] = [];
  basesList: any[] = [];

  // Pour filtrage
  showAllBasesInPays: boolean = false;

  constructor(
    private vehiculeService: VehiculeService,
    private authService: AuthService,
    private adminService: AdminService,
    private settingsService: SettingsService,
    private chauffeurService: ChauffeurService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    this.userPaysId = this.authService.getUserPaysId();
    this.userBaseId = this.authService.getUserBaseId();

    this.settingsService.getVehicleTypes().subscribe(types => this.vehicleTypes = types || []);
    
    this.chauffeurService.getChauffeurs().subscribe({
      next: (data) => this.chauffeurs = data,
      error: (err) => console.error('Error fetching chauffeurs', err)
    });

    if (this.userProfile === 'SuperAdmin') {
      this.loadPays();
    } else if (this.userProfile === 'Admin' || this.userProfile === 'Superviseur') {
      this.newVehicule.pays = this.userPaysId;
      this.newVehicule.base = this.userBaseId;
      if (this.userPaysId) {
        this.loadBases(this.userPaysId);
      }
    }

    this.loadVehicules();

    // Init Inventory for New Vehicle
    this.newVehicule.equipementsDisplay = this.STANDARD_EQUIPMENTS.map(std => ({
      ...std, isPresent: false, lastChecked: null
    }));
  }

  // LISTE STANDARD DES ÉQUIPEMENTS (Numéro / Nom)
  readonly STANDARD_EQUIPMENTS = [
    { code: 1, name: 'Manuel d’instructions véhicule et manuel chauffeur ACF' },
    { code: 2, name: 'Carnet d’entretien (Logbook)' },
    { code: 3, name: 'Carnet de bord (Tripbook)' },
    { code: 4, name: 'Carnet de carburant (Fuelbook)' },
    { code: 5, name: 'Document enregistrement véhicule' },
    { code: 6, name: 'Contrat d’assurance' },
    { code: 7, name: 'Liste de contacts ACF' },
    { code: 8, name: 'Boite d’outils standard' },
    { code: 9, name: 'Équipement de tractage (corde, crochet…)' },
    { code: 10, name: 'Kit standard de premier secours' },
    { code: 11, name: 'Extincteur' },
    { code: 12, name: 'Drapeau et visibilité ACF' },
    { code: 13, name: 'Torche / batteries' },
    { code: 14, name: 'Boite médicale d’urgence' },
    { code: 15, name: 'Triangle d’urgence' },
    { code: 16, name: 'Cric origine' },
    { code: 17, name: 'Roue de secours' },
    { code: 18, name: 'Liste des documents et objets' },
    { code: 19, name: 'Déclaration amiable en cas d’accident' },
    { code: 20, name: 'Décharge de responsabilité' },
    { code: 21, name: 'Carte' },
    { code: 22, name: 'Eau' }
  ];

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // Helper pour chercher correctement même dans les objets imbriqués
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

  openVehiculeModal(vehicule?: any) {
    if (vehicule) {
      this.selectVehicule(vehicule);
    } else {
      this.selectedVehicule = null;
      // Reset form
      this.newVehicule = {
        marque: '', modele: '', immatriculation: '', acfCode: '', typePropriete: 'ACF',
        locationDetails: { nomLoueur: '', dateDebut: null, dateFin: null },
        achatDetails: { dateAchat: null, valeurAchat: null },
        type: 'Voiture', capacitePassagers: 1, kilometrageInitial: 0,
        enService: true, enableGpsTracking: false,
        pays: this.userProfile === 'SuperAdmin' ? '' : this.userPaysId,
        base: this.userProfile === 'SuperAdmin' ? '' : this.userBaseId,
        emissionsCO2: { valeur: null, source: 'Constructeur' },
        consommation: { valeur: null, source: 'Constructeur', dateTest: null },
        assurance: { nomAssureur: '', dateFin: null, certificatUrl: '' },
        statut: 'En Service'
      };
      this.newVehicule.equipementsDisplay = this.STANDARD_EQUIPMENTS.map(std => ({
        ...std, isPresent: false, lastChecked: null
      }));
    }
    this.dialog.open(this.vehiculeFormDialog, { width: '800px', panelClass: 'custom-dialog-container', maxWidth: '95vw', maxHeight: '90vh' });
  }

  closeVehiculeModal() {
    this.dialog.closeAll();
  }

  loadPays(): void {
    this.adminService.getPays().subscribe(
      (data) => this.paysList = data,
      (error) => console.error('Erreur chargement pays:', error)
    );
  }

  loadBases(paysId?: string): void {
    this.adminService.getBases(paysId).subscribe(
      (data) => this.basesList = data,
      (error) => console.error('Erreur chargement bases:', error)
    );
  }

  onPaysChange(): void {
    this.newVehicule.base = '';
    if (this.newVehicule.pays) {
      this.loadBases(this.newVehicule.pays);
    } else {
      this.basesList = [];
    }
  }

  loadVehicules(): void {
    this.vehiculeService.getVehicules().subscribe(
      (data) => {
        if (this.userProfile === 'SuperAdmin') {
          this.vehicules = data;
        } else if (!this.showAllBasesInPays && this.userBaseId) {
          this.vehicules = data.filter((v: any) => v.base && v.base._id === this.userBaseId);
        } else if (this.showAllBasesInPays && this.userPaysId) {
          this.vehicules = data.filter((v: any) => v.pays && v.pays._id === this.userPaysId);
        } else {
          this.vehicules = data;
        }
        this.dataSource.data = this.vehicules;
      },
      (error) => console.error('Erreur chargement véhicules:', error)
    );
  }

  toggleShowAllBasesInPays(): void {
    this.showAllBasesInPays = !this.showAllBasesInPays;
    this.loadVehicules();
  }

  addVehicule(): void {
    // Mapper l'affichage vers le modèle de données
    if (this.newVehicule.equipementsDisplay) {
      this.newVehicule.equipements = this.newVehicule.equipementsDisplay;
    }

    this.vehiculeService.addVehicule(this.newVehicule).subscribe(
      (response) => {
        alert('Véhicule créé avec succès !');
        this.newVehicule = {
          marque: '',
          modele: '',
          immatriculation: '',
          acfCode: '',
          typePropriete: 'ACF',
          locationDetails: { nomLoueur: '', dateDebut: null, dateFin: null },
          achatDetails: { dateAchat: null, valeurAchat: null },
          type: 'Voiture',
          capacitePassagers: 1,
          kilometrageInitial: 0,
          enService: true,
          enableGpsTracking: false, // NOUVEAU
          pays: this.userProfile === 'SuperAdmin' ? '' : this.userPaysId,
          base: this.userProfile === 'SuperAdmin' ? '' : this.userBaseId,
          emissionsCO2: { valeur: null, source: 'Constructeur' },
          consommation: { valeur: null, source: 'Constructeur', dateTest: null },
          assurance: { nomAssureur: '', dateFin: null, certificatUrl: '' },
          statut: 'En Service'
        };
        // Reset Inventory display
        this.newVehicule.equipementsDisplay = this.STANDARD_EQUIPMENTS.map(std => ({
          ...std, isPresent: false, lastChecked: null
        }));
        this.loadVehicules();
        this.closeVehiculeModal();
      },
      (error) => {
        console.error('Erreur création véhicule:', error);
        if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à créer des véhicules.');
        else alert('Erreur lors de la création du véhicule.');
      }
    );
  }

  selectVehicule(vehicule: any): void {
    this.selectedVehicule = { ...vehicule };
    // Initialiser les champs manquants (migration ou anciennes données)
    if (!this.selectedVehicule.typePropriete) {
      // Fallback: si 'owner' existe (ancien champ), l'utiliser, sinon 'ACF'
      this.selectedVehicule.typePropriete = this.selectedVehicule.owner || 'ACF';
    }
    if (!this.selectedVehicule.locationDetails) {
      this.selectedVehicule.locationDetails = { nomLoueur: '', dateDebut: null, dateFin: null };
    }
    if (!this.selectedVehicule.achatDetails) {
      this.selectedVehicule.achatDetails = { dateAchat: null, valeurAchat: null };
    }
    // Initialiser les champs environnementaux s'ils n'existent pas
    if (!this.selectedVehicule.emissionsCO2) {
      this.selectedVehicule.emissionsCO2 = { valeur: null, source: 'Constructeur' };
    }
    if (!this.selectedVehicule.consommation) {
      this.selectedVehicule.consommation = { valeur: null, source: 'Constructeur', dateTest: null };
    }
    if (!this.selectedVehicule.assurance) {
      this.selectedVehicule.assurance = { nomAssureur: '', dateFin: null, certificatUrl: '' };
    }
    if (this.selectedVehicule.enableGpsTracking === undefined) {
      this.selectedVehicule.enableGpsTracking = false;
    }
    if (!this.selectedVehicule.statut) {
      this.selectedVehicule.statut = this.selectedVehicule.enService ? 'En Service' : 'Hors Service';
    }

    // INITIALISER LES ÉQUIPEMENTS (Fusionner avec le standard)
    if (!this.selectedVehicule.equipements) {
      this.selectedVehicule.equipements = [];
    }

    // Pour chaque item standard, vérifier s'il existe déjà, sinon l'ajouter
    this.selectedVehicule.equipementsDisplay = this.STANDARD_EQUIPMENTS.map(std => {
      const existing = this.selectedVehicule.equipements.find((e: any) => e.code === std.code);
      return existing ? { ...existing, name: std.name } : { ...std, isPresent: false, lastChecked: null };
    });
  }

  updateVehicule(): void {
    if (!this.selectedVehicule) return;

    // Mapper l'affichage vers le modèle de données
    if (this.selectedVehicule.equipementsDisplay) {
      this.selectedVehicule.equipements = this.selectedVehicule.equipementsDisplay;
    }

    this.vehiculeService.updateVehicule(this.selectedVehicule._id, this.selectedVehicule).subscribe(
      (response) => {
        alert('Véhicule mis à jour avec succès !');
        this.selectedVehicule = null;
        this.loadVehicules();
        this.closeVehiculeModal();
      },
      (error) => {
        console.error('Erreur mise à jour véhicule:', error);
        if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à modifier ce véhicule.');
        else alert('Erreur lors de la mise à jour du véhicule.');
      }
    );
  }

  // Mettre à jour la date de vérif quand on coche
  updateCheckDate(item: any): void {
    if (item.isPresent) {
      item.lastChecked = new Date();
    } else {
      item.lastChecked = null;
    }
  }

  // GESTION DYNAMIQUE DE L'INVENTAIRE
  addEquipment(vehicule: any): void {
    const newCode = vehicule.equipementsDisplay && vehicule.equipementsDisplay.length > 0
      ? Math.max(...vehicule.equipementsDisplay.map((e: any) => e.code)) + 1
      : 1;

    if (!vehicule.equipementsDisplay) {
      vehicule.equipementsDisplay = [];
    }

    vehicule.equipementsDisplay.push({
      code: newCode,
      name: 'Nouvel équipement',
      isPresent: false,
      lastChecked: null,
      isCustom: true // Indicateur pour le frontend si besoin
    });
  }

  removeEquipment(vehicule: any, index: number): void {
    if (confirm('Voulez-vous supprimer cet élément de la liste ?')) {
      vehicule.equipementsDisplay.splice(index, 1);
    }
  }

  deleteVehicule(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      this.vehiculeService.deleteVehicule(id).subscribe(
        (response) => {
          alert('Véhicule supprimé avec succès !');
          this.loadVehicules();
        },
        (error) => {
          console.error('Erreur suppression véhicule:', error);
          if (error.status === 403) alert('Accès refusé. Vous n\'êtes pas autorisé à supprimer des véhicules.');
          else alert('Erreur lors de la suppression du véhicule.');
        }
      );
    }
  }

  archiveVehicule(vehicule: any): void {
    if (confirm('Voulez-vous vraiment archiver ce véhicule ? (Il ne sera plus sélectionnable pour les missions)')) {
      const updatedVehicule = { ...vehicule, statut: 'Archivé', enService: false };
      this.vehiculeService.updateVehicule(vehicule._id, updatedVehicule).subscribe(
        () => {
          alert('Véhicule archivé avec succès.');
          this.loadVehicules();
        },
        error => console.error('Erreur archivage:', error)
      );
    }
  }

  unarchiveVehicule(vehicule: any): void {
    const newKmStr = prompt('Pour réactiver ce véhicule, veuillez confirmer son kilométrage ACTUEL (compteur) :', vehicule.kilometrage);
    if (newKmStr !== null) {
      const newKm = parseFloat(newKmStr);
      if (isNaN(newKm) || newKm < vehicule.kilometrage) {
        alert('Kilométrage invalide. Le nouveau kilométrage doit être supérieur ou égal à l\'ancien.');
        return;
      }

      const updatedVehicule = {
        ...vehicule,
        statut: 'En Service',
        enService: true,
        kilometrage: newKm
      };

      this.vehiculeService.updateVehicule(vehicule._id, updatedVehicule).subscribe(
        () => {
          alert('Véhicule désarchivé et remis en service.');
          this.loadVehicules();
        },
        error => console.error('Erreur désarchivage:', error)
      );
    }
  }
}
