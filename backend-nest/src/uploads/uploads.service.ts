import { Injectable, Logger } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  constructor() {
    // Cloudinary config is automatically picked up from CLOUDINARY_URL environment variable if set.
    // Ensure you have CLOUDINARY_URL=cloudinary://my_key:my_secret@my_cloud_name in your .env
  }

  uploadImage(
    file: Express.Multer.File,
    folder: string,
    publicId: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(new Error(error.message || 'Upload error'));
          if (!result) return reject(new Error('No result returned'));
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<Record<string, any>> {
    try {
      const formattedPublicId = publicId.replace(/_/g, '/');
      const result = (await cloudinary.uploader.destroy(
        formattedPublicId,
      )) as Record<string, any>;
      return result;
    } catch (err) {
      this.logger.error('Error deleting image from Cloudinary', err);
      throw err;
    }
  }
}
