import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  Put,
  Delete,
  Headers,
} from '@nestjs/common';
import { MouvementsService } from './mouvements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import type { AuthRequest } from '../analytics/analytics.controller';
import { CreateMouvementDto, MouvementQueryDto } from './dto/mouvements.dto';
import { Mouvement } from './schemas/mouvement.schema';

function getReferenceIds(value: unknown): string[] {
  const references: unknown[] = Array.isArray(value)
    ? (value as unknown[])
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
        toString: () => string;
      };
      const nestedId = item._id ?? item.id;
      if (nestedId !== undefined && nestedId !== reference) {
        return getReferenceIds(nestedId)[0] ?? '';
      }
      return item.toString();
    })
    .filter(Boolean);
}

@Controller('mouvements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MouvementsController {
  constructor(private readonly mouvementsService: MouvementsService) {}

  @Get()
  @RequirePermissions('VIEW_OWN_MOUVEMENTS') // Baseline permission
  async findAll(
    @Query() query: MouvementQueryDto,
    @Req() req: AuthRequest,
    @Headers('x-selected-country') headerPays?: string,
    @Headers('x-selected-base') headerBase?: string,
  ) {
    const user = req.user;
    const userRole =
      user?.profil || (user?.role as Record<string, unknown>)?.['name'];
    const isSuperAdmin =
      userRole === 'SuperAdmin' || userRole === 'Super Admin';

    // Context Country
    if (
      headerPays &&
      headerPays !== 'all' &&
      headerPays !== 'null' &&
      headerPays !== 'undefined'
    ) {
      // If not SuperAdmin, verify the requested country is in the user's allowed countries
      if (!isSuperAdmin) {
        const userPaysIds = getReferenceIds(user.pays as unknown);
        if (!userPaysIds.includes(headerPays)) {
          // Not allowed, fallback to allowed countries
          query['pays'] = { $in: userPaysIds };
        } else {
          query['pays'] = headerPays;
        }
      } else {
        query['pays'] = headerPays;
      }
    } else if (!isSuperAdmin && user && user.pays) {
      const userPaysIds = getReferenceIds(user.pays as unknown);
      query['pays'] = { $in: userPaysIds };
    }

    // Context Base
    if (
      headerBase &&
      headerBase !== 'all' &&
      headerBase !== 'null' &&
      headerBase !== 'undefined'
    ) {
      if (!isSuperAdmin) {
        const userBaseIds = getReferenceIds(user.base as unknown);
        if (!userBaseIds.includes(headerBase)) {
          query['base'] = { $in: userBaseIds };
        } else {
          query['base'] = headerBase;
        }
      } else {
        query['base'] = headerBase;
      }
    } else if (!isSuperAdmin && user && user.base) {
      const userBaseIds = getReferenceIds(user.base as unknown);
      query['base'] = { $in: userBaseIds };
    }

    return this.mouvementsService.findAll(query);
  }

  @Get('stats-by-status')
  async getStatsByStatus() {
    return this.mouvementsService.getStatsByStatus();
  }

  @Get('stats-by-vehicle')
  async getStatsByVehicle() {
    return this.mouvementsService.getStatsByVehicle();
  }

  @Get('planning')
  @RequirePermissions('VIEW_OWN_MOUVEMENTS') // Relaxed permission for planning
  async getPlanning(@Query('includePending') includePending: string) {
    return this.mouvementsService.getPlanning(includePending === 'true');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.mouvementsService.findById(id);
  }

  @Post()
  @RequirePermissions('CREATE_MOUVEMENT')
  async create(
    @Body() createMouvementDto: CreateMouvementDto,
    @Req() req: AuthRequest,
    @Query('force') force: string,
  ) {
    const forceConflict = force === 'true';

    return this.mouvementsService.create(
      createMouvementDto,
      req.user,
      forceConflict,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMouvementDto: Record<string, unknown>,
    @Req() req: AuthRequest,
  ) {
    return this.mouvementsService.update(id, updateMouvementDto, req.user);
  }

  @Put(':id/validate')
  async validateSecurity(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.mouvementsService.validateSecurity(id, req.user);
  }

  @Put(':id/revert-secu')
  async revertSecurityToDraft(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ) {
    return this.mouvementsService.revertSecurityToDraft(id, req.user);
  }

  @Put(':id/revert-log')
  async revertLogisticsToDraft(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ) {
    return this.mouvementsService.revertLogisticsToDraft(id, req.user);
  }

  @Delete('cleanup/ghosts')
  async cleanGhosts(): Promise<{ message: string }> {
    return this.mouvementsService.cleanGhosts();
  }

  @Post('fix-countries')
  async fixCountries(): Promise<{ message: string }> {
    return this.mouvementsService.fixCountries();
  }

  @Get('suggestions/:id')
  async getSuggestions(@Param('id') id: string) {
    return this.mouvementsService.getSuggestions(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Mouvement | null> {
    return this.mouvementsService.remove(id);
  }
}
