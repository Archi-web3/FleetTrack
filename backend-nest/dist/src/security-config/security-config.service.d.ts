import { Model } from 'mongoose';
import { SecurityConfigDocument } from '../mouvements/schemas/security-config.schema';
import { UpdateSecurityConfigDto } from './dto/security-config.dto';
export declare class SecurityConfigService {
    private securityConfigModel;
    constructor(securityConfigModel: Model<SecurityConfigDocument>);
    getConfig(paysId: string, baseId: string | null): Promise<SecurityConfigDocument>;
    saveConfig(paysId: string, baseId: string | null, data: UpdateSecurityConfigDto, userId: string): Promise<SecurityConfigDocument>;
}
