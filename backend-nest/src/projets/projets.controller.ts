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
import { ProjetsService } from './projets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import type { AuthRequest } from '../analytics/analytics.controller';
import { CreateProjetDto, UpdateProjetDto } from './dto/projet.dto';

@Controller('api/projets')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjetsController {
  constructor(
    private readonly projetsService: ProjetsService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Get()
  async findAll(
    @Req() req: AuthRequest,
    @Query('includeInactifs') includeInactifs: string,
  ) {
    const filter: Record<string, any> =
      includeInactifs === 'true' ? {} : { actif: true };

    // countryFilter : si Admin/Superviseur on filtre par pays,
    // ou si req.selectedCountry était passé dans l'ancien système
    const userRole = req.user?.profil || req.user?.role || 'Unknown';
    if (
      (userRole === 'Admin' || userRole === 'Superviseur') &&
      req.user?.pays
    ) {
      // Assuming projet has a "pays" property if we want to filter by country.
      // The original schema had it implicitly, so we will filter if needed.
      filter.pays = req.user.pays;
    }

    return this.projetsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projetsService.findById(id);
  }

  @Post()
  @RequirePermissions('CREATE_PROJECT')
  async create(
    @Body() createProjetDto: CreateProjetDto,
    @Req() req: AuthRequest,
  ) {
    const projet = await this.projetsService.create(createProjetDto);
    await this.auditLogsService.logAction(
      req,
      'CREATE_PROJECT',
      'ADMIN',
      `Project: ${projet.nom}`,
      { code: projet.code },
    );
    return projet;
  }

  @Put(':id')
  @RequirePermissions('UPDATE_PROJECT')
  async update(
    @Param('id') id: string,
    @Body() updateProjetDto: UpdateProjetDto,
    @Req() req: AuthRequest,
  ) {
    const projet = await this.projetsService.update(id, updateProjetDto);
    await this.auditLogsService.logAction(
      req,
      'UPDATE_PROJECT',
      'ADMIN',
      `Project: ${projet.nom}`,
      { changes: updateProjetDto },
    );
    return projet;
  }

  @Delete(':id')
  @RequirePermissions('DELETE_PROJECT') // Était SuperAdmin uniquement, géré par le permission guard
  async delete(@Param('id') id: string, @Req() req: AuthRequest) {
    const projet = await this.projetsService.delete(id);
    await this.auditLogsService.logAction(
      req,
      'DELETE_PROJECT',
      'ADMIN',
      `Project: ${projet.nom} (${projet.code})`,
    );
    return { message: 'Projet supprimé avec succès' };
  }
}
