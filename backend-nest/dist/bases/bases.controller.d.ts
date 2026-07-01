import { BasesService } from './bases.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateBaseDto, UpdateBaseDto } from './dto/bases.dto';
import type { AuthRequest } from '../analytics/analytics.controller';
export declare class BasesController {
    private readonly basesService;
    private readonly auditLogsService;
    constructor(basesService: BasesService, auditLogsService: AuditLogsService);
    findAll(req: AuthRequest, paysQuery: string): Promise<import("./schemas/base.schema").Base[]>;
    create(createBaseDto: CreateBaseDto, req: AuthRequest): Promise<import("./schemas/base.schema").Base>;
    update(id: string, updateBaseDto: UpdateBaseDto, req: AuthRequest): Promise<import("./schemas/base.schema").Base>;
    delete(id: string, req: AuthRequest): Promise<{
        message: string;
    }>;
}
