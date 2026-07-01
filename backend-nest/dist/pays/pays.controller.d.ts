import { PaysService } from './pays.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class PaysController {
    private readonly paysService;
    private readonly auditLogsService;
    constructor(paysService: PaysService, auditLogsService: AuditLogsService);
    findAll(): Promise<import("./schemas/pays.schema").Pays[]>;
    create(createPaysDto: any, req: any): Promise<import("./schemas/pays.schema").Pays>;
    update(id: string, updatePaysDto: any, req: any): Promise<import("./schemas/pays.schema").Pays>;
    delete(id: string, req: any): Promise<{
        message: string;
    }>;
}
