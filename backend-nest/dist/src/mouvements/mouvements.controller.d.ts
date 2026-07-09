import { MouvementsService } from './mouvements.service';
import type { AuthRequest } from '../analytics/analytics.controller';
import { CreateMouvementDto, MouvementQueryDto } from './dto/mouvements.dto';
import { Mouvement } from './schemas/mouvement.schema';
export declare class MouvementsController {
    private readonly mouvementsService;
    constructor(mouvementsService: MouvementsService);
    findAll(query: MouvementQueryDto, req: AuthRequest, headerPays?: string, headerBase?: string): Promise<Mouvement[]>;
    getStatsByStatus(): Promise<any[]>;
    getStatsByVehicle(): Promise<any[]>;
    getPlanning(includePending: string): Promise<Mouvement[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Mouvement, {}, import("mongoose").DefaultSchemaOptions> & Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    create(createMouvementDto: CreateMouvementDto, req: AuthRequest, force: string): Promise<Mouvement>;
    update(id: string, updateMouvementDto: Record<string, unknown>): Promise<Mouvement>;
    validateSecurity(id: string, req: AuthRequest): Promise<Mouvement>;
    revertSecurityToDraft(id: string): Promise<Mouvement>;
    revertLogisticsToDraft(id: string): Promise<Mouvement>;
    cleanGhosts(): Promise<{
        message: string;
    }>;
    fixCountries(): Promise<{
        message: string;
    }>;
    getSuggestions(id: string): Promise<any[]>;
    remove(id: string): Promise<Mouvement | null>;
}
