import { AxesService } from './axes.service';
import { CreateAxeDto, UpdateAxeDto } from './dto/axes.dto';
export declare class AxesController {
    private readonly axesService;
    constructor(axesService: AxesService);
    create(createAxeDto: CreateAxeDto, req: any): Promise<import("./schemas/axe.schema").Axe>;
    findAll(paysIdsStr?: string, baseIdsStr?: string): Promise<import("./schemas/axe.schema").Axe[]>;
    findOne(id: string): Promise<import("./schemas/axe.schema").Axe>;
    update(id: string, updateAxeDto: UpdateAxeDto, req: any): Promise<import("./schemas/axe.schema").Axe>;
    remove(id: string, req: any): Promise<void>;
}
