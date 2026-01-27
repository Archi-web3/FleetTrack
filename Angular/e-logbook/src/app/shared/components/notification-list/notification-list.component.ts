import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AlertPollerService } from '../../../core/services/alert-poller.service';

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
    isLoading = true; // Start loading by default

    constructor(
        private dialogRef: MatDialogRef<NotificationListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { vehicleId: string },
        private alertService: AlertPollerService
    ) {
        this.vehicleId = data.vehicleId;
    }

    ngOnInit() {
        this.loadAlerts();
    }

    loadAlerts() {
        this.isLoading = true;
        this.alertService.getInboxAlerts(this.vehicleId).subscribe({
            next: (alerts) => {
                this.alerts = alerts;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    hideAlert(alert: any) {
        if (confirm('Supprimer cette notification ?')) {
            this.alertService.hideAlert(alert._id, this.vehicleId).subscribe(() => {
                this.alerts = this.alerts.filter(a => a._id !== alert._id);
            });
        }
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
