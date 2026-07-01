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
exports.LieuxController = void 0;
const common_1 = require("@nestjs/common");
const lieux_service_1 = require("./lieux.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const lieux_dto_1 = require("./dto/lieux.dto");
let LieuxController = class LieuxController {
    lieuxService;
    auditLogsService;
    constructor(lieuxService, auditLogsService) {
        this.lieuxService = lieuxService;
        this.auditLogsService = auditLogsService;
    }
    async findAll(req) {
        return this.lieuxService.findAll(req.user);
    }
    async findOne(id) {
        return this.lieuxService.findById(id);
    }
    async create(createLieuDto, req) {
        const lieu = await this.lieuxService.create(createLieuDto, req.user);
        await this.auditLogsService.logAction(req, 'CREATE_LOCATION', 'ADMIN', `Location: ${lieu.nom}`, { country: lieu.pays });
        return lieu;
    }
    async update(id, updateLieuDto, req) {
        const lieu = await this.lieuxService.update(id, updateLieuDto);
        await this.auditLogsService.logAction(req, 'UPDATE_LOCATION', 'ADMIN', `Location: ${lieu.nom}`, { changes: updateLieuDto });
        return lieu;
    }
    async delete(id, req) {
        const lieu = await this.lieuxService.delete(id);
        await this.auditLogsService.logAction(req, 'DELETE_LOCATION', 'ADMIN', `Location: ${lieu.nom}`);
        return { message: 'Lieu supprimé' };
    }
};
exports.LieuxController = LieuxController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LieuxController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LieuxController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('CREATE_LOCATION'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lieux_dto_1.CreateLieuDto, Object]),
    __metadata("design:returntype", Promise)
], LieuxController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('UPDATE_LOCATION'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lieux_dto_1.UpdateLieuDto, Object]),
    __metadata("design:returntype", Promise)
], LieuxController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('DELETE_LOCATION'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LieuxController.prototype, "delete", null);
exports.LieuxController = LieuxController = __decorate([
    (0, common_1.Controller)('api/lieux'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [lieux_service_1.LieuxService,
        audit_logs_service_1.AuditLogsService])
], LieuxController);
//# sourceMappingURL=lieux.controller.js.map