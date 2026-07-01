import { LieuxService } from './lieux.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { AuthRequest } from '../analytics/analytics.controller';
import { CreateLieuDto, UpdateLieuDto } from './dto/lieux.dto';
export declare class LieuxController {
    private readonly lieuxService;
    private readonly auditLogsService;
    constructor(lieuxService: LieuxService, auditLogsService: AuditLogsService);
    findAll(req: AuthRequest): Promise<import("./schemas/lieu.schema").Lieu[]>;
    findOne(id: string): Promise<import("./schemas/lieu.schema").LieuDocument>;
    create(createLieuDto: CreateLieuDto, req: AuthRequest): Promise<import("./schemas/lieu.schema").Lieu>;
    update(id: string, updateLieuDto: UpdateLieuDto, req: AuthRequest): Promise<import("./schemas/lieu.schema").Lieu>;
    delete(id: string, req: AuthRequest): Promise<{
        message: string;
    }>;
}
