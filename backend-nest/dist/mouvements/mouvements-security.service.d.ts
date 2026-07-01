import { Model } from 'mongoose';
import { SecurityConfigDocument } from './schemas/security-config.schema';
import { UserDocument } from '../users/schemas/user.schema';
export declare class MouvementsSecurityService {
    private securityConfigModel;
    private userModel;
    private readonly logger;
    constructor(securityConfigModel: Model<SecurityConfigDocument>, userModel: Model<UserDocument>);
    calculateValidators(paysId: string, baseId: string | null, maxSecurityLevel: number): Promise<{
        mode: string;
        validators: any[];
    }>;
}
