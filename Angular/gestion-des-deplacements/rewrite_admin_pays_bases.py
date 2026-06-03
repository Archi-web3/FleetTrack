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
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '../../admin.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-admin-pays-bases',
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
    MatCardModule
  ],
  templateUrl: './admin-pays-bases.html',
  styleUrls: ['./admin-pays-bases.css']
})
export class AdminPaysBasesComponent implements OnInit, AfterViewInit {
  userProfile: string | null = null;
  paysList: any[] = [];
  baseList: any[] = [];
  selectedPays: any = null;

  paysDataSource: MatTableDataSource<any> = new MatTableDataSource();
  basesDataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild('paysPaginator') paysPaginator!: MatPaginator;
  @ViewChild('basesPaginator') basesPaginator!: MatPaginator;
  
  @ViewChild('paysFormDialog') paysFormDialog!: TemplateRef<any>;
  @ViewChild('baseFormDialog') baseFormDialog!: TemplateRef<any>;

  paysDisplayedColumns: string[] = ['nom', 'code', 'devise', 'actions'];
  basesDisplayedColumns: string[] = ['nom', 'code', 'actions'];

  newPays = { nom: '', code: '', devise: 'USD' };
  newBase = { nom: '', pays: '', code: '' };

  editingPays: any = null;
  editingBase: any = null;

  constructor(
    private adminService: AdminService,
    public authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userProfile = this.authService.getUserProfile();
    this.loadPays();
  }

  ngAfterViewInit(): void {
    this.paysDataSource.paginator = this.paysPaginator;
    this.basesDataSource.paginator = this.basesPaginator;
  }

  applyPaysFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.paysDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyBasesFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.basesDataSource.filter = filterValue.trim().toLowerCase();
  }

  loadPays() {
    this.adminService.getPays().subscribe(data => {
      this.paysList = data;
      this.paysDataSource.data = this.paysList;
    });
  }

  loadBases() {
    this.adminService.getBases(this.selectedPays?._id).subscribe(data => {
      this.baseList = data;
      this.basesDataSource.data = this.baseList;
    });
  }

  onPaysSelect(pays: any) {
    this.selectedPays = pays;
    this.newBase.pays = pays._id;
    this.loadBases();
  }

  // --- Modals ---
  openPaysModal(pays?: any) {
    if (pays) {
      this.editingPays = pays;
      this.newPays = { nom: pays.nom, code: pays.code, devise: pays.devise };
    } else {
      this.editingPays = null;
      this.newPays = { nom: '', code: '', devise: 'USD' };
    }
    this.dialog.open(this.paysFormDialog, { width: '500px', panelClass: 'custom-dialog-container', maxWidth: '95vw', maxHeight: '90vh' });
  }

  openBaseModal(base?: any) {
    if (!this.selectedPays) return;
    if (base) {
      this.editingBase = base;
      this.newBase = { nom: base.nom, code: base.code || '', pays: base.pays._id || base.pays };
    } else {
      this.editingBase = null;
      this.newBase = { nom: '', code: '', pays: this.selectedPays._id };
    }
    this.dialog.open(this.baseFormDialog, { width: '500px', panelClass: 'custom-dialog-container', maxWidth: '95vw', maxHeight: '90vh' });
  }

  closePaysModal() {
    this.dialog.closeAll();
  }

  closeBaseModal() {
    this.dialog.closeAll();
  }

  // --- Actions ---
  savePays() {
    if (!this.newPays.nom || !this.newPays.code) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (this.editingPays) {
      this.adminService.updatePays(this.editingPays._id, this.newPays).subscribe(() => {
        this.loadPays();
        this.closePaysModal();
      });
    } else {
      this.adminService.addPays(this.newPays).subscribe(() => {
        this.loadPays();
        this.closePaysModal();
      });
    }
  }

  deletePays(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce pays ? Toutes les bases associées seront également supprimées.')) {
      this.adminService.deletePays(id).subscribe(() => {
        this.loadPays();
        if (this.selectedPays?._id === id) {
          this.selectedPays = null;
          this.basesDataSource.data = [];
        }
      });
    }
  }

  saveBase() {
    if (!this.newBase.nom || !this.newBase.pays) {
      alert('Veuillez sélectionner un pays et remplir le nom de la base');
      return;
    }
    if (this.editingBase) {
      this.adminService.updateBase(this.editingBase._id, this.newBase).subscribe(() => {
        this.loadBases();
        this.closeBaseModal();
      });
    } else {
      this.adminService.addBase(this.newBase).subscribe(() => {
        this.loadBases();
        this.closeBaseModal();
      });
    }
  }

  deleteBase(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette base ?')) {
      this.adminService.deleteBase(id).subscribe(() => {
        this.loadBases();
      });
    }
  }
}
"""

html_content = """<div class="page-header-actions" style="margin-bottom: 20px;">
  <h2 style="margin: 0; display: flex; align-items: center; gap: 10px;">
    <mat-icon style="color: var(--primary-color);">public</mat-icon>
    Gestion des Pays et Bases
  </h2>
