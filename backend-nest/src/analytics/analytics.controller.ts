import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';

import { UserPayloadDto } from '../mouvements/dto/mouvements.dto';

export interface AuthRequest extends Request {
  user: UserPayloadDto;
}

export class AnalyticsQueryDto {
  dateDebut?: string;
  dateFin?: string;
  projet?: string;
  vehicule?: string;
  startDate?: string;
  endDate?: string;
  vehicleId?: string;
}
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('global')
  @RequirePermissions('VIEW_DASHBOARD')
  async getGlobalStats(
    @Query() query: AnalyticsQueryDto,
    @Req() req: AuthRequest,
  ) {
    const filters = {
      dateDebut: query.dateDebut,
      dateFin: query.dateFin,
      projet: query.projet,
      vehicule: query.vehicule,
      countryId: req.user.pays,
    };
    return this.analyticsService.getGlobalStats(filters);
  }

  @Get('par-projet')
  @RequirePermissions('VIEW_DASHBOARD')
  async getStatsByProject(
    @Query() query: AnalyticsQueryDto,
    @Req() req: AuthRequest,
  ) {
    const filters = {
      dateDebut: query.dateDebut,
      dateFin: query.dateFin,
      projet: query.projet,
      vehicule: query.vehicule,
      countryId: req.user.pays,
    };
    return this.analyticsService.getStatsByProject(filters);
  }

  @Get('costs/tco')
  @RequirePermissions('VIEW_DASHBOARD')
  async getTCO(@Query() query: AnalyticsQueryDto, @Req() req: AuthRequest) {
    const filters = {
      startDate: query.startDate,
      endDate: query.endDate,
      vehicleId: query.vehicleId,
      country: req.user.pays,
    };
    return this.analyticsService.calculateTCO(filters);
  }

  @Get('costs/forecast')
  @RequirePermissions('VIEW_DASHBOARD')
  async getCostForecast(
    @Query('months') months: number,
    @Req() req: AuthRequest,
  ) {
    return this.analyticsService.predictCosts(req.user.pays, months);
  }
}
