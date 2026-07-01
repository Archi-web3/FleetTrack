import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
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

  // Update logic to be expanded as needed for Status Updates
}