</div>

<div style="display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;">

  <!-- TABLE PAYS -->
  <div class="table-container" style="flex: 1; min-width: 400px; padding: 15px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h3 style="margin: 0; color: #4b5563; font-weight: 600;">Pays (Missions)</h3>
      <button mat-flat-button color="primary" (click)="openPaysModal()" *ngIf="userProfile === 'SuperAdmin'">
        <mat-icon>add</mat-icon> PAYS
      </button>
    </div>

    <div class="custom-search-input" style="width: 100%; margin-bottom: 15px;">
      <mat-icon>search</mat-icon>
      <input type="text" (keyup)="applyPaysFilter($event)" placeholder="Rechercher un pays...">
    </div>

    <div class="table-responsive">
      <table mat-table [dataSource]="paysDataSource" style="width: 100%;">
        
        <ng-container matColumnDef="nom">
          <th mat-header-cell *matHeaderCellDef> Nom </th>
          <td mat-cell *matCellDef="let element" (click)="onPaysSelect(element)" style="cursor: pointer;"> 
            <strong [style.color]="selectedPays?._id === element._id ? 'var(--primary-color)' : 'inherit'">{{element.nom}}</strong> 
          </td>
        </ng-container>

        <ng-container matColumnDef="code">
          <th mat-header-cell *matHeaderCellDef> Code </th>
          <td mat-cell *matCellDef="let element" (click)="onPaysSelect(element)" style="cursor: pointer;"> {{element.code}} </td>
        </ng-container>

        <ng-container matColumnDef="devise">
          <th mat-header-cell *matHeaderCellDef> Devise </th>
          <td mat-cell *matCellDef="let element" (click)="onPaysSelect(element)" style="cursor: pointer;"> {{element.devise}} </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef style="width: 100px;"> Actions </th>
          <td mat-cell *matCellDef="let element">
            <div class="action-buttons" *ngIf="userProfile === 'SuperAdmin'">
              <button mat-icon-button color="primary" (click)="openPaysModal(element); $event.stopPropagation()">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deletePays(element._id); $event.stopPropagation()">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="paysDisplayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: paysDisplayedColumns;" [class.selected-row]="selectedPays?._id === row._id"></tr>
      </table>
    </div>
    <mat-paginator #paysPaginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
  </div>


  <!-- TABLE BASES -->
  <div class="table-container" style="flex: 1; min-width: 400px; padding: 15px;">
    <ng-container *ngIf="selectedPays; else noPaysSelected">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; color: #4b5563; font-weight: 600;">Bases pour {{ selectedPays.nom }}</h3>
        <button mat-flat-button color="accent" (click)="openBaseModal()">
          <mat-icon>add</mat-icon> BASE
        </button>
      </div>

      <div class="custom-search-input" style="width: 100%; margin-bottom: 15px;">
        <mat-icon>search</mat-icon>
        <input type="text" (keyup)="applyBasesFilter($event)" placeholder="Rechercher une base...">
      </div>

      <div class="table-responsive">
        <table mat-table [dataSource]="basesDataSource" style="width: 100%;">
          
          <ng-container matColumnDef="nom">
            <th mat-header-cell *matHeaderCellDef> Nom de la Base </th>
            <td mat-cell *matCellDef="let element"> <strong>{{element.nom}}</strong> </td>
          </ng-container>

          <ng-container matColumnDef="code">
            <th mat-header-cell *matHeaderCellDef> Code Interne </th>
            <td mat-cell *matCellDef="let element"> {{element.code || '-'}} </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef style="width: 100px;"> Actions </th>
            <td mat-cell *matCellDef="let element">
              <div class="action-buttons">
                <button mat-icon-button color="primary" (click)="openBaseModal(element)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteBase(element._id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="basesDisplayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: basesDisplayedColumns;"></tr>
        </table>
      </div>
      <mat-paginator #basesPaginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
    </ng-container>

    <ng-template #noPaysSelected>
      <div style="text-align: center; padding: 60px 20px; color: #9ca3af;">
        <mat-icon style="font-size: 64px; width: 64px; height: 64px; margin-bottom: 20px;">domain</mat-icon>
        <h3>Aucun Pays Sélectionné</h3>
        <p>Sélectionnez un pays dans le tableau de gauche pour voir et gérer ses bases.</p>
      </div>
    </ng-template>
  </div>

