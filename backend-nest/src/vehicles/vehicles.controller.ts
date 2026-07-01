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

@Controller('vehicules')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Get()
  async findAll(@Req() req: AuthRequest) {
    const userRole =
      req.user?.profil ||
      (typeof req.user?.role === 'object' && req.user?.role !== null
        ? (req.user.role as { name?: string }).name
        : req.user?.role) ||
      'Unknown';
    const countryFilter: Record<string, any> = {};
    if ((userRole === 'Admin' || userRole === 'Superviseur') && req.user.pays) {
      countryFilter.pays =
        typeof req.user.pays === 'object' && req.user.pays !== null
          ? (req.user.pays as { _id?: string })._id
          : req.user.pays;
    }
    return this.vehiclesService.findAll(req.user, countryFilter);
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
