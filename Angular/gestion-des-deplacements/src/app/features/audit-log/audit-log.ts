import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuditService, AuditLog } from '../../core/services/audit.service';
import { PaysService } from '../../pays.service';

import { AuthService } from '../../auth.service';

@Component({
    selector: 'app-audit-log',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './audit-log.html',
    styleUrls: ['./audit-log.css']
})
export class AuditLogComponent implements OnInit {
    logs: AuditLog[] = [];
    displayedColumns: string[] = ['date', 'pays', 'actor', 'category', 'action', 'target'];
    isSuperAdmin = false;

    constructor(
        private auditService: AuditService,
        private authService: AuthService,
        private paysService: PaysService
    ) { }

    ngOnInit() {
        this.authService.userProfile$.subscribe(profile => {
            this.isSuperAdmin = profile === 'SuperAdmin';
            this.loadLogs(); // Load logs after knowing profile to apply filter
        });
    }

    loadLogs() {
        let countryFilter: string | undefined;

        if (this.isSuperAdmin) {
            const selectedCountry = this.paysService.getSelectedCountry();
            // Handle 'all' and explicit 'none' (handled by backend now)
            if (selectedCountry && selectedCountry !== 'all') {
                countryFilter = selectedCountry;
            }
        }

        this.auditService.getLogs(50, undefined, countryFilter).subscribe({
            next: (data: AuditLog[]) => this.logs = data,
            error: (err: any) => console.error('Error loading audit logs', err)
        });
    }

    deleteLogs() {
        if (confirm('⚠️ ATTENTION : Voulez-vous vraiment SUPPRIMER TOUT l\'historique d\'activité ?\nCette action est irréversible.')) {
            this.auditService.clearLogs().subscribe({
                next: () => {
                    alert('Journal nettoyé avec succès.');
                    this.loadLogs();
                },
                error: (err: any) => {
                    console.error('Error cleaning logs', err);
                    alert('Erreur lors du nettoyage des logs.');
                }
            });
        }
    }
}
