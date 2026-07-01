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
} from '@nestjs/common';
import { LieuxService } from './lieux.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { AuthRequest } from '../analytics/analytics.controller';
import { CreateLieuDto, UpdateLieuDto } from './dto/lieux.dto';

@Controller('api/lieux')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LieuxController {
  constructor(
    private readonly lieuxService: LieuxService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Get()
  async findAll(@Req() req: AuthRequest) {
    return this.lieuxService.findAll(req.user);
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
