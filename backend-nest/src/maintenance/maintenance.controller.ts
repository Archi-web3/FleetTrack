import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ValidateTaskDto, CompleteServiceDto } from './dto/maintenance.dto';
import type { AuthRequest } from '../analytics/analytics.controller';

@Controller('maintenance')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get('stats')
  @RequirePermissions('VIEW_DASHBOARD')
  async getStats() {
    return this.maintenanceService.getStats();
  }

  @Get('weekly/current')
  async getCurrentWeeklyChecklist(
    @Query('vehicule') vehiculeId: string,
    @Req() req: AuthRequest,
  ) {
    return this.maintenanceService.getCurrentWeeklyChecklist(
      vehiculeId,
      req.user.id || req.user._id || '',
    );
  }

  @Post('weekly/validate-task')
  async validateWeeklyTask(@Body() body: ValidateTaskDto) {
    return this.maintenanceService.validateWeeklyTask(
      body.checklistId,
      body.tacheId,
      body.validee,
      body.commentaire,
    );
  }

  @Get('service/next')
  async getNextService(@Query('vehicule') vehiculeId: string) {
    return this.maintenanceService.getNextService(vehiculeId);
  }

  @Post('service/complete')
  @RequirePermissions('VALIDATE_MAINTENANCE')
  async completeService(
    @Body() body: CompleteServiceDto,
    @Req() req: AuthRequest,
  ) {
    return this.maintenanceService.completeService(
      body.serviceId,
      body.signature,
      req.user.id || req.user._id || '',
    );
  }
}
