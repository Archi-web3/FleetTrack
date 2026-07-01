import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
export declare class UploadsService {
    private readonly logger;
    constructor();
    uploadImage(file: Express.Multer.File, folder: string, publicId: string): Promise<UploadApiResponse | UploadApiErrorResponse>;
    deleteImage(publicId: string): Promise<Record<string, any>>;
}
