import os

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
import { TranslateModule } from '@ngx-translate/core';
import { PaysService, Pays } from '../pays.service';

@Component({
  selector: 'app-gestion-pays',
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
    TranslateModule
  ],
  templateUrl: './gestion-pays.component.html',
  styleUrls: []
})
export class GestionPaysComponent implements OnInit, AfterViewInit {
  paysList: Pays[] = [];
  selectedPays: Pays | null = null;
  newPays: Partial<Pays> = { nom: '', code: '', devise: 'USD' };

  dataSource: MatTableDataSource<Pays> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paysFormDialog') paysFormDialog!: TemplateRef<any>;

  allColumns = [
    { def: 'nom', label: 'Nom du Pays' },
    { def: 'code', label: 'Code' },
    { def: 'devise', label: 'Devise' },
    { def: 'actions', label: 'Actions' }
  ];
  displayedColumns: string[] = ['nom', 'code', 'devise', 'actions'];

  constructor(
    private paysService: PaysService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPays();
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

  loadPays(): void {
    this.paysService.getPays().subscribe(pays => {
      this.paysList = pays;
      this.dataSource.data = this.paysList;
    });
  }

  openPaysModal(pays?: Pays): void {
    if (pays) {
      this.selectedPays = { ...pays };
    } else {
      this.selectedPays = null;
      this.newPays = { nom: '', code: '', devise: 'USD' };
    }
    this.dialog.open(this.paysFormDialog, { width: '600px', panelClass: 'custom-dialog-container', maxWidth: '95vw', maxHeight: '90vh' });
  }

  closePaysModal(): void {
    this.dialog.closeAll();
  }

  savePays(): void {
    if (this.selectedPays) {
      // Update
      this.paysService.updatePays(this.selectedPays._id, { nom: this.selectedPays.nom, code: this.selectedPays.code, devise: this.selectedPays.devise }).subscribe(() => {
        this.loadPays();
        this.closePaysModal();
      });
    } else {
      // Create
      this.paysService.createPays({ nom: this.newPays.nom!, code: this.newPays.code!, devise: this.newPays.devise }).subscribe(() => {
        this.loadPays();
        this.closePaysModal();
      });
    }
  }

  deletePays(pays: Pays): void {
    if (confirm(`Supprimer le pays ${pays.nom} ?`)) {
      this.paysService.deletePays(pays._id).subscribe(() => {
        this.loadPays();
      });
    }
  }
}
"""

html_content = """<div class="page-header-actions" style="justify-content: space-between; margin-bottom: 20px;">
  <h2 style="margin: 0; display: flex; align-items: center; gap: 10px;">
    <mat-icon style="color: var(--primary-color);">public</mat-icon>
    Gestion des Pays
  </h2>
  <div style="display: flex; gap: 15px; align-items: center;">
    <button mat-flat-button color="primary" (click)="openPaysModal()">
      <mat-icon>add</mat-icon> NOUVEAU PAYS
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

      <ng-container matColumnDef="devise">
        <th mat-header-cell *matHeaderCellDef mat-sort-header> Devise </th>
        <td mat-cell *matCellDef="let element"> {{element.devise || 'USD'}} </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> Actions </th>
        <td mat-cell *matCellDef="let element">
          <div class="action-buttons">
            <button mat-icon-button color="primary" (click)="openPaysModal(element)" matTooltip="Modifier">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deletePays(element)" matTooltip="Supprimer">
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

<ng-template #paysFormDialog>
  <div class="custom-modal-layout" style="width: 100%; max-width: 600px;">
    <div class="custom-modal-header">
      <h2>
        <mat-icon>public</mat-icon>
        {{ selectedPays ? 'Modifier le pays' : 'Ajouter un pays' }}
      </h2>
      <button class="custom-modal-close-btn" (click)="closePaysModal()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <div class="custom-modal-body">
      <form (ngSubmit)="savePays()" #paysForm="ngForm" id="paysForm">
        <div class="modern-form-group">
          <label>Nom du pays</label>
          <input class="modern-input" type="text" name="paysNom" [(ngModel)]="selectedPays ? selectedPays.nom : newPays.nom" required>
        </div>
        
        <div class="modal-grid-2">
          <div class="modern-form-group">
            <label>Code (ex: RDC, RCA)</label>
            <input class="modern-input" type="text" name="paysCode" [(ngModel)]="selectedPays ? selectedPays.code : newPays.code" required>
          </div>
          <div class="modern-form-group">
            <label>Devise principale</label>
            <input class="modern-input" type="text" name="paysDevise" [(ngModel)]="selectedPays ? selectedPays.devise : newPays.devise" required>
          </div>
        </div>
      </form>
    </div>
    
    <div class="custom-modal-footer">
      <button class="custom-modal-btn-cancel" (click)="closePaysModal()">
        <mat-icon>close</mat-icon> Annuler
      </button>
      <button class="custom-modal-btn-submit" type="submit" attr.form="paysForm" [disabled]="!paysForm.form.valid">
        <mat-icon>check</mat-icon> {{ selectedPays ? 'Mettre à jour' : 'Ajouter' }}
      </button>
    </div>
  </div>
</ng-template>
"""

with open('src/app/gestion-pays/gestion-pays.component.ts', 'w') as f:
    f.write(ts_content)

with open('src/app/gestion-pays/gestion-pays.component.html', 'w') as f:
    f.write(html_content)

print("Rewrote Pays component")
