import { SecurityConfigService } from './security-config.service';
import { UpdateSecurityConfigDto } from './dto/security-config.dto';
import type { AuthRequest } from '../analytics/analytics.controller';
export declare class SecurityConfigController {
    private readonly securityConfigService;
    constructor(securityConfigService: SecurityConfigService);
    private getPaysId;
    getConfig(req: AuthRequest, headerPays: string, baseId: string): Promise<import("../mouvements/schemas/security-config.schema").SecurityConfigDocument>;
    saveConfig(req: AuthRequest, headerPays: string, body: UpdateSecurityConfigDto): Promise<import("../mouvements/schemas/security-config.schema").SecurityConfigDocument>;
}
