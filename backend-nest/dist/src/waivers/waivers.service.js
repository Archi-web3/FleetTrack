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
exports.WaiversService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const waiver_schema_1 = require("./schemas/waiver.schema");
const uploads_service_1 = require("../uploads/uploads.service");
let WaiversService = class WaiversService {
    waiverModel;
    uploadsService;
    constructor(waiverModel, uploadsService) {
        this.waiverModel = waiverModel;
        this.uploadsService = uploadsService;
    }
    async createWaiver(data, file) {
        let signatureUrl = data.signatureUrl;
        if (file) {
            const publicId = `waiver_${Date.now()}`;
            const result = (await this.uploadsService.uploadImage(file, 'fleettrack/waivers', publicId));
            signatureUrl = result.secure_url;
        }
        const waiver = new this.waiverModel({
            visitorName: data.visitorName,
            signatureUrl: signatureUrl,
            vehicleId: data.vehicleId,
            tripId: data.tripId,
            legalTextVersion: data.legalTextVersion || 'v1.0',
        });
        return waiver.save();
    }
    async getAllWaivers() {
        return this.waiverModel
            .find()
            .populate('vehicleId', 'immatriculation marque modele')
            .populate('tripId', 'dateDepart statut')
            .sort({ signedAt: -1 })
            .exec();
    }
    async deleteWaiver(id) {
        const waiver = await this.waiverModel.findById(id);
        if (!waiver)
            throw new common_1.NotFoundException('Waiver non trouvé');
        await this.waiverModel.findByIdAndDelete(id);
    }
};
exports.WaiversService = WaiversService;
exports.WaiversService = WaiversService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(waiver_schema_1.Waiver.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        uploads_service_1.UploadsService])
], WaiversService);
//# sourceMappingURL=waivers.service.js.map