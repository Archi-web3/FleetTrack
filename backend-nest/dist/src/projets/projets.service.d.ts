import { Model } from 'mongoose';
import { Projet, ProjetDocument } from './schemas/projet.schema';
import { CreateProjetDto, UpdateProjetDto } from './dto/projet.dto';
export declare class ProjetsService {
    private projetModel;
    constructor(projetModel: Model<ProjetDocument>);
    findAll(query?: Record<string, any>): Promise<Projet[]>;
    findById(id: string): Promise<ProjetDocument | null>;
    create(createProjetDto: CreateProjetDto): Promise<Projet>;
    update(id: string, updateProjetDto: UpdateProjetDto): Promise<Projet>;
    delete(id: string): Promise<Projet>;
}
