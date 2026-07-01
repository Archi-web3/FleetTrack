import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import type { AuthRequest } from '../analytics/analytics.controller';

@Controller('alerts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @RequirePermissions('MANAGE_FLEET')
  async createAlert(
    @Body() body: Record<string, any>,
    @Req() req: AuthRequest,
  ) {
    return this.alertsService.createAlert(
      body,
      req.user.id || req.user._id || '',
    );
  }

  @Get()
  @RequirePermissions('VIEW_DASHBOARD')
  async getAllAlerts() {
    return this.alertsService.getAllAlerts();
  }

  @Get('unread')
  async getUnreadAlerts(@Query('vehicleId') vehicleId: string) {
    return this.alertsService.getAlertsForVehicle(vehicleId);
  }

  @Post(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Body() body: { vehicleId: string },
    @Req() req: AuthRequest,
  ) {
    const userName = req.user
      ? `${req.user.prenom || ''} ${req.user.nom || ''}`.trim() ||
        'Chauffeur inconnu'
      : 'Chauffeur inconnu';
    return this.alertsService.markAsRead(id, body.vehicleId, userName);
  }

  @Put(':id/hide')
  async hideAlert(
    @Param('id') id: string,
    @Body() body: { vehicleId: string },
  ) {
    return this.alertsService.hideAlert(id, body.vehicleId);
  }

  @Delete(':id')
  @RequirePermissions('MANAGE_FLEET')
  async deleteAlert(@Param('id') id: string) {
    await this.alertsService.deleteAlert(id);
    return { message: 'Alerte supprimée' };
  }
}
