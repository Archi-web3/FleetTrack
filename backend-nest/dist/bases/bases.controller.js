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
exports.BasesController = void 0;
const common_1 = require("@nestjs/common");
const bases_service_1 = require("./bases.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const bases_dto_1 = require("./dto/bases.dto");
let BasesController = class BasesController {
    basesService;
    auditLogsService;
    constructor(basesService, auditLogsService) {
        this.basesService = basesService;
        this.auditLogsService = auditLogsService;
    }
    async findAll(req, paysQuery) {
        const user = req.user;
        const userRole = user?.profil ||
            (user?.role?.name ?? 'Unknown');
        const query = {};
        if ((userRole === 'Admin' || userRole === 'Superviseur') && user?.pays) {
            query.pays = user.pays;
        }
        else if (paysQuery) {
            query.pays = paysQuery;
        }
        return this.basesService.findAll(query);
    }
    async create(createBaseDto, req) {
        const base = await this.basesService.create(createBaseDto, req.user);
        await this.auditLogsService.logAction(req, 'CREATE_BASE', 'ADMIN', `Base: ${base.nom}`);
        return base;
    }
    async update(id, updateBaseDto, req) {
        const base = await this.basesService.update(id, updateBaseDto);
        await this.auditLogsService.logAction(req, 'UPDATE_BASE', 'ADMIN', `Base: ${base.nom}`);
        return base;
    }
    async delete(id, req) {
        const base = await this.basesService.delete(id);
        await this.auditLogsService.logAction(req, 'DELETE_BASE', 'ADMIN', `Base: ${base.nom}`);
        return { message: 'Base supprimée avec succès' };
    }
};
exports.BasesController = BasesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('pays')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BasesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('CREATE_BASE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bases_dto_1.CreateBaseDto, Object]),
    __metadata("design:returntype", Promise)
], BasesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('UPDATE_BASE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bases_dto_1.UpdateBaseDto, Object]),
    __metadata("design:returntype", Promise)
], BasesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('DELETE_BASE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BasesController.prototype, "delete", null);
exports.BasesController = BasesController = __decorate([
    (0, common_1.Controller)('api/bases'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [bases_service_1.BasesService,
        audit_logs_service_1.AuditLogsService])
], BasesController);
//# sourceMappingURL=bases.controller.js.map