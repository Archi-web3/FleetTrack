import {
  Controller,
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
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

export class UploadPhotoDto {
  type!: string;
  recordId!: string;
  country!: string;
  base!: string;
}

@Controller('upload')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Seules les images sont acceptées'),
            false,
          );
        }
      },
    }),
  )
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadPhotoDto,
  ) {
    if (!file) throw new BadRequestException('Aucun fichier fourni');

    const { type, recordId, country, base } = body;
    if (!type || !recordId || !country || !base) {
      throw new BadRequestException(
        'Paramètres manquants (type, recordId, country, base)',
      );
    }

    const date = new Date();
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const folder = `fleettrack/${country}/${base}/${type}/${yearMonth}`;
    const publicId = `${type}_${recordId}_${Date.now()}`;

    const result = await this.uploadsService.uploadImage(
      file,
      folder,
      publicId,
    );

    const res = result as {
      secure_url: string;
      public_id: string;
      format: string;
      width: number;
      height: number;
      bytes: number;
    };

    return {
      url: res.secure_url,
      publicId: res.public_id,
      format: res.format,
      width: res.width,
      height: res.height,
      size: res.bytes,
    };
  }

  @Delete(':publicId')
  async deletePhoto(@Param('publicId') publicId: string) {
    const result = await this.uploadsService.deleteImage(publicId);
    const res = result as { result: string };
    if (res.result === 'ok') {
      return { message: 'Photo supprimée avec succès' };
    } else {
      throw new BadRequestException('Photo non trouvée ou erreur Cloudinary');
    }
  }
}
