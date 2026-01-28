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
            next: (data) => this.logs = data,
            error: (err) => console.error('Error loading audit logs', err)
        });
    }

    deleteLogs() {
        if (confirm('⚠️ ATTENTION : Voulez-vous vraiment SUPPRIMER TOUT l\'historique d\'activité ?\nCette action est irréversible.')) {
            this.auditService.clearLogs().subscribe({
                next: () => {
                    alert('Journal nettoyé avec succès.');
                    this.loadLogs();
                },
                error: (err) => {
                    console.error('Error cleaning logs', err);
                    alert('Erreur lors du nettoyage des logs.');
                }
            });
        }
    }
}
