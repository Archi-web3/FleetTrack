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
