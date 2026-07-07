import { Model } from 'mongoose';
import { FuelDocument } from './schemas/fuel.schema';
import { IncidentDocument } from './schemas/incident.schema';
import { MouvementDocument } from '../mouvements/schemas/mouvement.schema';
import { VehiculeDocument } from '../vehicles/schemas/vehicule.schema';
import { MaintenanceDocument } from '../maintenance/schemas/maintenance.schema';
import { LieuDocument } from '../lieux/schemas/lieu.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { VehiclesService } from '../vehicles/vehicles.service';
import { SyncPayloadDto } from './dto/sync-payload.dto';
export declare class LogbookSyncService {
    private fuelModel;
    private incidentModel;
    private mouvementModel;
    private vehiculeModel;
    private maintenanceModel;
    private lieuModel;
    private userModel;
    private vehiclesService;
    private readonly logger;
    constructor(fuelModel: Model<FuelDocument>, incidentModel: Model<IncidentDocument>, mouvementModel: Model<MouvementDocument>, vehiculeModel: Model<VehiculeDocument>, maintenanceModel: Model<MaintenanceDocument>, lieuModel: Model<LieuDocument>, userModel: Model<UserDocument>, vehiclesService: VehiclesService);
    sync(payload: SyncPayloadDto): Promise<Record<string, any>>;
    recalculateVehicleMileage(vehicleId: string): Promise<void>;
}
