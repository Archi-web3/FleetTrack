import { Controller, Get, Post, Body, Headers, Query, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { SecurityConfigService } from './security-config.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import type { AuthRequest } from '../analytics/analytics.controller';

@Controller('security-config')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SecurityConfigController {
  constructor(private readonly securityConfigService: SecurityConfigService) {}

  private getPaysId(req: AuthRequest, headerPays?: string): string {
    const userRole = req.user?.profil || (req.user?.role as any)?.name;
    if (userRole === 'SuperAdmin') {
      if (!headerPays || headerPays === 'null' || headerPays === 'undefined') {
        throw new BadRequestException("Veuillez sélectionner un pays spécifique dans le menu en haut pour configurer la matrice de sécurité.");
      }
      return headerPays;
    }
    return req.user?.pays?.toString() || headerPays || '';
  }

  @Get()
  async getConfig(
    @Req() req: AuthRequest,
    @Headers('x-selected-country') headerPays: string,
    @Query('baseId') baseId: string
  ) {
    const paysId = this.getPaysId(req, headerPays);
    if (!paysId || paysId === 'all') {
        throw new BadRequestException("Veuillez sélectionner un pays spécifique dans le menu en haut pour configurer la matrice de sécurité.");
    }
    return this.securityConfigService.getConfig(paysId, baseId);
  }

  @Post()
  async saveConfig(
    @Req() req: AuthRequest,
    @Headers('x-selected-country') headerPays: string,
    @Body() body: any
  ) {
    const paysId = this.getPaysId(req, headerPays);
    if (!paysId || paysId === 'all') {
        throw new BadRequestException("Veuillez sélectionner un pays spécifique");
    }
    const baseId = body.base;
    return this.securityConfigService.saveConfig(paysId, baseId, body, req.user._id.toString());
  }
}
