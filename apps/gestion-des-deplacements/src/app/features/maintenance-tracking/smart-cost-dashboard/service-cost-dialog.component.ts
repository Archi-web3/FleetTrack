import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-service-cost-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Configuration des Coûts de Service</h2>
    <mat-dialog-content>
      <p style="font-size: 0.9em; color: #666; margin-bottom: 20px;">
        Ces coûts seront utilisés pour les prédictions si l'historique est insuffisant.
      </p>

      <div class="cost-input-group">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Service A (Petit)</mat-label>
          <input matInput type="number" [(ngModel)]="data['Service A']" placeholder="150" />
          <span matSuffix>$&nbsp;</span>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Service B (Moyen)</mat-label>
          <input matInput type="number" [(ngModel)]="data['Service B']" placeholder="350" />
          <span matSuffix>$&nbsp;</span>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Service C (Grand)</mat-label>
          <input matInput type="number" [(ngModel)]="data['Service C']" placeholder="800" />
          <span matSuffix>$&nbsp;</span>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Annuler</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="data">Enregistrer</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 10px;
      }
    `,
  ],
})
export class ServiceCostDialogComponent {
  dialogRef = inject<MatDialogRef<ServiceCostDialogComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);

  constructor() {
    // Init defaults if empty
    if (!this.data['Service A']) this.data['Service A'] = 150;
    if (!this.data['Service B']) this.data['Service B'] = 350;
    if (!this.data['Service C']) this.data['Service C'] = 800;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
