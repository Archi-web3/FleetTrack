import { Model } from 'mongoose';
import { EnvironmentAction, EnvironmentActionDocument } from './schemas/environment-action.schema';
import { EnvironmentData, EnvironmentDataDocument } from './schemas/environment-data.schema';
import { FuelDocument } from '../logbook/schemas/fuel.schema';
import { MouvementDocument } from '../mouvements/schemas/mouvement.schema';
export declare class EnvironmentService {
    private actionModel;
    private dataModel;
    private fuelModel;
    private mouvementModel;
    private readonly logger;
    constructor(actionModel: Model<EnvironmentActionDocument>, dataModel: Model<EnvironmentDataDocument>, fuelModel: Model<FuelDocument>, mouvementModel: Model<MouvementDocument>);
    getActions(year: number, base: string): Promise<EnvironmentAction[]>;
    createAction(data: Record<string, any>): Promise<EnvironmentAction>;
    updateAction(id: string, data: import('mongoose').UpdateQuery<EnvironmentActionDocument>): Promise<EnvironmentAction>;
    deleteAction(id: string): Promise<void>;
    getData(year: number, base: string): Promise<EnvironmentData[]>;
    upsertData(data: Partial<EnvironmentData>): Promise<EnvironmentData>;
    aggregateStats(year: number, month: number, _base: string): Promise<{
        fleet_liters_total: number;
        fleet_km_total: number;
        driver_nb_projects: number;
    }>;
}
