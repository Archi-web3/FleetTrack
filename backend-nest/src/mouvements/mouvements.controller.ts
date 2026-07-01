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
} from '@nestjs/common';
import { MouvementsService } from './mouvements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import type { AuthRequest } from '../analytics/analytics.controller';
import { CreateMouvementDto, MouvementQueryDto } from './dto/mouvements.dto';

@Controller('mouvements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MouvementsController {
  constructor(private readonly mouvementsService: MouvementsService) {}

  @Get()
  @RequirePermissions('VIEW_OWN_MOUVEMENTS') // Baseline permission
  async findAll(@Query() query: MouvementQueryDto) {
    // Inject auto country/base filtering logic later
    return this.mouvementsService.findAll(query);
  }

  @Get('stats-by-status')
  async getStatsByStatus() {
    return this.mouvementsService.getStatsByStatus();
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
  async update(@Param('id') id: string, @Body() updateMouvementDto: any) {
    return this.mouvementsService.update(id, updateMouvementDto);
  }

  @Put(':id/validate')
  async validateSecurity(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.mouvementsService.validateSecurity(id, req.user);
  }

  @Delete('cleanup/ghosts')
  async cleanGhosts() {
    return this.mouvementsService.cleanGhosts();
  }

  @Post('fix-countries')
  async fixCountries() {
    return this.mouvementsService.fixCountries();
  }

  @Get('suggestions/:id')
  async getSuggestions(@Param('id') id: string) {
    return this.mouvementsService.getSuggestions(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.mouvementsService.remove(id);
  }
}
