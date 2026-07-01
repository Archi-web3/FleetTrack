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
var LogbookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogbookService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fuel_schema_1 = require("./schemas/fuel.schema");
const incident_schema_1 = require("./schemas/incident.schema");
const mouvement_schema_1 = require("../mouvements/schemas/mouvement.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const maintenance_schema_1 = require("../maintenance/schemas/maintenance.schema");
let LogbookService = LogbookService_1 = class LogbookService {
    fuelModel;
    incidentModel;
    mouvementModel;
    userModel;
    maintenanceModel;
    logger = new common_1.Logger(LogbookService_1.name);
    constructor(fuelModel, incidentModel, mouvementModel, userModel, maintenanceModel) {
        this.fuelModel = fuelModel;
        this.incidentModel = incidentModel;
        this.mouvementModel = mouvementModel;
        this.userModel = userModel;
        this.maintenanceModel = maintenanceModel;
    }
    async getMyTrips(userId) {
        const user = await this.userModel.findById(userId);
        if (!user || user.profil !== 'Chauffeur') {
            return [];
        }
        return this.mouvementModel
            .find({
            chauffeur: userId,
            statut: { $in: ['validé', 'pris en charge', 'en cours', 'terminé'] },
        })
            .populate('vehicule')
            .populate('chauffeur')
            .populate('passagers')
            .populate('stops.lieu')
            .sort({ dateDepart: 1 })
            .exec();
    }
    async takeCharge(mouvementId, userId) {
        const user = await this.userModel.findById(userId);
        if (!user || user.profil !== 'Chauffeur') {
            throw new common_1.ForbiddenException('User is not a driver');
        }
        const movement = await this.mouvementModel.findById(mouvementId);
        if (!movement) {
            throw new common_1.NotFoundException('Movement not found');
        }
        if (movement.chauffeur.toString() !== userId) {
            throw new common_1.ForbiddenException('This movement is not assigned to you');
        }
        if (movement.statut !== 'validé') {
            throw new common_1.BadRequestException('Movement must be validated to take charge');
        }
        movement.statut = 'pris en charge';
        movement.takenInChargeAt = new Date();
        movement.takenInChargeBy = user._id.toString();
        await movement.save();
        return this.mouvementModel
            .findById(movement._id)
            .populate('vehicule chauffeur passagers stops.lieu')
            .exec();
    }
};
exports.LogbookService = LogbookService;
exports.LogbookService = LogbookService = LogbookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(fuel_schema_1.Fuel.name)),
    __param(1, (0, mongoose_1.InjectModel)(incident_schema_1.Incident.name)),
    __param(2, (0, mongoose_1.InjectModel)(mouvement_schema_1.Mouvement.name)),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(4, (0, mongoose_1.InjectModel)(maintenance_schema_1.Maintenance.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], LogbookService);
//# sourceMappingURL=logbook.service.js.map