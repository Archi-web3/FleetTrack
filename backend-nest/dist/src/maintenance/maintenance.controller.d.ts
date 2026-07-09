import { MaintenanceService } from './maintenance.service';
import { ValidateTaskDto, CompleteServiceDto } from './dto/maintenance.dto';
import type { AuthRequest } from '../analytics/analytics.controller';
export declare class MaintenanceController {
    private readonly maintenanceService;
    constructor(maintenanceService: MaintenanceService);
    getStats(): Promise<{
        totalVehicules: number;
        servicesDus: number;
        checklistsRetard: number;
        coutMoyen: number;
    }>;
    getCurrentWeeklyChecklist(vehiculeId: string, req: AuthRequest): Promise<import("./schemas/weekly-checklist.schema").WeeklyChecklist>;
    validateWeeklyTask(body: ValidateTaskDto): Promise<import("./schemas/weekly-checklist.schema").WeeklyChecklist>;
    getNextService(vehiculeId: string): Promise<import("./schemas/service-schedule.schema").ServiceSchedule>;
    completeService(body: CompleteServiceDto, req: AuthRequest): Promise<import("./schemas/service-schedule.schema").ServiceSchedule>;
}
