import { Model } from 'mongoose';
import { Generateur, GenerateurDocument } from './schemas/generateur.schema';
import { GenerateurLogbook, GenerateurLogbookDocument } from '../logbook/schemas/logbook.schema';
export declare class GenerateursService {
    private generateurModel;
    private logbookModel;
    constructor(generateurModel: Model<GenerateurDocument>, logbookModel: Model<GenerateurLogbookDocument>);
    findAll(): Promise<Generateur[]>;
    findById(id: string): Promise<GenerateurDocument | null>;
    create(createGenerateurDto: any): Promise<Generateur>;
    update(id: string, updateGenerateurDto: import('mongoose').UpdateQuery<GenerateurDocument>): Promise<Generateur>;
    delete(id: string): Promise<Generateur>;
    getLogbooks(generateurId: string): Promise<GenerateurLogbook[]>;
    addLogbookEntry(generateurId: string, logbookDto: Record<string, any>, user: import('../mouvements/dto/mouvements.dto').UserPayloadDto): Promise<GenerateurLogbook>;
    getMaintenanceOverview(): Promise<any[]>;
}
