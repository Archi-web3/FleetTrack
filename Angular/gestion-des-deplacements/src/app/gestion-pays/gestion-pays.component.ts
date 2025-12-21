import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PaysService, Pays } from '../pays.service';

@Component({
    selector: 'app-gestion-pays',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule
    ],
    template: `
    <div style="padding: 20px;">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Pays</mat-card-title>
          <mat-card-subtitle>SuperAdmin uniquement</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div style="margin-bottom: 20px;">
            <button mat-raised-button color="primary" (click)="openCreateDialog()">
              <mat-icon>add</mat-icon>
              Nouveau Pays
            </button>
          </div>

          <table mat-table [dataSource]="paysList" style="width: 100%;">
            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let pays">{{pays.nom}}</td>
            </ng-container>

            <ng-container matColumnDef="code">
              <th mat-header-cell *matHeaderCellDef>Code</th>
              <td mat-cell *matCellDef="let pays">{{pays.code}}</td>
            </ng-container>

            <ng-container matColumnDef="devise">
              <th mat-header-cell *matHeaderCellDef>Devise</th>
              <td mat-cell *matCellDef="let pays">{{pays.devise || 'USD'}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let pays">
                <button mat-icon-button color="primary" (click)="editPays(pays)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deletePays(pays)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: []
})
export class GestionPaysComponent implements OnInit {
    paysList: Pays[] = [];
    displayedColumns: string[] = ['nom', 'code', 'devise', 'actions'];

    constructor(
        private paysService: PaysService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadPays();
    }

    loadPays(): void {
        this.paysService.getPays().subscribe(pays => {
            this.paysList = pays;
        });
    }

    openCreateDialog(): void {
        const nom = prompt('Nom du pays:');
        const code = prompt('Code du pays (ex: RDC, RCA):');

        if (nom && code) {
            this.paysService.createPays({ nom, code }).subscribe(() => {
                this.loadPays();
            });
        }
    }

    editPays(pays: Pays): void {
        const nom = prompt('Nouveau nom:', pays.nom);
        const code = prompt('Nouveau code:', pays.code);

        if (nom && code) {
            this.paysService.updatePays(pays._id, { nom, code }).subscribe(() => {
                this.loadPays();
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
