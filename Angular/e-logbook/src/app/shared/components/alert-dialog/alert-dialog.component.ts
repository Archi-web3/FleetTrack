import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-alert-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
    <div class="alert-header" [ngClass]="data.severity">
      <mat-icon *ngIf="data.severity === 'danger'">warning</mat-icon>
      <mat-icon *ngIf="data.severity === 'warning'">info</mat-icon>
      <mat-icon *ngIf="data.severity === 'info'">notifications</mat-icon>
      <span>{{ getTitlePrefix() }}</span>
    </div>
    
    <div class="alert-content">
      <h2>{{ data.title }}</h2>
      <p class="message-body">{{ data.message }}</p>
      <p class="timestamp">{{ data.createdAt | date:'short' }}</p>
    </div>

    <div class="alert-actions">
      <button mat-raised-button [color]="getButtonColor()" (click)="onConfirm()" class="confirm-btn">
        J'ai bien reçu le message
      </button>
    </div>
  `,
    styles: [`
    .alert-header {
      padding: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: bold;
      font-size: 1.2em;
      
      &.danger { background-color: #F44336; color: white; }
      &.warning { background-color: #FF9800; color: #333; }
      &.info { background-color: #2196F3; color: white; }
    }

    .alert-content {
      padding: 20px;
      text-align: center;

      h2 {
        margin-top: 0;
        color: #333;
      }

      .message-body {
        font-size: 1.1em;
        line-height: 1.5;
        white-space: pre-wrap;
      }

      .timestamp {
        color: #999;
        font-size: 0.8em;
        margin-top: 20px;
      }
    }

    .alert-actions {
      padding: 0 20px 20px 20px;
      display: flex;
      justify-content: center;
    }

    .confirm-btn {
      width: 100%;
      padding: 10px;
      font-size: 1.1em;
    }
  `]
})
export class AlertDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<AlertDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onConfirm(): void {
        this.dialogRef.close('read');
    }

    getTitlePrefix(): string {
        switch (this.data.severity) {
            case 'danger': return 'ALERTE DE SÉCURITÉ';
            case 'warning': return 'MESSAGE IMPORTANT';
            default: return 'Information';
        }
    }

    getButtonColor(): string {
        return this.data.severity === 'danger' ? 'warn' : 'primary';
    }
}
