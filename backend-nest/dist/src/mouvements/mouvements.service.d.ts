import { Model } from 'mongoose';
import { Mouvement, MouvementDocument } from './schemas/mouvement.schema';
import { MouvementsConflictService } from './mouvements-conflict.service';
import { MouvementsSecurityService } from './mouvements-security.service';
import { MailService } from '../notifications/mail.service';
import { LieuDocument } from '../lieux/schemas/lieu.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { AxesService } from '../axes/axes.service';
import { SettingsService } from '../settings/settings.service';
import { CreateMouvementDto, UserPayloadDto, MouvementQueryDto } from './dto/mouvements.dto';
export declare class MouvementsService {
    private mouvementModel;
    private lieuModel;
    private userModel;
    private conflictService;
    private securityService;
    private mailService;
    private axesService;
    private settingsService;
    private readonly logger;
    constructor(mouvementModel: Model<MouvementDocument>, lieuModel: Model<LieuDocument>, userModel: Model<UserDocument>, conflictService: MouvementsConflictService, securityService: MouvementsSecurityService, mailService: MailService, axesService: AxesService, settingsService: SettingsService);
    findAll(query?: MouvementQueryDto): Promise<Mouvement[]>;
    getPlanning(includePending: boolean): Promise<Mouvement[]>;
    getStatsByStatus(): Promise<any[]>;
    getStatsByVehicle(): Promise<any[]>;
    findById(id: string): Promise<MouvementDocument | null>;
    create(createDto: CreateMouvementDto, user: UserPayloadDto, forceConflict?: boolean): Promise<Mouvement>;
    update(id: string, updateDto: Record<string, unknown>): Promise<Mouvement>;
    validateSecurity(id: string, user: UserPayloadDto): Promise<Mouvement>;
    revertSecurityToDraft(id: string): Promise<Mouvement>;
    revertLogisticsToDraft(id: string): Promise<Mouvement>;
    cleanGhosts(): Promise<{
        message: string;
    }>;
    fixCountries(): Promise<{
        message: string;
    }>;
    getSuggestions(_id: string): Promise<any[]>;
    remove(id: string): Promise<Mouvement | null>;
}
