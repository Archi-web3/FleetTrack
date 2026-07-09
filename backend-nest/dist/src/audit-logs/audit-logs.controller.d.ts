import { AuditLogsService } from './audit-logs.service';
export declare class AuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    getLogs(limitStr?: string, category?: string, pays?: string): Promise<import("./schemas/audit-log.schema").AuditLog[]>;
    clearLogs(): Promise<{
        message: string;
    }>;
}
