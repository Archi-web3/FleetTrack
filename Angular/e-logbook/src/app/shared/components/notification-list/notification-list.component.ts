import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
// ... imports

@Component({
    // ...
})
export class NotificationListComponent implements OnInit {
    alerts: any[] = [];
    vehicleId: string;
    isLoading = true;

    constructor(
        private dialogRef: MatDialogRef<NotificationListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { vehicleId: string },
        private alertService: AlertPollerService,
        private cdr: ChangeDetectorRef // NOUVEAU
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
                // console.log('Inbox data received:', alerts);
                this.alerts = alerts;
                this.isLoading = false;
                this.cdr.detectChanges(); // FORCE UI UPDATE
            },
            error: (err) => {
                console.error('Inbox error:', err);
                this.isLoading = false;
                this.cdr.detectChanges(); // FORCE UI UPDATE
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
