import { Controller, Get, Delete, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('audit')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @RequirePermissions('SuperAdmin', 'Super Admin')
  async getLogs(
    @Query('limit') limitStr?: string,
    @Query('category') category?: string,
    @Query('pays') pays?: string,
  ) {
    const limit = limitStr ? parseInt(limitStr, 10) : 50;
    return this.auditLogsService.getLogs(limit, category, pays);
  }

  @Delete()
  @RequirePermissions('SuperAdmin', 'Super Admin')
  async clearLogs() {
    await this.auditLogsService.clearLogs();
    return { message: 'Journal nettoyé avec succès' };
  }
}
