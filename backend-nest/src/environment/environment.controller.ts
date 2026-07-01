import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EnvironmentService } from './environment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

import { EnvironmentActionDocument } from './schemas/environment-action.schema';
import { EnvironmentData } from './schemas/environment-data.schema';

@Controller('environment')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @Get('actions')
  @RequirePermissions('VIEW_DASHBOARD')
  async getActions(@Query('year') year: number, @Query('base') base: string) {
    return this.environmentService.getActions(year, base);
  }

  @Post('actions')
  @RequirePermissions('MANAGE_FLEET')
  async createAction(@Body() body: Record<string, any>) {
    return this.environmentService.createAction(body);
  }

  @Put('actions/:id')
  @RequirePermissions('MANAGE_FLEET')
  async updateAction(
    @Param('id') id: string,
    @Body() body: import('mongoose').UpdateQuery<EnvironmentActionDocument>,
  ) {
    return this.environmentService.updateAction(id, body);
  }

  @Delete('actions/:id')
  @RequirePermissions('MANAGE_FLEET')
  async deleteAction(@Param('id') id: string) {
    return this.environmentService.deleteAction(id);
  }

  @Get('data')
  @RequirePermissions('VIEW_DASHBOARD')
  async getData(@Query('year') year: number, @Query('base') base: string) {
    return this.environmentService.getData(year, base);
  }

  @Post('data')
  @RequirePermissions('MANAGE_FLEET')
  async upsertData(@Body() body: Partial<EnvironmentData>) {
    return this.environmentService.upsertData(body);
  }

  @Get('aggregate')
  @RequirePermissions('VIEW_DASHBOARD')
  async aggregateStats(
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('base') base: string,
  ) {
    return this.environmentService.aggregateStats(year, month, base);
  }
}
