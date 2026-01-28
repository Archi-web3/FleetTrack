import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuditService, AuditLog } from '../../core/services/audit.service';

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

    constructor(private auditService: AuditService) { }

    ngOnInit() {
        this.loadLogs();
    }

    loadLogs() {
        this.auditService.getLogs(50).subscribe({
            next: (data) => this.logs = data,
            error: (err) => console.error('Error loading audit logs', err)
        });
    }
}
