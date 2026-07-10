import { Model } from 'mongoose';
import { Axe, AxeDocument } from './schemas/axe.schema';
import { CreateAxeDto, UpdateAxeDto } from './dto/axes.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class AxesService {
    private axeModel;
    private readonly auditLogsService;
    constructor(axeModel: Model<AxeDocument>, auditLogsService: AuditLogsService);
    create(createAxeDto: CreateAxeDto, req: any): Promise<Axe>;
    findAll(context: any): Promise<Axe[]>;
    findOne(id: string): Promise<Axe>;
    update(id: string, updateAxeDto: UpdateAxeDto, req: any): Promise<Axe>;
    delete(id: string, req: any): Promise<void>;
    findAxeBetween(lieu1Id: string, lieu2Id: string): Promise<Axe | null>;
}
