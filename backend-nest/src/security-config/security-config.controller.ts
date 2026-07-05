import { Controller, Get, Post, Body, Headers, Query, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { SecurityConfigService } from './security-config.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import type { AuthRequest } from '../analytics/analytics.controller';

@Controller('security-config')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SecurityConfigController {
  constructor(private readonly securityConfigService: SecurityConfigService) {}

  private getPaysId(req: AuthRequest, headerPays?: string): string {
    const userRole = req.user?.profil || (req.user?.role as Record<string, unknown>)?.['name'];
    if (userRole === 'SuperAdmin') {
      if (!headerPays || headerPays === 'null' || headerPays === 'undefined') {
        return 'all'; // Default to all instead of throwing immediately on GET
      }
      return headerPays;
    }
    return req.user?.pays?.toString() || headerPays || 'all';
  }

  @Get()
  async getConfig(
    @Req() req: AuthRequest,
    @Headers('x-selected-country') headerPays: string,
    @Query('baseId') baseId: string
  ) {
    const paysId = this.getPaysId(req, headerPays);
    if (!paysId || paysId === 'all') {
        // Return an empty config instead of throwing 400 so the frontend can render the table
        return { pays: '', rules: [] };
    }
    return this.securityConfigService.getConfig(paysId, baseId);
  }

  @Post()
  async saveConfig(
    @Req() req: AuthRequest,
    @Headers('x-selected-country') headerPays: string,
    @Body() body: Record<string, unknown>
  ) {
    const paysId = this.getPaysId(req, headerPays);
    if (!paysId || paysId === 'all') {
        throw new BadRequestException("Veuillez sélectionner un pays spécifique");
    }
    const baseId = body['base'] as string | null;
    return this.securityConfigService.saveConfig(paysId, baseId, body, String(req.user._id));
  }
}
