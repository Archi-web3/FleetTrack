import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { BasesService } from './bases.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateBaseDto, UpdateBaseDto } from './dto/bases.dto';
import type { AuthRequest } from '../analytics/analytics.controller';

@Controller('api/bases')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BasesController {
  constructor(
    private readonly basesService: BasesService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Get()
  async findAll(@Req() req: AuthRequest, @Query('pays') paysQuery: string) {
    const user = req.user;
    const userRole =
      user?.profil ||
      (((user?.role as Record<string, any>)?.name as string) ?? 'Unknown');
    const query: Record<string, any> = {};

    if ((userRole === 'Admin' || userRole === 'Superviseur') && user?.pays) {
      query.pays = user.pays;
    } else if (paysQuery) {
      query.pays = paysQuery;
    }

    return this.basesService.findAll(query);
  }

  @Post()
  @RequirePermissions('CREATE_BASE')
  async create(@Body() createBaseDto: CreateBaseDto, @Req() req: AuthRequest) {
    const base = await this.basesService.create(createBaseDto, req.user);
    await this.auditLogsService.logAction(
      req,
      'CREATE_BASE',
      'ADMIN',
      `Base: ${base.nom}`,
    );
    return base;
  }

  @Put(':id')
  @RequirePermissions('UPDATE_BASE')
  async update(
    @Param('id') id: string,
    @Body() updateBaseDto: UpdateBaseDto,
    @Req() req: AuthRequest,
  ) {
    const base = await this.basesService.update(id, updateBaseDto);
    await this.auditLogsService.logAction(
      req,
      'UPDATE_BASE',
      'ADMIN',
      `Base: ${base.nom}`,
    );
    return base;
  }

  @Delete(':id')
  @RequirePermissions('DELETE_BASE')
  async delete(@Param('id') id: string, @Req() req: AuthRequest) {
    const base = await this.basesService.delete(id);
    await this.auditLogsService.logAction(
      req,
      'DELETE_BASE',
      'ADMIN',
      `Base: ${base.nom}`,
    );
    return { message: 'Base supprimée avec succès' };
  }
}
