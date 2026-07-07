import { Model } from 'mongoose';
import { FuelDocument } from './schemas/fuel.schema';
import { IncidentDocument } from './schemas/incident.schema';
import { Mouvement, MouvementDocument } from '../mouvements/schemas/mouvement.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { MaintenanceDocument } from '../maintenance/schemas/maintenance.schema';
export declare class LogbookService {
    private fuelModel;
    private incidentModel;
    private mouvementModel;
    private userModel;
    private maintenanceModel;
    private readonly logger;
    constructor(fuelModel: Model<FuelDocument>, incidentModel: Model<IncidentDocument>, mouvementModel: Model<MouvementDocument>, userModel: Model<UserDocument>, maintenanceModel: Model<MaintenanceDocument>);
    getMyTrips(userId: string): Promise<Mouvement[]>;
    takeCharge(mouvementId: string, userId: string): Promise<Mouvement>;
}
