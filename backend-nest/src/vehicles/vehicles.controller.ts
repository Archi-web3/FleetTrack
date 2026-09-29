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
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { Request } from 'express';
import { UserPayloadDto } from '../mouvements/dto/mouvements.dto';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicles.dto';
import { VehiculeDocument } from './schemas/vehicule.schema';

interface AuthRequest extends Request {
  user: UserPayloadDto;
}

function getReferenceIds(value: unknown): string[] {
  const references: unknown[] = Array.isArray(value)
    ? value
    : value === null || value === undefined
      ? []
      : [value];

  return references
    .map((reference) => {
      if (typeof reference === 'string' || typeof reference === 'number') {
        return String(reference);
      }
      if (typeof reference !== 'object' || reference === null) return '';

      const item = reference as {
        _id?: unknown;
        id?: unknown;
        toString?: () => string;
      };
      const nestedId = item._id ?? item.id;
      if (nestedId !== undefined && nestedId !== reference) {
        return getReferenceIds(nestedId)[0] ?? '';
      }
      return typeof item.toString === 'function' &&
        item.toString !== Object.prototype.toString
        ? item.toString()
        : '';
    })
    .filter(Boolean);
}

function isSelectedContextId(value?: string): value is string {
  return !!value && !['all', 'null', 'undefined'].includes(value);
}

@Controller('vehicules')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Get()
  async findAll(
    @Req() req: AuthRequest,
    @Headers('x-selected-country') selectedCountry?: string,
    @Headers('x-selected-base') selectedBase?: string,
  ) {
    const userRole =
      req.user?.profil ||
      (typeof req.user?.role === 'object' && req.user?.role !== null
        ? (req.user.role as { name?: string }).name
        : req.user?.role) ||
      'Unknown';
      const isSuperAdmin = userRole === 'SuperAdmin' || userRole === 'Super Admin';
      const filter: Record<string, any> = {};

      if (isSuperAdmin) {
        if (isSelectedContextId(selectedCountry)) filter.pays = selectedCountry;
        if (isSelectedContextId(selectedBase)) filter.base = selectedBase;
      } else {
        const allowedCountryIds = getReferenceIds(req.user?.pays);
        const allowedBaseIds = getReferenceIds(req.user?.base);

        if (allowedCountryIds.length > 0) {
          filter.pays = isSelectedContextId(selectedCountry) &&
            allowedCountryIds.includes(selectedCountry)
            ? selectedCountry
            : { $in: allowedCountryIds };
        }
        if (allowedBaseIds.length > 0) {
          filter.base = isSelectedContextId(selectedBase) &&
            allowedBaseIds.includes(selectedBase)
            ? selectedBase
            : { $in: allowedBaseIds };
      }
    }

      return this.vehiclesService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vehiclesService.findById(id);
  }

  @Post()
  @RequirePermissions('CREATE_VEHICLE') // Remplace SuperAdmin/Admin/Superviseur
  async create(
    @Body() createVehiculeDto: CreateVehicleDto,
    @Req() req: AuthRequest,
  ) {
    const vehicule = (await this.vehiclesService.create(
      createVehiculeDto,
    )) as unknown as VehiculeDocument;
    await this.auditLogsService.logAction(
      req,
      'CREATE_VEHICLE',
      'ADMIN',
      `Vehicle: ${vehicule.immatriculation}`,
      { brand: vehicule.marque, model: vehicule.modele },
    );
    return vehicule;
  }

  @Put(':id')
  @RequirePermissions('UPDATE_VEHICLE')
  async update(
    @Param('id') id: string,
    @Body() updateVehiculeDto: UpdateVehicleDto,
    @Req() req: AuthRequest,
  ) {
    const result = (await this.vehiclesService.update(
      id,
      updateVehiculeDto,
    )) as Record<string, any>;
    const vehicule = (result.vehicule || result) as VehiculeDocument;
    await this.auditLogsService.logAction(
      req,
      'UPDATE_VEHICLE',
      'ADMIN',
      `Vehicle: ${vehicule.immatriculation}`,
      { changes: updateVehiculeDto },
    );
    return result as unknown as VehiculeDocument;
  }

  @Delete(':id')
  @RequirePermissions('DELETE_VEHICLE')
  async delete(@Param('id') id: string, @Req() req: AuthRequest) {
    const vehicule = (await this.vehiclesService.delete(
      id,
    )) as unknown as VehiculeDocument;
    await this.auditLogsService.logAction(
      req,
      'DELETE_VEHICLE',
      'ADMIN',
      `Vehicle: ${vehicule.immatriculation}`,
      { brand: vehicule.marque },
    );
    return { message: 'Vehicule supprimé' };
  }
}
