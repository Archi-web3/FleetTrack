import { SettingsService } from '../settings/settings.service';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
export interface MovementContext {
    demandeur?: {
        nom: string;
        prenom: string;
    };
    projet?: string;
    projetsPassagers?: string[];
    stops?: Array<{
        lieu?: {
            nom?: string;
        };
    }>;
    [key: string]: any;
}
export declare class MailService {
    private settingsService;
    private userModel;
    private readonly logger;
    private transporter;
    private isSimulationMode;
    constructor(settingsService: SettingsService, userModel: Model<UserDocument>);
    private initTransporter;
    private isNotificationEnabled;
    sendMail(to: string, subject: string, htmlContent: string): Promise<Record<string, any> | null>;
    sendValidationRequest(to: string, movement: MovementContext): Promise<void>;
    sendStatusUpdate(to: string, movement: MovementContext, status: string, reason?: string): Promise<void>;
    sendTemplateEmail(templateId: string, movement: MovementContext, defaultEmails: string[]): Promise<void>;
    private getLastDestination;
}
