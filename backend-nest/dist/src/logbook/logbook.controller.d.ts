import { LogbookService } from './logbook.service';
import { LogbookSyncService } from './logbook-sync.service';
import { SyncPayloadDto } from './dto/sync-payload.dto';
import type { AuthRequest } from '../analytics/analytics.controller';
export declare class LogbookController {
    private readonly logbookService;
    private readonly logbookSyncService;
    constructor(logbookService: LogbookService, logbookSyncService: LogbookSyncService);
    getMyTrips(req: AuthRequest): Promise<import("../mouvements/schemas/mouvement.schema").Mouvement[]>;
    takeCharge(id: string, req: AuthRequest): Promise<import("../mouvements/schemas/mouvement.schema").Mouvement>;
    syncData(payload: SyncPayloadDto): Promise<Record<string, any>>;
}
