import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AlertPollerService } from '../../../core/services/alert-poller.service';
import { PushNotificationService } from '../../../core/services/push-notification.service'; // NOUVEAU

@Component({
    selector: 'app-notification-list',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatListModule],
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
    alerts: any[] = [];
    vehicleId: string;
    isLoading = true;

    constructor(
        private dialogRef: MatDialogRef<NotificationListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { vehicleId: string },
        private alertService: AlertPollerService,
        private pushService: PushNotificationService, // NOUVEAU
        private cdr: ChangeDetectorRef
    ) {
        this.vehicleId = data.vehicleId;
    }

    ngOnInit() {
        this.loadAlerts();
    }

    loadAlerts() {
        this.isLoading = true;
        this.alertService.getInboxAlerts(this.vehicleId).subscribe({
            next: (alerts: any[]) => {
                this.alerts = alerts;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                console.error('Inbox error:', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    hideAlert(alert: any) {
        if (confirm('Supprimer cette notification ?')) {
            this.alertService.hideAlert(alert._id, this.vehicleId).subscribe(() => {
                this.alerts = this.alerts.filter(a => a._id !== alert._id);
                this.cdr.detectChanges();
            });
        }
    }

    enablePush() {
        this.pushService.requestSubscription(this.vehicleId)
            .then(() => {
                alert("✅ Notifications activées avec succès ! Vous recevrez désormais les alertes même l'app fermée.");
                this.close();
            })
            .catch(err => {
                console.error('Erreur activation push:', err);
                alert("❌ Erreur lors de l'activation des notifications :\n" + (err.message || err));
            });
    }

    close() {
        this.dialogRef.close();
    }

    getIcon(severity: string): string {
        switch (severity) {
            case 'danger': return 'error';
            case 'warning': return 'warning';
            default: return 'info';
        }
    }
}
