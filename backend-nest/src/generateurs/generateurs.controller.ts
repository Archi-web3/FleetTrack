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
import { GenerateursService } from './generateurs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../analytics/analytics.controller';
import type { UpdateQuery } from 'mongoose';
import { GenerateurDocument } from './schemas/generateur.schema';

@Controller('generateurs')
@UseGuards(JwtAuthGuard)
export class GenerateursController {
  constructor(private readonly generateursService: GenerateursService) {}

  @Get()
  async findAll() {
    return this.generateursService.findAll();
  }

  @Get('maintenance/overview')
  async getMaintenanceOverview() {
    return this.generateursService.getMaintenanceOverview();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.generateursService.findById(id);
  }

  @Post()
  async create(@Body() createGenerateurDto: Record<string, any>) {
    return this.generateursService.create(createGenerateurDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGenerateurDto: UpdateQuery<GenerateurDocument>,
  ) {
    return this.generateursService.update(id, updateGenerateurDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.generateursService.delete(id);
    return { message: 'Générateur supprimé' };
  }

  // --- LOGBOOK ---
  @Get(':id/logbooks')
  async getLogbooks(@Param('id') id: string) {
    return this.generateursService.getLogbooks(id);
  }

  @Post(':id/logbooks')
  async addLogbookEntry(
    @Param('id') id: string,
    @Body() logbookDto: Record<string, any>,
    @Req() req: AuthRequest,
  ) {
    return this.generateursService.addLogbookEntry(id, logbookDto, req.user);
  }
}
