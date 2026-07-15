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
  Headers,
  Query,
} from '@nestjs/common';
import { LieuxService } from './lieux.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { AuthRequest } from '../analytics/analytics.controller';
import { CreateLieuDto, UpdateLieuDto } from './dto/lieux.dto';

@Controller('lieux')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LieuxController {
  constructor(
    private readonly lieuxService: LieuxService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Get()
  async findAll(
    @Req() req: AuthRequest,
    @Headers('x-selected-country') headerPays?: string,
    @Headers('x-selected-base') headerBase?: string,
    @Query('scope') scope?: string,
  ) {
    const user = req.user;
    const filter: Record<string, any> = {};
    const userRole = user?.profil || (user?.role as Record<string, unknown>)?.['name'];

    // If SuperAdmin, respect headers if set
    if (userRole === 'SuperAdmin' || userRole === 'Super Admin') {
      if (headerPays && headerPays !== 'all' && headerPays !== 'null' && headerPays !== 'undefined') {
        filter.pays = headerPays;
      }
      if (headerBase && headerBase !== 'all' && headerBase !== 'null' && headerBase !== 'undefined' && scope !== 'pays') {
        filter.base = headerBase;
      }
    } else if (user) {
      // Normal user (Admin, Superviseur, RP, Technicien...)
      if (headerBase && headerBase !== 'all' && headerBase !== 'null' && headerBase !== 'undefined' && scope !== 'pays') {
        filter.base = headerBase;
      } else if (user.pays) {
        const userPays = Array.isArray(user.pays) ? user.pays : [user.pays];
        filter.pays = { $in: userPays };
      }
    }

    return this.lieuxService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.lieuxService.findById(id);
  }

  @Post()
  @RequirePermissions('CREATE_LOCATION')
  async create(@Body() createLieuDto: CreateLieuDto, @Req() req: AuthRequest) {
    const lieu = await this.lieuxService.create(createLieuDto, req.user);
    await this.auditLogsService.logAction(
      req,
      'CREATE_LOCATION',
      'ADMIN',
      `Location: ${lieu.nom}`,
      { country: lieu.pays },
    );
    return lieu;
  }

  @Put(':id')
  @RequirePermissions('UPDATE_LOCATION')
  async update(
    @Param('id') id: string,
    @Body() updateLieuDto: UpdateLieuDto,
    @Req() req: AuthRequest,
  ) {
    const lieu = await this.lieuxService.update(id, updateLieuDto);
    await this.auditLogsService.logAction(
      req,
      'UPDATE_LOCATION',
      'ADMIN',
      `Location: ${lieu.nom}`,
      { changes: updateLieuDto },
    );
    return lieu;
  }

  @Delete(':id')
  @RequirePermissions('DELETE_LOCATION')
  async delete(@Param('id') id: string, @Req() req: AuthRequest) {
    const lieu = await this.lieuxService.delete(id);
    await this.auditLogsService.logAction(
      req,
      'DELETE_LOCATION',
      'ADMIN',
      `Location: ${lieu.nom}`,
    );
    return { message: 'Lieu supprimé' };
  }
}
