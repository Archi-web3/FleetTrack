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
import { ProjetService } from '../projet.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-gestion-projets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    MatCheckboxModule,
    TranslateModule
  ],
  templateUrl: './gestion-projets.component.html',
  styleUrls: ['./gestion-projets.component.css']
})
export class GestionProjetsComponent implements OnInit, AfterViewInit {
  projets: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('projetFormDialog') projetFormDialog!: TemplateRef<any>;

  allColumns = [
    { def: 'nom', label: 'Nom du Projet' },
    { def: 'code', label: 'Code' },
    { def: 'description', label: 'Description' },
    { def: 'actif', label: 'Statut' },
    { def: 'actions', label: 'Actions' }
  ];
  displayedColumns: string[] = ['nom', 'code', 'description', 'actif', 'actions'];

  newProjet: any = { nom: '', code: '', description: '', actif: true };
  selectedProjet: any = null;
  userProfile: string | null = null;

  constructor(
    private projetService: ProjetService,
    public authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    this.loadProjets();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadProjets(): void {
    this.projetService.getProjets(true).subscribe(data => {
      this.projets = data;
      this.dataSource.data = this.projets;
    });
  }

  openProjetModal(projet?: any): void {
    if (projet) {
      this.selectedProjet = { ...projet };
      this.newProjet = {
        nom: projet.nom,
        code: projet.code,
        description: projet.description,
        actif: projet.actif
      };
    } else {
      this.selectedProjet = null;
      this.newProjet = { nom: '', code: '', description: '', actif: true };
    }
    this.dialog.open(this.projetFormDialog, { width: '600px', panelClass: 'custom-dialog-container', maxWidth: '95vw', maxHeight: '90vh' });
  }

  closeProjetModal(): void {
    this.dialog.closeAll();
  }

  saveProjet(): void {
    if (!this.newProjet.nom || !this.newProjet.code) {
      alert("Le nom et le code du projet sont obligatoires.");
      return;
    }

    if (this.selectedProjet) {
      this.projetService.updateProjet(this.selectedProjet._id, this.newProjet).subscribe(() => {
        this.loadProjets();
        this.closeProjetModal();
      });
    } else {
      this.projetService.addProjet(this.newProjet).subscribe(() => {
        this.loadProjets();
        this.closeProjetModal();
      });
    }
  }

  deleteProjet(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projetService.deleteProjet(id).subscribe(() => {
        this.loadProjets();
      });
    }
  }
}
"""

html_content = """<div class="page-header-actions" style="justify-content: space-between; margin-bottom: 20px;">
  <h2 style="margin: 0; display: flex; align-items: center; gap: 10px;">
    <mat-icon style="color: var(--primary-color);">assignment</mat-icon>
    Gestion des Projets
  </h2>
  <div style="display: flex; gap: 15px; align-items: center;">
    <button mat-flat-button color="primary" (click)="openProjetModal()" *ngIf="userProfile === 'SuperAdmin'">
      <mat-icon>add</mat-icon> NOUVEAU PROJET
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
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Nom </th>
        <td mat-cell *matCellDef="let element"> <strong>{{element.nom}}</strong> </td>
      </ng-container>

      <ng-container matColumnDef="code">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Code </th>
        <td mat-cell *matCellDef="let element"> {{element.code}} </td>
      </ng-container>

      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef> Description </th>
        <td mat-cell *matCellDef="let element"> {{element.description || '-'}} </td>
      </ng-container>

      <ng-container matColumnDef="actif">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Statut </th>
        <td mat-cell *matCellDef="let element"> 
          <mat-icon [style.color]="element.actif ? '#4caf50' : '#f44336'">
            {{ element.actif ? 'check_circle' : 'cancel' }}
          </mat-icon>
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Actions </th>
        <td mat-cell *matCellDef="let element">
          <div class="action-buttons" *ngIf="userProfile === 'SuperAdmin'">
            <button mat-icon-button color="primary" (click)="openProjetModal(element)" matTooltip="Modifier">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteProjet(element._id)" matTooltip="Supprimer">
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

<!-- MODAL NOUVEAU / MODIFIER PROJET -->
<ng-template #projetFormDialog>
  <div class="custom-modal-layout" style="width: 100%;">
    <div class="custom-modal-header">
      <h2>
        <mat-icon>assignment</mat-icon>
        {{ selectedProjet ? 'Modifier le projet' : 'Nouveau projet' }}
      </h2>
      <button class="custom-modal-close-btn" (click)="closeProjetModal()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <div class="custom-modal-body">
      <form (ngSubmit)="saveProjet()" #projetForm="ngForm" id="projetForm">
        
        <div class="modern-form-group">
          <label>Nom du projet *</label>
          <input class="modern-input" type="text" name="projetNom" [(ngModel)]="newProjet.nom" required>
        </div>
        
        <div class="modern-form-group">
          <label>Code du projet *</label>
          <input class="modern-input" type="text" name="projetCode" [(ngModel)]="newProjet.code" required>
        </div>

        <div class="modern-form-group">
          <label>Description</label>
          <textarea class="modern-input" name="projetDesc" [(ngModel)]="newProjet.description" rows="3"></textarea>
        </div>

        <div style="margin-top: 15px;">
          <label style="display: flex; align-items: center; cursor: pointer; font-weight: 500;">
            <input type="checkbox" name="projetActif" [(ngModel)]="newProjet.actif" style="width: auto; margin-right: 10px; transform: scale(1.5);">
            Projet Actif
          </label>
        </div>

      </form>
    </div>
    
    <div class="custom-modal-footer">
      <button class="custom-modal-btn-cancel" (click)="closeProjetModal()">
        <mat-icon>close</mat-icon> Annuler
      </button>
      <button class="custom-modal-btn-submit" type="submit" form="projetForm" [disabled]="!projetForm.form.valid">
        <mat-icon>check</mat-icon> {{ selectedProjet ? 'Mettre à jour' : 'Enregistrer' }}
      </button>
    </div>
  </div>
</ng-template>
"""

with open('src/app/gestion-projets/gestion-projets.component.ts', 'w') as f:
    f.write(ts_content)

with open('src/app/gestion-projets/gestion-projets.component.html', 'w') as f:
    f.write(html_content)

print("Rewrote Projets Component")
