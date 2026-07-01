import { Model } from 'mongoose';
import { Mouvement, MouvementDocument } from './schemas/mouvement.schema';
import { MouvementsConflictService } from './mouvements-conflict.service';
import { MouvementsSecurityService } from './mouvements-security.service';
import { MailService } from '../notifications/mail.service';
import { LieuDocument } from '../lieux/schemas/lieu.schema';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateMouvementDto, UserPayloadDto, MouvementQueryDto } from './dto/mouvements.dto';
export declare class MouvementsService {
    private mouvementModel;
    private lieuModel;
    private userModel;
    private conflictService;
    private securityService;
    private mailService;
    private readonly logger;
    constructor(mouvementModel: Model<MouvementDocument>, lieuModel: Model<LieuDocument>, userModel: Model<UserDocument>, conflictService: MouvementsConflictService, securityService: MouvementsSecurityService, mailService: MailService);
    findAll(query?: MouvementQueryDto): Promise<Mouvement[]>;
    findById(id: string): Promise<MouvementDocument | null>;
    create(createDto: CreateMouvementDto, user: UserPayloadDto, forceConflict?: boolean): Promise<Mouvement>;
}
