import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  Headers,
} from '@nestjs/common';
import { AxesService } from './axes.service';
import { CreateAxeDto, UpdateAxeDto } from './dto/axes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('axes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AxesController {
  constructor(private readonly axesService: AxesService) {}

  @Post()
  @RequirePermissions('CREATE_AXE')
  async create(@Body() createAxeDto: CreateAxeDto, @Req() req: any) {
    return this.axesService.create(createAxeDto, req);
  }

  @Get()
  async findAll(
    @Headers('x-context-pays') paysIdsStr?: string,
    @Headers('x-context-base') baseIdsStr?: string,
  ) {
    const paysIds = paysIdsStr ? paysIdsStr.split(',') : [];
    const baseIds = baseIdsStr ? baseIdsStr.split(',') : [];
    return this.axesService.findAll({ paysIds, baseIds });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.axesService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('UPDATE_AXE')
  async update(
    @Param('id') id: string,
    @Body() updateAxeDto: UpdateAxeDto,
    @Req() req: any,
  ) {
    return this.axesService.update(id, updateAxeDto, req);
  }

  @Delete(':id')
  @RequirePermissions('DELETE_AXE')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.axesService.delete(id, req);
  }
}
