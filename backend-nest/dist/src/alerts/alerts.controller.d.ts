import { AlertsService } from './alerts.service';
import type { AuthRequest } from '../analytics/analytics.controller';
export declare class AlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    createAlert(body: Record<string, any>, req: AuthRequest): Promise<import("./schemas/alert.schema").Alert>;
    getAllAlerts(): Promise<import("./schemas/alert.schema").Alert[]>;
    getUnreadAlerts(vehicleId: string): Promise<import("./schemas/alert.schema").Alert[]>;
    markAsRead(id: string, body: {
        vehicleId: string;
    }, req: AuthRequest): Promise<import("./schemas/alert.schema").Alert>;
    hideAlert(id: string, body: {
        vehicleId: string;
    }): Promise<import("./schemas/alert.schema").Alert>;
    deleteAlert(id: string): Promise<{
        message: string;
    }>;
}
