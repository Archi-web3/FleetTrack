"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = exports.UploadPhotoDto = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const uploads_service_1 = require("./uploads.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
class UploadPhotoDto {
    type;
    recordId;
    country;
    base;
}
exports.UploadPhotoDto = UploadPhotoDto;
let UploadsController = class UploadsController {
    uploadsService;
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    async uploadPhoto(file, body) {
        if (!file)
            throw new common_1.BadRequestException('Aucun fichier fourni');
        const { type, recordId, country, base } = body;
        if (!type || !recordId || !country || !base) {
            throw new common_1.BadRequestException('Paramètres manquants (type, recordId, country, base)');
        }
        const date = new Date();
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const folder = `fleettrack/${country}/${base}/${type}/${yearMonth}`;
        const publicId = `${type}_${recordId}_${Date.now()}`;
        const result = await this.uploadsService.uploadImage(file, folder, publicId);
        const res = result;
        return {
            url: res.secure_url,
            publicId: res.public_id,
            format: res.format,
            width: res.width,
            height: res.height,
            size: res.bytes,
        };
    }
    async deletePhoto(publicId) {
        const result = await this.uploadsService.deleteImage(publicId);
        const res = result;
        if (res.result === 'ok') {
            return { message: 'Photo supprimée avec succès' };
        }
        else {
            throw new common_1.BadRequestException('Photo non trouvée ou erreur Cloudinary');
        }
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Seules les images sont acceptées'), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UploadPhotoDto]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Delete)(':publicId'),
    __param(0, (0, common_1.Param)('publicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "deletePhoto", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('api/upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map