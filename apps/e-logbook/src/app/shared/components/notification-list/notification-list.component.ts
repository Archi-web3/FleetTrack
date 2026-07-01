import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AlertPollerService, VehicleAlert } from '../../../core/services/alert-poller.service';
import { PushNotificationService } from '../../../core/services/push-notification.service';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<NotificationListComponent>>(MatDialogRef);
  data = inject<{
    vehicleId: string;
  }>(MAT_DIALOG_DATA);
  private alertService = inject(AlertPollerService);
  private pushService = inject(PushNotificationService);
  private cdr = inject(ChangeDetectorRef);

  alerts: VehicleAlert[] = [];
  vehicleId: string;
  isLoading = true;

  constructor() {
    const data = this.data;

    this.vehicleId = data.vehicleId;
  }

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.isLoading = true;
    this.alertService.getInboxAlerts(this.vehicleId).subscribe({
      next: (alerts: VehicleAlert[]) => {
        this.alerts = alerts;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        console.error('Inbox error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  hideAlert(alert: VehicleAlert) {
    if (confirm('Supprimer cette notification ?')) {
      this.alertService.hideAlert(alert._id, this.vehicleId).subscribe(() => {
        this.alerts = this.alerts.filter((a) => a._id !== alert._id);
        this.cdr.detectChanges();
      });
    }
  }

  enablePush() {
    this.pushService
      .requestSubscription(this.vehicleId)
      .then(() => {
        alert(
          "✅ Notifications activées avec succès ! Vous recevrez désormais les alertes même l'app fermée.",
        );
        this.close();
      })
      .catch((err) => {
        console.error('Erreur activation push:', err);
        alert("❌ Erreur lors de l'activation des notifications :\n" + (err.message || err));
      });
  }

  close() {
    this.dialogRef.close();
  }

  getIcon(severity: string): string {
    switch (severity) {
      case 'danger':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  }
}
