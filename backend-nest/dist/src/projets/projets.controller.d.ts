import { ProjetsService } from './projets.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { AuthRequest } from '../analytics/analytics.controller';
import { CreateProjetDto, UpdateProjetDto } from './dto/projet.dto';
export declare class ProjetsController {
    private readonly projetsService;
    private readonly auditLogsService;
    constructor(projetsService: ProjetsService, auditLogsService: AuditLogsService);
    findAll(req: AuthRequest, includeInactifs: string): Promise<import("./schemas/projet.schema").Projet[]>;
    findOne(id: string): Promise<import("./schemas/projet.schema").ProjetDocument>;
    create(createProjetDto: CreateProjetDto, req: AuthRequest): Promise<import("./schemas/projet.schema").Projet>;
    update(id: string, updateProjetDto: UpdateProjetDto, req: AuthRequest): Promise<import("./schemas/projet.schema").Projet>;
    delete(id: string, req: AuthRequest): Promise<{
        message: string;
    }>;
}
