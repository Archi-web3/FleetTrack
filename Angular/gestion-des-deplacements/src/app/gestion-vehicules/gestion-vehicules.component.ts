import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculeService } from '../vehicule.service';
import { AuthService } from '../auth.service';
import { AdminService } from '../admin.service';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-gestion-vehicules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-vehicules.component.html',
  styleUrls: ['./gestion-vehicules.component.css']
})
export class GestionVehiculesComponent implements OnInit {
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
    capacitePassagers: 1,
    kilometrageInitial: 0,
    enService: true,
    enableGpsTracking: false, // NOUVEAU
    pays: '',
    base: '',
    emissionsCO2: { valeur: null, source: 'Constructeur' },
    consommation: { valeur: null, source: 'Constructeur', dateTest: null },
    assurance: { nomAssureur: '', dateFin: null, certificatUrl: '' }
  };
  selectedVehicule: any = null;
  vehicleTypes: string[] = [];
  ownershipTypes: string[] = ['ACF', 'Location'];
  statuses: string[] = ['En Service', 'Hors Service', 'Vendu', 'Archivé', 'Restitué'];
  userProfile: string | null = null;
  userPaysId: string | null = null;
  userBaseId: string | null = null;

  // Pour SuperAdmin
  paysList: any[] = [];
  basesList: any[] = [];

  // Pour filtrage
  showAllBasesInPays: boolean = false;

  constructor(
    private vehiculeService: VehiculeService,
    private authService: AuthService,
    private adminService: AdminService,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    this.userPaysId = this.authService.getUserPaysId();
    this.userBaseId = this.authService.getUserBaseId();

    this.settingsService.getVehicleTypes().subscribe(types => this.vehicleTypes = types || []);

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
        // Filtrage côté client
        if (this.userProfile === 'SuperAdmin') {
          // SuperAdmin voit tout
          this.vehicules = data;
        } else if (!this.showAllBasesInPays && this.userBaseId) {
          // Afficher uniquement les véhicules de ma base (exclure les véhicules sans base)
          this.vehicules = data.filter((v: any) =>
            v.base && v.base._id === this.userBaseId
          );
        } else if (this.showAllBasesInPays && this.userPaysId) {
          // Afficher tous les véhicules du même pays (exclure les véhicules sans pays)
          this.vehicules = data.filter((v: any) =>
            v.pays && v.pays._id === this.userPaysId
          );
        } else {
          this.vehicules = data;
        }
      },
      (error) => console.error('Erreur chargement véhicules:', error)
    );
  }

  toggleShowAllBasesInPays(): void {
    this.showAllBasesInPays = !this.showAllBasesInPays;
    this.loadVehicules();
  }

  addVehicule(): void {
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
        this.loadVehicules();
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
