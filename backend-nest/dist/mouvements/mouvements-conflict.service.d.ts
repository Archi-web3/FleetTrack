import { Model } from 'mongoose';
import { MouvementDocument } from './schemas/mouvement.schema';
export declare class MouvementsConflictService {
    private mouvementModel;
    constructor(mouvementModel: Model<MouvementDocument>);
    checkDriverConflict(chauffeurId: string, dateDepart: Date, dateArrivee: Date, excludeMouvementId?: string | null): Promise<MouvementDocument | null>;
    checkVehicleConflict(vehiculeId: string, dateDepart: Date, dateArrivee: Date, excludeMouvementId?: string | null): Promise<MouvementDocument | null>;
}
