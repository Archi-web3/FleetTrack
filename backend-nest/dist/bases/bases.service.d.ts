import { Model } from 'mongoose';
import { Base, BaseDocument } from './schemas/base.schema';
import { CreateBaseDto, UpdateBaseDto } from './dto/bases.dto';
import { UserPayloadDto } from '../mouvements/dto/mouvements.dto';
export declare class BasesService {
    private baseModel;
    constructor(baseModel: Model<BaseDocument>);
    findAll(query?: Record<string, any>): Promise<Base[]>;
    findById(id: string): Promise<BaseDocument | null>;
    create(createBaseDto: CreateBaseDto, user: UserPayloadDto): Promise<Base>;
    update(id: string, updateBaseDto: UpdateBaseDto): Promise<Base>;
    delete(id: string): Promise<Base>;
}
