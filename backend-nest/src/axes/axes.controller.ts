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
} from '@nestjs/common';
import { AxesService } from './axes.service';
import { CreateAxeDto, UpdateAxeDto } from './dto/axes.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { extractContext } from '../utils/context.util';

@Controller('axes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AxesController {
  constructor(private readonly axesService: AxesService) {}

  @Post()
  @RequirePermissions({ resource: 'admin_security', action: 'create' })
  async create(@Body() createAxeDto: CreateAxeDto, @Req() req: any) {
    return this.axesService.create(createAxeDto, req.user);
  }

  @Get()
  async findAll(@Req() req: any) {
    const context = extractContext(req);
    return this.axesService.findAll(context);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.axesService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions({ resource: 'admin_security', action: 'update' })
  async update(
    @Param('id') id: string,
    @Body() updateAxeDto: UpdateAxeDto,
    @Req() req: any,
  ) {
    return this.axesService.update(id, updateAxeDto, req.user);
  }

  @Delete(':id')
  @RequirePermissions({ resource: 'admin_security', action: 'delete' })
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.axesService.delete(id, req.user);
  }
}
