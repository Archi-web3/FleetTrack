import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-mouvement-details-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule
    ],
    templateUrl: './mouvement-details-dialog.component.html',
    styleUrls: ['./mouvement-details-dialog.component.css']
})
export class MouvementDetailsDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
        console.log('Mouvement details:', data);
    }

    formatDate(date: any): string {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    formatTime(date: any): string {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDateTime(date: any): string {
        if (!date) return '-';
        return `${this.formatDate(date)} à ${this.formatTime(date)}`;
    }

    getStatutColor(statut: string): string {
        const colors: any = {
            'en attente': '#FFA500',
            'validé': '#4CAF50',
            'pris en charge': '#2196F3',
            'en cours': '#2196F3',
            'terminé': '#52ae32',
            'annulé': '#9E9E9E',
            'refusé': '#F44336'
        };
        return colors[statut] || '#757575';
    }
}
