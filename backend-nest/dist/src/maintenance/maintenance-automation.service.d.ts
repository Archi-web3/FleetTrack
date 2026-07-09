import { Model } from 'mongoose';
import { ServiceScheduleDocument } from '../service-schedule/schemas/service-schedule.schema';
import { ChecklistTemplateDocument } from '../checklist-templates/schemas/checklist-template.schema';
import { VehiculeDocument } from '../vehicles/schemas/vehicule.schema';
export declare class MaintenanceAutomationService {
    private serviceScheduleModel;
    private checklistTemplateModel;
    private vehiculeModel;
    private readonly logger;
    constructor(serviceScheduleModel: Model<ServiceScheduleDocument>, checklistTemplateModel: Model<ChecklistTemplateDocument>, vehiculeModel: Model<VehiculeDocument>);
    generateServiceSchedules(vehiculeId: string, currentKm: number): Promise<ServiceScheduleDocument[]>;
    private calculateServiceIntervals;
    private getNextServiceType;
    private determineStatut;
    updateServiceStatuses(vehiculeId: string, currentKm: number): Promise<number>;
}
