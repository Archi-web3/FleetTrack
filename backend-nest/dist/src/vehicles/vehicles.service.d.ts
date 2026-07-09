import { Model } from 'mongoose';
import { Vehicule, VehiculeDocument } from './schemas/vehicule.schema';
import { MaintenanceAutomationService } from '../maintenance/maintenance-automation.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicles.dto';
export declare class VehiclesService {
    private vehiculeModel;
    private maintenanceAutomationService;
    constructor(vehiculeModel: Model<VehiculeDocument>, maintenanceAutomationService: MaintenanceAutomationService);
    findAll(user: import('../mouvements/dto/mouvements.dto').UserPayloadDto, countryFilter: Record<string, any>): Promise<Vehicule[]>;
    findById(id: string): Promise<VehiculeDocument | null>;
    create(createVehiculeDto: CreateVehicleDto): Promise<any>;
    update(id: string, updateVehiculeDto: UpdateVehicleDto): Promise<any>;
    delete(id: string): Promise<Vehicule>;
}
