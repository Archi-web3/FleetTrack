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
exports.VehiclesController = void 0;
const common_1 = require("@nestjs/common");
const vehicles_service_1 = require("./vehicles.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const vehicles_dto_1 = require("./dto/vehicles.dto");
let VehiclesController = class VehiclesController {
    vehiclesService;
    auditLogsService;
    constructor(vehiclesService, auditLogsService) {
        this.vehiclesService = vehiclesService;
        this.auditLogsService = auditLogsService;
    }
    async findAll(req) {
        const userRole = req.user?.profil ||
            (typeof req.user?.role === 'object' && req.user?.role !== null
                ? req.user.role.name
                : req.user?.role) ||
            'Unknown';
        const countryFilter = {};
        if ((userRole === 'Admin' || userRole === 'Superviseur') && req.user.pays) {
            countryFilter.pays =
                typeof req.user.pays === 'object' && req.user.pays !== null
                    ? req.user.pays._id
                    : req.user.pays;
        }
        return this.vehiclesService.findAll(req.user, countryFilter);
    }
    async findOne(id) {
        return this.vehiclesService.findById(id);
    }
    async create(createVehiculeDto, req) {
        const vehicule = (await this.vehiclesService.create(createVehiculeDto));
        await this.auditLogsService.logAction(req, 'CREATE_VEHICLE', 'ADMIN', `Vehicle: ${vehicule.immatriculation}`, { brand: vehicule.marque, model: vehicule.modele });
        return vehicule;
    }
    async update(id, updateVehiculeDto, req) {
        const result = (await this.vehiclesService.update(id, updateVehiculeDto));
        const vehicule = (result.vehicule || result);
        await this.auditLogsService.logAction(req, 'UPDATE_VEHICLE', 'ADMIN', `Vehicle: ${vehicule.immatriculation}`, { changes: updateVehiculeDto });
        return result;
    }
    async delete(id, req) {
        const vehicule = (await this.vehiclesService.delete(id));
        await this.auditLogsService.logAction(req, 'DELETE_VEHICLE', 'ADMIN', `Vehicle: ${vehicule.immatriculation}`, { brand: vehicule.marque });
        return { message: 'Vehicule supprimé' };
    }
};
exports.VehiclesController = VehiclesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('CREATE_VEHICLE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vehicles_dto_1.CreateVehicleDto, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('UPDATE_VEHICLE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, vehicles_dto_1.UpdateVehicleDto, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('DELETE_VEHICLE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "delete", null);
exports.VehiclesController = VehiclesController = __decorate([
    (0, common_1.Controller)('api/vehicules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [vehicles_service_1.VehiclesService,
        audit_logs_service_1.AuditLogsService])
], VehiclesController);
//# sourceMappingURL=vehicles.controller.js.map