</div>


<!-- MODAL PAYS -->
<ng-template #paysFormDialog>
  <div class="custom-modal-layout" style="width: 100%;">
    <div class="custom-modal-header">
      <h2>
        <mat-icon>public</mat-icon>
        {{ editingPays ? 'Modifier le pays' : 'Nouveau pays' }}
      </h2>
      <button class="custom-modal-close-btn" (click)="closePaysModal()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <div class="custom-modal-body">
      <form (ngSubmit)="savePays()" #paysForm="ngForm" id="paysForm">
        <div class="modern-form-group">
          <label>Nom du pays</label>
          <input class="modern-input" type="text" name="paysNom" [(ngModel)]="newPays.nom" required>
        </div>
        <div class="modal-grid-2">
          <div class="modern-form-group">
            <label>Code (ex: RDC)</label>
            <input class="modern-input" type="text" name="paysCode" [(ngModel)]="newPays.code" required>
          </div>
          <div class="modern-form-group">
            <label>Devise</label>
            <input class="modern-input" type="text" name="paysDevise" [(ngModel)]="newPays.devise" required>
          </div>
        </div>
      </form>
    </div>
    
    <div class="custom-modal-footer">
      <button class="custom-modal-btn-cancel" (click)="closePaysModal()">
        <mat-icon>close</mat-icon> Annuler
      </button>
      <button class="custom-modal-btn-submit" type="submit" attr.form="paysForm" [disabled]="!paysForm.form.valid">
        <mat-icon>check</mat-icon> {{ editingPays ? 'Mettre à jour' : 'Ajouter' }}
      </button>
    </div>
  </div>
</ng-template>

<!-- MODAL BASE -->
<ng-template #baseFormDialog>
  <div class="custom-modal-layout" style="width: 100%;">
    <div class="custom-modal-header">
      <h2>
        <mat-icon>domain</mat-icon>
        {{ editingBase ? 'Modifier la base' : 'Nouvelle base' }}
      </h2>
      <button class="custom-modal-close-btn" (click)="closeBaseModal()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <div class="custom-modal-body">
      <form (ngSubmit)="saveBase()" #baseForm="ngForm" id="baseForm">
        <div class="modern-form-group">
          <label>Nom de la base</label>
          <input class="modern-input" type="text" name="baseNom" [(ngModel)]="newBase.nom" required>
        </div>
        <div class="modern-form-group">
          <label>Code Interne (Optionnel)</label>
          <input class="modern-input" type="text" name="baseCode" [(ngModel)]="newBase.code">
        </div>
      </form>
    </div>
    
    <div class="custom-modal-footer">
      <button class="custom-modal-btn-cancel" (click)="closeBaseModal()">
        <mat-icon>close</mat-icon> Annuler
      </button>
      <button class="custom-modal-btn-submit" type="submit" attr.form="baseForm" [disabled]="!baseForm.form.valid">
        <mat-icon>check</mat-icon> {{ editingBase ? 'Mettre à jour' : 'Ajouter' }}
      </button>
    </div>
  </div>
</ng-template>
"""

with open('src/app/gestion-utilisateurs/admin-pays-bases/admin-pays-bases.ts', 'w') as f:
    f.write(ts_content)

with open('src/app/gestion-utilisateurs/admin-pays-bases/admin-pays-bases.html', 'w') as f:
    f.write(html_content)

print("Rewrote AdminPaysBases")
