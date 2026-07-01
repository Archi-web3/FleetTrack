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
exports.AnalyticsController = exports.AnalyticsQueryDto = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
class AnalyticsQueryDto {
    dateDebut;
    dateFin;
    projet;
    vehicule;
    startDate;
    endDate;
    vehicleId;
}
exports.AnalyticsQueryDto = AnalyticsQueryDto;
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getGlobalStats(query, req) {
        const filters = {
            dateDebut: query.dateDebut,
            dateFin: query.dateFin,
            projet: query.projet,
            vehicule: query.vehicule,
            countryId: req.user.pays,
        };
        return this.analyticsService.getGlobalStats(filters);
    }
    async getStatsByProject(query, req) {
        const filters = {
            dateDebut: query.dateDebut,
            dateFin: query.dateFin,
            projet: query.projet,
            vehicule: query.vehicule,
            countryId: req.user.pays,
        };
        return this.analyticsService.getStatsByProject(filters);
    }
    async getTCO(query, req) {
        const filters = {
            startDate: query.startDate,
            endDate: query.endDate,
            vehicleId: query.vehicleId,
            country: req.user.pays,
        };
        return this.analyticsService.calculateTCO(filters);
    }
    async getCostForecast(months, req) {
        return this.analyticsService.predictCosts(req.user.pays, months);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('global'),
    (0, permissions_decorator_1.RequirePermissions)('VIEW_DASHBOARD'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AnalyticsQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getGlobalStats", null);
__decorate([
    (0, common_1.Get)('par-projet'),
    (0, permissions_decorator_1.RequirePermissions)('VIEW_DASHBOARD'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AnalyticsQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getStatsByProject", null);
__decorate([
    (0, common_1.Get)('costs/tco'),
    (0, permissions_decorator_1.RequirePermissions)('VIEW_DASHBOARD'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AnalyticsQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTCO", null);
__decorate([
    (0, common_1.Get)('costs/forecast'),
    (0, permissions_decorator_1.RequirePermissions)('VIEW_DASHBOARD'),
    __param(0, (0, common_1.Query)('months')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCostForecast", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('api/analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map