import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LogbookService } from './logbook.service';
import { LogbookSyncService } from './logbook-sync.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

import { SyncPayloadDto } from './dto/sync-payload.dto';
import type { AuthRequest } from '../analytics/analytics.controller';

@Controller('logbook')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LogbookController {
  constructor(
    private readonly logbookService: LogbookService,
    private readonly logbookSyncService: LogbookSyncService,
  ) {}

  @Get('my-trips')
  async getMyTrips(@Req() req: AuthRequest) {
    return this.logbookService.getMyTrips(req.user.id || req.user._id);
  }

  @Post('take-charge/:id')
  async takeCharge(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.logbookService.takeCharge(id, req.user.id || req.user._id);
  }

  @Post('sync')
  async syncData(
    @Body() payload: SyncPayloadDto,
  ): Promise<Record<string, any>> {
    return this.logbookSyncService.sync(payload);
  }

  // Les routes CRUD basiques Fuel/Incidents/Maintenances sont traitées dans d'autres controllers (ou ici si nécessaire)
}
