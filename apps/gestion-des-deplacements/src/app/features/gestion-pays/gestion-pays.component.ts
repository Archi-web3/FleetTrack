import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, inject } from '@angular/core';

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
import { PaysService, Pays } from '../../core/services/pays.service';
import { PermissionsService } from '../../core/services/permissions.service';

@Component({
  selector: 'app-gestion-pays',
  standalone: true,
  imports: [
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
    TranslateModule,
  ],
  templateUrl: './gestion-pays.component.html',
  styleUrls: [],
})
export class GestionPaysComponent implements OnInit, AfterViewInit {
  private paysService = inject(PaysService);
  perms = inject(PermissionsService);
  private dialog = inject(MatDialog);

  paysList: Pays[] = [];
  selectedPays: Pays | null = null;
  newPays: Partial<Pays> = { nom: '', code: '', devise: 'USD' };

  dataSource = new MatTableDataSource<Pays>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paysFormDialog') paysFormDialog!: TemplateRef<any>;

  allColumns = [
    { def: 'nom', label: 'Nom du Pays' },
    { def: 'code', label: 'Code' },
    { def: 'devise', label: 'Devise' },
    { def: 'actions', label: 'Actions' },
  ];
  displayedColumns: string[] = ['nom', 'code', 'devise', 'actions'];

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
    this.paysService.getPays().subscribe((pays) => {
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
    this.dialog.open(this.paysFormDialog, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      maxWidth: '95vw',
      maxHeight: '90vh',
    });
  }

  closePaysModal(): void {
    this.dialog.closeAll();
  }

  savePays(): void {
    if (this.selectedPays) {
      // Update
      this.paysService
        .updatePays(this.selectedPays._id, {
          nom: this.selectedPays.nom,
          code: this.selectedPays.code,
          devise: this.selectedPays.devise,
        })
        .subscribe(() => {
          this.loadPays();
          this.closePaysModal();
        });
    } else {
      // Create
      this.paysService
        .createPays({
          nom: this.newPays.nom!,
          code: this.newPays.code!,
          devise: this.newPays.devise,
        })
        .subscribe(() => {
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
