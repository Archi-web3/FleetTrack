import { Model } from 'mongoose';
import { MaintenanceConfigDocument } from './schemas/maintenance-config.schema';
import { ChecklistTemplateDocument } from './schemas/checklist-template.schema';
import { ServiceSchedule, ServiceScheduleDocument } from './schemas/service-schedule.schema';
import { WeeklyChecklist, WeeklyChecklistDocument } from './schemas/weekly-checklist.schema';
import { MaintenanceDocument } from './schemas/maintenance.schema';
import { VehiculeDocument } from '../vehicles/schemas/vehicule.schema';
import { UserDocument } from '../users/schemas/user.schema';
export declare class MaintenanceService {
    private configModel;
    private templateModel;
    private scheduleModel;
    private weeklyModel;
    private maintenanceModel;
    private vehiculeModel;
    private userModel;
    private readonly logger;
    constructor(configModel: Model<MaintenanceConfigDocument>, templateModel: Model<ChecklistTemplateDocument>, scheduleModel: Model<ServiceScheduleDocument>, weeklyModel: Model<WeeklyChecklistDocument>, maintenanceModel: Model<MaintenanceDocument>, vehiculeModel: Model<VehiculeDocument>, userModel: Model<UserDocument>);
    getStats(): Promise<{
        totalVehicules: number;
        servicesDus: number;
        checklistsRetard: number;
        coutMoyen: number;
    }>;
    getCurrentWeeklyChecklist(vehiculeId: string, userId: string): Promise<WeeklyChecklist>;
    validateWeeklyTask(checklistId: string, tacheId: string, validee: boolean, commentaire: string): Promise<WeeklyChecklist>;
    getNextService(vehiculeId: string): Promise<ServiceSchedule>;
    completeService(serviceId: string, signature: string, userId: string): Promise<ServiceSchedule>;
}
