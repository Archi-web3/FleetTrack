import { Component, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-mouvement-details-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './mouvement-details-dialog.component.html',
  styleUrls: ['./mouvement-details-dialog.component.scss'],
})
export class MouvementDetailsDialogComponent {
  data = inject(MAT_DIALOG_DATA);

  formatDate(date: any): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatTime(date: any): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatDateTime(date: any): string {
    if (!date) return '-';
    return `${this.formatDate(date)} à ${this.formatTime(date)}`;
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'en attente':
      case 'en attente validation sécurité':
        return '#f59e0b';
      case 'validé':
      case 'pris en charge':
      case 'en cours':
        return '#3b82f6';
      case 'terminé':
        return '#10b981';
      case 'annulé':
      case 'refusé':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  // --- Helpers pour la Frise Chronologique ---
  
  getLogistiqueStepClass(): string {
    const s = this.data.mouvement.statutLogistique;
    if (s === 'validé') return 'completed';
    if (s === 'refusé') return 'rejected';
    if (s === 'non requis') return 'skipped';
    return 'pending';
  }

  getLogistiqueDesc(): string {
    const s = this.data.mouvement.statutLogistique;
    if (s === 'validé') return 'Approuvé par la Logistique';
    if (s === 'refusé') return 'Refusé par la Logistique';
    if (s === 'non requis') return 'Aucune validation requise';
    return 'En attente de validation';
  }

  getSecuriteStepClass(): string {
    const s = this.data.mouvement.statutSecurite;
    if (s === 'validé') return 'completed';
    if (s === 'refusé') return 'rejected';
    if (s === 'non requis' || this.data.mouvement.validationLevelRequired === 0) return 'skipped';
    return 'pending';
  }

  getSecuriteDesc(): string {
    const s = this.data.mouvement.statutSecurite;
    if (s === 'validé') return 'Approuvé par la Sécurité';
    if (s === 'refusé') return 'Refusé par la Sécurité';
    if (s === 'non requis' || this.data.mouvement.validationLevelRequired === 0) return 'Aucune validation requise';
    return 'En attente des validations requises';
  }

  getFinalStepClass(): string {
    const s = this.data.mouvement.statut;
    if (['validé', 'pris en charge', 'en cours', 'terminé'].includes(s)) return 'completed';
    if (['refusé', 'annulé'].includes(s)) return 'rejected';
    return 'pending';
  }

  getFinalDesc(): string {
    const s = this.data.mouvement.statut;
    if (['validé', 'pris en charge', 'en cours', 'terminé'].includes(s)) return 'Mouvement autorisé';
    if (['refusé', 'annulé'].includes(s)) return 'Mouvement annulé ou refusé';
    return 'En attente des autorisations';
  }

  getApprovalIcon(status: string): string {
    switch (status) {
      case 'approved': return 'check_circle';
      case 'rejected': return 'cancel';
      default: return 'hourglass_empty';
    }
  }

  formatApprovalStatus(status: string): string {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Refusé';
      default: return 'En attente';
    }
  }
}
