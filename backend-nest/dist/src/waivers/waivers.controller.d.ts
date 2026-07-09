import { WaiversService } from './waivers.service';
import { CreateWaiverDto } from './dto/waivers.dto';
export declare class WaiversController {
    private readonly waiversService;
    constructor(waiversService: WaiversService);
    createWaiver(file: Express.Multer.File, body: CreateWaiverDto): Promise<import("./schemas/waiver.schema").Waiver>;
    getAllWaivers(): Promise<import("./schemas/waiver.schema").Waiver[]>;
    deleteWaiver(id: string): Promise<{
        message: string;
    }>;
}
