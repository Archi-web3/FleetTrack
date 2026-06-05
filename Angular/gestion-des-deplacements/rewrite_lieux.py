ts_content = """import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
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
"""

html_content = """<div class="page-header-actions" style="justify-content: space-between; margin-bottom: 20px;">
  <h2 style="margin: 0; display: flex; align-items: center; gap: 10px;">
    <mat-icon style="color: var(--primary-color);">location_on</mat-icon>
    Gestion des Lieux (Waypoints)
  </h2>
  <div style="display: flex; gap: 15px; align-items: center;">
    <button mat-stroked-button *ngIf="userProfile !== 'SuperAdmin'" (click)="toggleShowAllBasesInPays()">
      {{ showAllBasesInPays ? 'Ne voir que ma base' : 'Voir toutes les bases de mon pays' }}
    </button>
    <button mat-flat-button color="primary" (click)="openLieuModal()">
      <mat-icon>add</mat-icon> NOUVEAU LIEU
    </button>
  </div>
</div>

<div class="table-container">
  <div class="table-header-container">
    <mat-form-field appearance="outline" style="margin-bottom: -22px; width: 250px;">
      <mat-label>Colonnes affichées</mat-label>
      <mat-select multiple [(ngModel)]="displayedColumns">
        <mat-option *ngFor="let col of allColumns" [value]="col.def">{{ col.label }}</mat-option>
      </mat-select>
    </mat-form-field>

    <div class="custom-search-input">
      <mat-icon>search</mat-icon>
      <input type="text" (keyup)="applyFilter($event)" placeholder="Rechercher...">
    </div>
  </div>

  <div class="table-responsive">
    <table mat-table [dataSource]="dataSource" matSort style="width: 100%;">
      
      <ng-container matColumnDef="nom">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Nom du Lieu </th>
        <td mat-cell *matCellDef="let element"> 
          <strong>{{element.nom}}</strong>
          <mat-icon *ngIf="element.estSensible" style="color: #F44336; font-size: 16px; margin-left: 5px; vertical-align: middle;" matTooltip="Lieu Sensible">warning</mat-icon>
        </td>
      </ng-container>

      <ng-container matColumnDef="adresse">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Adresse </th>
        <td mat-cell *matCellDef="let element"> {{element.adresse}} </td>
      </ng-container>

      <ng-container matColumnDef="coordonnees">
        <th mat-header-cell *matHeaderCellDef> Coordonnées GPS </th>
        <td mat-cell *matCellDef="let element"> {{element.coordonnees?.latitude}}, {{element.coordonnees?.longitude}} </td>
      </ng-container>

      <ng-container matColumnDef="securite">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Sécurité </th>
        <td mat-cell *matCellDef="let element"> 
          <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 5px;" [style.background]="getSecurityColor(element.niveauSecurite)"></span>
          {{getSecurityLabel(element.niveauSecurite)}}
        </td>
      </ng-container>

      <ng-container matColumnDef="sensible">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Sensible </th>
        <td mat-cell *matCellDef="let element"> {{element.estSensible ? 'Oui' : 'Non'}} </td>
      </ng-container>

      <ng-container matColumnDef="pays">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Pays </th>
        <td mat-cell *matCellDef="let element"> {{element.pays?.nom || '-'}} </td>
      </ng-container>

      <ng-container matColumnDef="base">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Base </th>
        <td mat-cell *matCellDef="let element"> {{element.base?.nom || '-'}} </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Actions </th>
        <td mat-cell *matCellDef="let element">
          <div class="action-buttons">
            <button mat-icon-button color="primary" (click)="openLieuModal(element)" matTooltip="Modifier">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteLieu(element._id)" matTooltip="Supprimer">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  </div>
  <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
</div>

<!-- MODAL NOUVEAU / MODIFIER LIEU -->
<ng-template #lieuFormDialog>
  <div class="custom-modal-layout" style="width: 100%;">
    <div class="custom-modal-header">
      <h2>
        <mat-icon>location_on</mat-icon>
        {{ selectedLieu ? 'Modifier le lieu' : 'Nouveau lieu' }}
      </h2>
      <button class="custom-modal-close-btn" (click)="closeLieuModal()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <div class="custom-modal-body">
      <form (ngSubmit)="saveLieu()" #lieuForm="ngForm" id="lieuForm">
        
        <div class="modal-grid-2">
          <div class="modern-form-group">
            <label>Nom du lieu *</label>
            <input class="modern-input" type="text" name="lieuNom" [(ngModel)]="newLieu.nom" required>
          </div>
          <div class="modern-form-group">
            <label>Adresse *</label>
            <input class="modern-input" type="text" name="lieuAdresse" [(ngModel)]="newLieu.adresse" required>
          </div>
        </div>

        <div class="modal-grid-2">
          <div class="modern-form-group">
            <label>Latitude *</label>
            <input class="modern-input" type="number" step="any" name="lieuLat" [(ngModel)]="newLieu.coordonnees.latitude" required>
          </div>
          <div class="modern-form-group">
            <label>Longitude *</label>
            <input class="modern-input" type="number" step="any" name="lieuLng" [(ngModel)]="newLieu.coordonnees.longitude" required>
          </div>
        </div>

        <div class="modal-grid-2" style="align-items: center;">
          <div class="modern-form-group">
            <label>Niveau de sécurité *</label>
            <select class="modern-input" name="lieuSecurite" [(ngModel)]="newLieu.niveauSecurite" required>
              <option *ngFor="let sec of securityLevels" [value]="sec.level">{{ sec.label }}</option>
            </select>
          </div>
          <div style="margin-top: 15px;">
            <label style="display: flex; align-items: center; cursor: pointer; font-weight: 500;">
              <input type="checkbox" name="lieuSensible" [(ngModel)]="newLieu.estSensible" style="width: auto; margin-right: 10px; transform: scale(1.5);">
              Zone Sensible / Dangereuse
            </label>
          </div>
        </div>

        <!-- SuperAdmin uniquement -->
        <div class="modal-grid-2" *ngIf="userProfile === 'SuperAdmin'">
          <div class="modern-form-group">
            <label>Pays</label>
            <select class="modern-input" name="lieuPays" [(ngModel)]="newLieu.pays" (change)="onPaysChange()">
              <option value="">-- Aucun --</option>
              <option *ngFor="let p of paysList" [value]="p._id">{{ p.nom }}</option>
            </select>
          </div>
          <div class="modern-form-group">
            <label>Base</label>
            <select class="modern-input" name="lieuBase" [(ngModel)]="newLieu.base">
              <option value="">-- Aucune --</option>
              <option *ngFor="let b of basesList" [value]="b._id">{{ b.nom }}</option>
            </select>
          </div>
        </div>

      </form>
    </div>
    
    <div class="custom-modal-footer">
      <button class="custom-modal-btn-cancel" (click)="closeLieuModal()">
        <mat-icon>close</mat-icon> Annuler
      </button>
      <button class="custom-modal-btn-submit" type="submit" attr.form="lieuForm" [disabled]="!lieuForm.form.valid">
        <mat-icon>check</mat-icon> {{ selectedLieu ? 'Mettre à jour' : 'Enregistrer' }}
      </button>
    </div>
  </div>
</ng-template>
"""

with open('src/app/gestion-lieux/gestion-lieux.component.ts', 'w') as f:
    f.write(ts_content)

with open('src/app/gestion-lieux/gestion-lieux.component.html', 'w') as f:
    f.write(html_content)

print("Rewrote Lieux Component")
