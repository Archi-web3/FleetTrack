import { MouvementsService } from './mouvements.service';
import type { AuthRequest } from '../analytics/analytics.controller';
import { CreateMouvementDto, MouvementQueryDto } from './dto/mouvements.dto';
export declare class MouvementsController {
    private readonly mouvementsService;
    constructor(mouvementsService: MouvementsService);
    findAll(query: MouvementQueryDto): Promise<import("./schemas/mouvement.schema").Mouvement[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/mouvement.schema").Mouvement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/mouvement.schema").Mouvement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    create(createMouvementDto: CreateMouvementDto, req: AuthRequest, force: string): Promise<import("./schemas/mouvement.schema").Mouvement>;
}
