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
exports.MaintenanceController = void 0;
const common_1 = require("@nestjs/common");
const maintenance_service_1 = require("./maintenance.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const maintenance_dto_1 = require("./dto/maintenance.dto");
let MaintenanceController = class MaintenanceController {
    maintenanceService;
    constructor(maintenanceService) {
        this.maintenanceService = maintenanceService;
    }
    async getStats() {
        return this.maintenanceService.getStats();
    }
    async getCurrentWeeklyChecklist(vehiculeId, req) {
        return this.maintenanceService.getCurrentWeeklyChecklist(vehiculeId, req.user.id || req.user._id || '');
    }
    async validateWeeklyTask(body) {
        return this.maintenanceService.validateWeeklyTask(body.checklistId, body.tacheId, body.validee, body.commentaire);
    }
    async getNextService(vehiculeId) {
        return this.maintenanceService.getNextService(vehiculeId);
    }
    async completeService(body, req) {
        return this.maintenanceService.completeService(body.serviceId, body.signature, req.user.id || req.user._id || '');
    }
};
exports.MaintenanceController = MaintenanceController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, permissions_decorator_1.RequirePermissions)('VIEW_DASHBOARD'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('weekly/current'),
    __param(0, (0, common_1.Query)('vehicule')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "getCurrentWeeklyChecklist", null);
__decorate([
    (0, common_1.Post)('weekly/validate-task'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [maintenance_dto_1.ValidateTaskDto]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "validateWeeklyTask", null);
__decorate([
    (0, common_1.Get)('service/next'),
    __param(0, (0, common_1.Query)('vehicule')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "getNextService", null);
__decorate([
    (0, common_1.Post)('service/complete'),
    (0, permissions_decorator_1.RequirePermissions)('VALIDATE_MAINTENANCE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [maintenance_dto_1.CompleteServiceDto, Object]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "completeService", null);
exports.MaintenanceController = MaintenanceController = __decorate([
    (0, common_1.Controller)('api/maintenance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [maintenance_service_1.MaintenanceService])
], MaintenanceController);
//# sourceMappingURL=maintenance.controller.js.map