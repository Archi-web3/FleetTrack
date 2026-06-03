import re

with open('src/app/gestion-vehicules/gestion-vehicules.component.html', 'r') as f:
    content = f.read()

# Extract the Create Form (lines 4 to 235 roughly)
# Extract the Edit Form (lines 237 to 442)
# Extract the rest

# We will just use regex to wrap them.

html_top = """<div style="padding: 20px;">
  <div class="page-header-actions" style="justify-content: space-between; margin-bottom: 20px;">
    <h2 style="margin: 0; display: flex; align-items: center; gap: 10px;">
      <mat-icon style="color: var(--primary-color);">directions_car</mat-icon>
      {{ 'VEHICLES.TITLE' | translate }}
    </h2>
    <div style="display: flex; gap: 15px; align-items: center;">
      <button *ngIf="userProfile === 'SuperAdmin' || userProfile === 'Admin' || userProfile === 'Superviseur'" 
        mat-flat-button color="primary" (click)="openVehiculeModal()">
        <mat-icon>add</mat-icon> NOUVEAU VÉHICULE
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
        
        <ng-container matColumnDef="immatriculation">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Immatriculation </th>
          <td mat-cell *matCellDef="let element"> {{element.immatriculation}} </td>
        </ng-container>

        <ng-container matColumnDef="marque">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Marque/Modèle </th>
          <td mat-cell *matCellDef="let element"> {{element.marque}} {{element.modele}} </td>
        </ng-container>

        <ng-container matColumnDef="acfCode">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Code ACF </th>
          <td mat-cell *matCellDef="let element"> {{element.acfCode || '-'}} </td>
        </ng-container>

        <ng-container matColumnDef="typePropriete">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Propriété </th>
          <td mat-cell *matCellDef="let element"> {{element.typePropriete}} </td>
        </ng-container>

        <ng-container matColumnDef="statut">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Statut </th>
          <td mat-cell *matCellDef="let element"> 
            <span [ngStyle]="{'color': element.statut === 'En Service' ? '#10b981' : '#f59e0b', 'font-weight': '500'}">
              {{element.statut}}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let element">
            <div class="action-buttons">
              <button mat-icon-button color="primary" (click)="openVehiculeModal(element)" matTooltip="Modifier">
                <mat-icon>edit</mat-icon>
              </button>
              <button *ngIf="userProfile === 'SuperAdmin' || userProfile === 'Admin'" mat-icon-button color="warn" (click)="deleteVehicule(element._id)" matTooltip="Supprimer">
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
</div>

<ng-template #vehiculeFormDialog>
  <div class="custom-modal-layout" style="width: 100vw; max-width: 800px;">
    <div class="custom-modal-header">
      <h2>
        <mat-icon>directions_car</mat-icon>
        {{ selectedVehicule ? ('VEHICLES.EDIT_TITLE' | translate) : ('VEHICLES.CREATE_TITLE' | translate) }}
      </h2>
      <button class="custom-modal-close-btn" (click)="closeVehiculeModal()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <div class="custom-modal-body">
      <!-- Create Form -->
      <form *ngIf="!selectedVehicule" (ngSubmit)="addVehicule()" #vehiculeForm="ngForm" id="createForm">
"""

html_middle = """
      </form>

      <!-- Edit Form -->
      <form *ngIf="selectedVehicule" (ngSubmit)="updateVehicule()" #editVehiculeForm="ngForm" id="editForm">
"""

html_bottom = """
      </form>
    </div>
    <div class="custom-modal-footer">
      <button class="custom-modal-btn-cancel" (click)="closeVehiculeModal()">
        <mat-icon>close</mat-icon> Annuler
      </button>
      <button class="custom-modal-btn-submit" type="submit" [form]="selectedVehicule ? 'editForm' : 'createForm'">
        <mat-icon>check</mat-icon> {{ selectedVehicule ? 'Mettre à jour' : 'Ajouter' }}
      </button>
    </div>
  </div>
</ng-template>
"""

# Extract the inner contents of both forms from the original file
create_match = re.search(r'<form \(ngSubmit\)="addVehicule\(\)" #vehiculeForm="ngForm">(.*?)</form>', content, re.DOTALL)
edit_match = re.search(r'<form \(ngSubmit\)="updateVehicule\(\)" #editVehiculeForm="ngForm">(.*?)</form>', content, re.DOTALL)

if create_match and edit_match:
    create_body = create_match.group(1)
    edit_body = edit_match.group(1)
    
    # Remove the submit buttons from inside the forms (they are in footer now)
    create_body = re.sub(r'<button type="submit".*?</button>', '', create_body, flags=re.DOTALL)
    edit_body = re.sub(r'<button type="submit".*?</button>', '', edit_body, flags=re.DOTALL)

    final_html = html_top + create_body + html_middle + edit_body + html_bottom
    
    with open('src/app/gestion-vehicules/gestion-vehicules.component.html', 'w') as f:
        f.write(final_html)
    print("Successfully rewrote HTML")
else:
    print("Could not match forms")
