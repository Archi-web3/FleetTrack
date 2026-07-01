import { Model } from 'mongoose';
import { Alert, AlertDocument } from './schemas/alert.schema';
export declare class AlertsService {
    private alertModel;
    constructor(alertModel: Model<AlertDocument>);
    createAlert(data: any, userId: string): Promise<Alert>;
    getAllAlerts(): Promise<Alert[]>;
    getAlertsForVehicle(vehicleId: string): Promise<Alert[]>;
    markAsRead(alertId: string, vehicleId: string, userName: string): Promise<Alert>;
    hideAlert(alertId: string, vehicleId: string): Promise<Alert>;
    deleteAlert(id: string): Promise<void>;
}
