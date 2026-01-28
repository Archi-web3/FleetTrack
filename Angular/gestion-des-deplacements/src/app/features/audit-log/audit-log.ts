import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuditService, AuditLog } from '../../core/services/audit.service';
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
    displayedColumns: string[] = ['date', 'actor', 'category', 'action', 'target'];
    isSuperAdmin = false;

    constructor(
        private auditService: AuditService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.loadLogs();
        this.authService.userProfile$.subscribe(profile => {
            this.isSuperAdmin = profile === 'SuperAdmin';
        });
    }

    loadLogs() {
        this.auditService.getLogs(50).subscribe({
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
