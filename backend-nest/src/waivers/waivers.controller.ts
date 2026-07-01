import {
  Controller,
  Get,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WaiversService } from './waivers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CreateWaiverDto } from './dto/waivers.dto';

@Controller('waivers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WaiversController {
  constructor(private readonly waiversService: WaiversService) {}

  @Post()
  @UseInterceptors(FileInterceptor('signature'))
  async createWaiver(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateWaiverDto,
  ) {
    if (!file && !body.signatureUrl) {
      throw new BadRequestException(
        'La signature est obligatoire (fichier ou url)',
      );
    }
    return this.waiversService.createWaiver(body, file);
  }

  @Get()
  @RequirePermissions('MANAGE_FLEET') // Ou autre permission admin
  async getAllWaivers() {
    return this.waiversService.getAllWaivers();
  }

  @Delete(':id')
  @RequirePermissions('MANAGE_FLEET')
  async deleteWaiver(@Param('id') id: string) {
    await this.waiversService.deleteWaiver(id);
    return { message: 'Décharge supprimée avec succès' };
  }
}
