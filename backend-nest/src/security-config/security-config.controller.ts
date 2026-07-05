import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Query,
  UseGuards,
  Req,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SecurityConfigService } from './security-config.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { UpdateSecurityConfigDto } from './dto/security-config.dto';
import type { AuthRequest } from '../analytics/analytics.controller';

@Controller('security-config')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SecurityConfigController {
  constructor(private readonly securityConfigService: SecurityConfigService) {}

  private getPaysId(req: AuthRequest, headerPays?: string): string {
    const userRole =
      req.user?.profil || (req.user?.role as Record<string, unknown>)?.['name'];
    if (userRole === 'SuperAdmin' || userRole === 'Super Admin') {
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
    @Query('baseId') baseId: string,
  ) {
    const paysId = this.getPaysId(req, headerPays);
    if (!paysId || paysId === 'all') {
      throw new BadRequestException('Veuillez sélectionner un pays spécifique');
    }
    return this.securityConfigService.getConfig(paysId, baseId);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async saveConfig(
    @Req() req: AuthRequest,
    @Headers('x-selected-country') headerPays: string,
    @Body() body: UpdateSecurityConfigDto,
  ) {
    const paysId = this.getPaysId(req, headerPays);
    if (!paysId || paysId === 'all') {
      throw new BadRequestException('Veuillez sélectionner un pays spécifique');
    }
    const baseId = body.base ?? null;
    return this.securityConfigService.saveConfig(
      paysId,
      baseId,
      body,
      String(req.user._id),
    );
  }
}
