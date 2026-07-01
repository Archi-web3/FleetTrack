import { EnvironmentService } from './environment.service';
import { EnvironmentActionDocument } from './schemas/environment-action.schema';
import { EnvironmentData } from './schemas/environment-data.schema';
export declare class EnvironmentController {
    private readonly environmentService;
    constructor(environmentService: EnvironmentService);
    getActions(year: number, base: string): Promise<import("./schemas/environment-action.schema").EnvironmentAction[]>;
    createAction(body: Record<string, any>): Promise<import("./schemas/environment-action.schema").EnvironmentAction>;
    updateAction(id: string, body: import('mongoose').UpdateQuery<EnvironmentActionDocument>): Promise<import("./schemas/environment-action.schema").EnvironmentAction>;
    deleteAction(id: string): Promise<void>;
    getData(year: number, base: string): Promise<EnvironmentData[]>;
    upsertData(body: Partial<EnvironmentData>): Promise<EnvironmentData>;
    aggregateStats(year: number, month: number, base: string): Promise<{
        fleet_liters_total: number;
        fleet_km_total: number;
        driver_nb_projects: number;
    }>;
}
