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
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const alert_schema_1 = require("./schemas/alert.schema");
let AlertsService = class AlertsService {
    alertModel;
    constructor(alertModel) {
        this.alertModel = alertModel;
    }
    async createAlert(data, userId) {
        const alert = new this.alertModel({
            ...data,
            createdBy: userId,
        });
        return alert.save();
    }
    async getAllAlerts() {
        return this.alertModel
            .find()
            .populate('createdBy', 'nom prenom')
            .sort({ createdAt: -1 })
            .exec();
    }
    async getAlertsForVehicle(vehicleId) {
        if (!vehicleId)
            return [];
        return this.alertModel
            .find({
            active: true,
            $or: [
                { targetType: 'all' },
                { targetType: 'vehicle', targetVehicleId: vehicleId },
            ],
            'deletedBy.vehicleId': { $ne: vehicleId },
        })
            .sort({ createdAt: -1 })
            .exec();
    }
    async markAsRead(alertId, vehicleId, userName) {
        const alert = await this.alertModel.findById(alertId);
        if (!alert)
            throw new common_1.NotFoundException('Alerte non trouvée');
        const alreadyRead = alert.readBy.some((r) => r.vehicleId === vehicleId);
        if (!alreadyRead) {
            alert.readBy.push({ vehicleId, readAt: new Date(), user: userName });
            await alert.save();
        }
        return alert;
    }
    async hideAlert(alertId, vehicleId) {
        const alert = await this.alertModel.findById(alertId);
        if (!alert)
            throw new common_1.NotFoundException('Alerte non trouvée');
        const alreadyHidden = alert.deletedBy.some((d) => d.vehicleId === vehicleId);
        if (!alreadyHidden) {
            alert.deletedBy.push({ vehicleId, deletedAt: new Date() });
            await alert.save();
        }
        return alert;
    }
    async deleteAlert(id) {
        const result = await this.alertModel.findByIdAndDelete(id);
        if (!result)
            throw new common_1.NotFoundException('Alerte non trouvée');
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(alert_schema_1.Alert.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map