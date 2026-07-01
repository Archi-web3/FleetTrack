/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { PaysService } from './pays.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Controller('api/pays')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PaysController {
  constructor(
    private readonly paysService: PaysService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Get()
  // Accessible par tous les utilisateurs connectés
  async findAll() {
    return this.paysService.findAll();
  }

  @Post()
  @RequirePermissions('CREATE_PAYS') // Remplace la vérif 'SuperAdmin' en dur
  async create(@Body() createPaysDto: any, @Req() req: any) {
    const pays = await this.paysService.create(createPaysDto);
    await this.auditLogsService.logAction(
      req,
      'CREATE_PAYS',
      'ADMIN',
      `Pays: ${pays.nom}`,
    );
    return pays;
  }

  @Put(':id')
  @RequirePermissions('UPDATE_PAYS')
  async update(
    @Param('id') id: string,
    @Body() updatePaysDto: any,
    @Req() req: any,
  ) {
    const pays = await this.paysService.update(id, updatePaysDto);
    await this.auditLogsService.logAction(
      req,
      'UPDATE_PAYS',
      'ADMIN',
      `Pays: ${pays.nom}`,
    );
    return pays;
  }

  @Delete(':id')
  @RequirePermissions('DELETE_PAYS')
  async delete(@Param('id') id: string, @Req() req: any) {
    const pays = await this.paysService.delete(id);
    await this.auditLogsService.logAction(
      req,
      'DELETE_PAYS',
      'ADMIN',
      `Pays: ${pays.nom}`,
    );
    return { message: 'Pays supprimé avec succès' };
  }
}
