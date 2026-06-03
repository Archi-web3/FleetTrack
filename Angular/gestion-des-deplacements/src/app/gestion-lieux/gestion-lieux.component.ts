import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { LieuService } from '../lieu.service';
import { AuthService } from '../auth.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-gestion-lieux',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    MatCheckboxModule
  ],
  templateUrl: './gestion-lieux.component.html',
  styleUrls: ['./gestion-lieux.component.css']
})
export class GestionLieuxComponent implements OnInit, AfterViewInit {
  lieux: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('lieuFormDialog') lieuFormDialog!: TemplateRef<any>;

  allColumns = [
    { def: 'nom', label: 'Nom du Lieu' },
    { def: 'adresse', label: 'Adresse' },
    { def: 'coordonnees', label: 'Coordonnées GPS' },
    { def: 'securite', label: 'Niveau de Sécurité' },
    { def: 'sensible', label: 'Sensible' },
    { def: 'pays', label: 'Pays' },
    { def: 'base', label: 'Base' },
    { def: 'actions', label: 'Actions' }
  ];
  displayedColumns: string[] = ['nom', 'adresse', 'coordonnees', 'securite', 'pays', 'base', 'actions'];

  newLieu: any = { nom: '', adresse: '', coordonnees: { latitude: 0, longitude: 0 }, estSensible: false, niveauSecurite: 1, pays: '', base: '' };
  selectedLieu: any = null;
  
  userProfile: string | null = null;
  userPaysId: string | null = null;
  userBaseId: string | null = null;

  paysList: any[] = [];
  basesList: any[] = [];

  securityLevels = [
    { level: 1, color: '#4CAF50', label: '1 - Stable' },
    { level: 2, color: '#FFEB3B', label: '2 - Modéré' },
    { level: 3, color: '#FF9800', label: '3 - Difficile' },
    { level: 4, color: '#F44336', label: '4 - Élevé' },
    { level: 5, color: '#000000', label: '5 - Extrême' }
  ];

  showAllBasesInPays: boolean = false;

  constructor(
    private lieuService: LieuService,
    private authService: AuthService,
    private adminService: AdminService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    this.userPaysId = this.authService.getUserPaysId();
    this.userBaseId = this.authService.getUserBaseId();

    if (this.userProfile === 'SuperAdmin') {
      this.loadPays();
    } else if (this.userProfile === 'Admin' || this.userProfile === 'Superviseur') {
      this.newLieu.pays = this.userPaysId;
      this.newLieu.base = this.userBaseId;
      if (this.userPaysId) {
        this.loadBases(this.userPaysId);
      }
    }

    this.loadLieux();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'pays': return item.pays?.nom;
        case 'base': return item.base?.nom;
        case 'securite': return item.niveauSecurite;
        default: return item[property];
      }
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadPays(): void {
    this.adminService.getPays().subscribe(data => this.paysList = data);
  }

  loadBases(paysId?: string): void {
    this.adminService.getBases(paysId).subscribe(data => this.basesList = data);
  }

  onPaysChange(): void {
    this.newLieu.base = '';
    if (this.newLieu.pays) {
      this.loadBases(this.newLieu.pays);
    } else {
      this.basesList = [];
    }
  }

  loadLieux(): void {
    this.lieuService.getLieux().subscribe(data => {
      if (this.userProfile === 'SuperAdmin') {
        this.lieux = data;
      } else if (!this.showAllBasesInPays && this.userBaseId) {
        this.lieux = data.filter((lieu: any) => lieu.base && lieu.base._id === this.userBaseId);
      } else if (this.showAllBasesInPays && this.userPaysId) {
        this.lieux = data.filter((lieu: any) => lieu.pays && lieu.pays._id === this.userPaysId);
      } else {
        this.lieux = data;
      }
      this.dataSource.data = this.lieux;
    });
  }

  toggleShowAllBasesInPays(): void {
    this.showAllBasesInPays = !this.showAllBasesInPays;
    this.loadLieux();
  }

  getSecurityColor(level: number): string {
    const sec = this.securityLevels.find(s => s.level === level);
    return sec ? sec.color : '#9e9e9e';
  }

  getSecurityLabel(level: number): string {
    const sec = this.securityLevels.find(s => s.level === level);
    return sec ? sec.label : 'Inconnu';
  }

  openLieuModal(lieu?: any): void {
    if (lieu) {
      this.selectedLieu = { ...lieu };
      this.newLieu = {
        nom: lieu.nom,
        adresse: lieu.adresse,
        coordonnees: { latitude: lieu.coordonnees?.latitude || 0, longitude: lieu.coordonnees?.longitude || 0 },
        estSensible: lieu.estSensible || false,
        niveauSecurite: lieu.niveauSecurite || 1,
        pays: lieu.pays?._id || lieu.pays,
        base: lieu.base?._id || lieu.base
      };
      if (this.newLieu.pays && this.userProfile === 'SuperAdmin') {
        this.loadBases(this.newLieu.pays);
      }
    } else {
      this.selectedLieu = null;
      this.newLieu = {
        nom: '',
        adresse: '',
        coordonnees: { latitude: 0, longitude: 0 },
        estSensible: false,
        niveauSecurite: 1,
        pays: this.userProfile === 'SuperAdmin' ? '' : this.userPaysId,
        base: this.userProfile === 'SuperAdmin' ? '' : this.userBaseId
      };
    }
    this.dialog.open(this.lieuFormDialog, { width: '800px', panelClass: 'custom-dialog-container', maxWidth: '95vw', maxHeight: '90vh' });
  }

  closeLieuModal(): void {
    this.dialog.closeAll();
  }

  saveLieu(): void {
    const nom = this.newLieu.nom.trim();
    const adresse = this.newLieu.adresse.trim();
    const lat = Number(this.newLieu.coordonnees.latitude);
    const long = Number(this.newLieu.coordonnees.longitude);

    if (!nom || !adresse || isNaN(lat) || isNaN(long)) {
      alert("Veuillez remplir tous les champs (Nom, Adresse, Latitude, Longitude).");
      return;
    }

    this.newLieu.coordonnees.latitude = lat;
    this.newLieu.coordonnees.longitude = long;

    if (this.selectedLieu) {
      this.lieuService.updateLieu(this.selectedLieu._id, this.newLieu).subscribe(() => {
        this.loadLieux();
        this.closeLieuModal();
      }, error => {
        if (error.status === 403) alert("Accès refusé.");
        else alert("Erreur lors de la mise à jour.");
      });
    } else {
      this.lieuService.addLieu(this.newLieu).subscribe(() => {
        this.loadLieux();
        this.closeLieuModal();
      }, error => {
        if (error.status === 403) alert("Accès refusé.");
        else alert("Erreur lors de la création.");
      });
    }
  }

  deleteLieu(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) {
      this.lieuService.deleteLieu(id).subscribe(() => {
        this.loadLieux();
      }, error => {
        if (error.status === 403) alert("Accès refusé.");
        else alert("Erreur lors de la suppression.");
      });
    }
  }
}
