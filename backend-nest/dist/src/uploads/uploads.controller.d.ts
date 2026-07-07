import { UploadsService } from './uploads.service';
export declare class UploadPhotoDto {
    type: string;
    recordId: string;
    country: string;
    base: string;
}
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadPhoto(file: Express.Multer.File, body: UploadPhotoDto): Promise<{
        url: string;
        publicId: string;
        format: string;
        width: number;
        height: number;
        size: number;
    }>;
    deletePhoto(publicId: string): Promise<{
        message: string;
    }>;
}
