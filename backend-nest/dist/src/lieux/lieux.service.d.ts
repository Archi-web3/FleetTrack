import { Model } from 'mongoose';
import { Lieu, LieuDocument } from './schemas/lieu.schema';
import { BaseDocument } from '../bases/schemas/base.schema';
import { CreateLieuDto, UpdateLieuDto } from './dto/lieux.dto';
import { UserPayloadDto } from '../mouvements/dto/mouvements.dto';
export declare class LieuxService {
    private lieuModel;
    private baseModel;
    constructor(lieuModel: Model<LieuDocument>, baseModel: Model<BaseDocument>);
    findAll(user: UserPayloadDto): Promise<Lieu[]>;
    findById(id: string): Promise<LieuDocument | null>;
    create(createLieuDto: CreateLieuDto, user: UserPayloadDto): Promise<Lieu>;
    update(id: string, updateLieuDto: UpdateLieuDto): Promise<Lieu>;
    delete(id: string): Promise<Lieu>;
}
