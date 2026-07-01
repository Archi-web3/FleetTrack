import { VehiclesService } from './vehicles.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { Request } from 'express';
import { UserPayloadDto } from '../mouvements/dto/mouvements.dto';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicles.dto';
interface AuthRequest extends Request {
    user: UserPayloadDto;
}
export declare class VehiclesController {
    private readonly vehiclesService;
    private readonly auditLogsService;
    constructor(vehiclesService: VehiclesService, auditLogsService: AuditLogsService);
    findAll(req: AuthRequest): Promise<import("./schemas/vehicule.schema").Vehicule[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/vehicule.schema").Vehicule, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/vehicule.schema").Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    create(createVehiculeDto: CreateVehicleDto, req: AuthRequest): Promise<import("mongoose").Document<unknown, {}, import("./schemas/vehicule.schema").Vehicule, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/vehicule.schema").Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updateVehiculeDto: UpdateVehicleDto, req: AuthRequest): Promise<import("mongoose").Document<unknown, {}, import("./schemas/vehicule.schema").Vehicule, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/vehicule.schema").Vehicule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    delete(id: string, req: AuthRequest): Promise<{
        message: string;
    }>;
}
export {};
