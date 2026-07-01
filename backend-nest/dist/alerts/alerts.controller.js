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
exports.AlertsController = void 0;
const common_1 = require("@nestjs/common");
const alerts_service_1 = require("./alerts.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let AlertsController = class AlertsController {
    alertsService;
    constructor(alertsService) {
        this.alertsService = alertsService;
    }
    async createAlert(body, req) {
        return this.alertsService.createAlert(body, req.user.id || req.user._id || '');
    }
    async getAllAlerts() {
        return this.alertsService.getAllAlerts();
    }
    async getUnreadAlerts(vehicleId) {
        return this.alertsService.getAlertsForVehicle(vehicleId);
    }
    async markAsRead(id, body, req) {
        const userName = req.user
            ? `${req.user.prenom || ''} ${req.user.nom || ''}`.trim() ||
                'Chauffeur inconnu'
            : 'Chauffeur inconnu';
        return this.alertsService.markAsRead(id, body.vehicleId, userName);
    }
    async hideAlert(id, body) {
        return this.alertsService.hideAlert(id, body.vehicleId);
    }
    async deleteAlert(id) {
        await this.alertsService.deleteAlert(id);
        return { message: 'Alerte supprimée' };
    }
};
exports.AlertsController = AlertsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('MANAGE_FLEET'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "createAlert", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('VIEW_DASHBOARD'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getAllAlerts", null);
__decorate([
    (0, common_1.Get)('unread'),
    __param(0, (0, common_1.Query)('vehicleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getUnreadAlerts", null);
__decorate([
    (0, common_1.Post)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Put)(':id/hide'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "hideAlert", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('MANAGE_FLEET'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "deleteAlert", null);
exports.AlertsController = AlertsController = __decorate([
    (0, common_1.Controller)('api/alerts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [alerts_service_1.AlertsService])
], AlertsController);
//# sourceMappingURL=alerts.controller.js.map