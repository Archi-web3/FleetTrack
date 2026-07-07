import { Model } from 'mongoose';
import { Waiver, WaiverDocument } from './schemas/waiver.schema';
import { UploadsService } from '../uploads/uploads.service';
import { CreateWaiverDto } from './dto/waivers.dto';
export declare class WaiversService {
    private waiverModel;
    private uploadsService;
    constructor(waiverModel: Model<WaiverDocument>, uploadsService: UploadsService);
    createWaiver(data: CreateWaiverDto, file?: Express.Multer.File): Promise<Waiver>;
    getAllWaivers(): Promise<Waiver[]>;
    deleteWaiver(id: string): Promise<void>;
}
