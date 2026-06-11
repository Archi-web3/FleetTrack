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
import { ProjetService } from '../projet.service';
import { AuthService } from '../auth.service';
import { InfoBannerComponent } from '../core/info-banner/info-banner';

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
    TranslateModule,
    InfoBannerComponent
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
