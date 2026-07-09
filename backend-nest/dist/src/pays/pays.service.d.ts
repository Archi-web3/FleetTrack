import { Model } from 'mongoose';
import { Pays, PaysDocument } from './schemas/pays.schema';
export declare class PaysService {
    private paysModel;
    constructor(paysModel: Model<PaysDocument>);
    findAll(): Promise<Pays[]>;
    findById(id: string): Promise<PaysDocument | null>;
    create(createPaysDto: any): Promise<Pays>;
    update(id: string, updatePaysDto: any): Promise<Pays>;
    delete(id: string): Promise<Pays>;
}
