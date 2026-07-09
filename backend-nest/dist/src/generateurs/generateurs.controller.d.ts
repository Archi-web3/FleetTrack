import { GenerateursService } from './generateurs.service';
import type { AuthRequest } from '../analytics/analytics.controller';
import type { UpdateQuery } from 'mongoose';
import { GenerateurDocument } from './schemas/generateur.schema';
export declare class GenerateursController {
    private readonly generateursService;
    constructor(generateursService: GenerateursService);
    findAll(): Promise<import("./schemas/generateur.schema").Generateur[]>;
    getMaintenanceOverview(): Promise<any[]>;
    findOne(id: string): Promise<GenerateurDocument>;
    create(createGenerateurDto: Record<string, any>): Promise<import("./schemas/generateur.schema").Generateur>;
    update(id: string, updateGenerateurDto: UpdateQuery<GenerateurDocument>): Promise<import("./schemas/generateur.schema").Generateur>;
    delete(id: string): Promise<{
        message: string;
    }>;
    getLogbooks(id: string): Promise<import("../logbook/schemas/logbook.schema").GenerateurLogbook[]>;
    addLogbookEntry(id: string, logbookDto: Record<string, any>, req: AuthRequest): Promise<import("../logbook/schemas/logbook.schema").GenerateurLogbook>;
}
