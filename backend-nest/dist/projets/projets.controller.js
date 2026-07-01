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
exports.ProjetsController = void 0;
const common_1 = require("@nestjs/common");
const projets_service_1 = require("./projets.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const projet_dto_1 = require("./dto/projet.dto");
let ProjetsController = class ProjetsController {
    projetsService;
    auditLogsService;
    constructor(projetsService, auditLogsService) {
        this.projetsService = projetsService;
        this.auditLogsService = auditLogsService;
    }
    async findAll(req, includeInactifs) {
        const filter = includeInactifs === 'true' ? {} : { actif: true };
        const userRole = req.user?.profil || req.user?.role || 'Unknown';
        if ((userRole === 'Admin' || userRole === 'Superviseur') &&
            req.user?.pays) {
            filter.pays = req.user.pays;
        }
        return this.projetsService.findAll(filter);
    }
    async findOne(id) {
        return this.projetsService.findById(id);
    }
    async create(createProjetDto, req) {
        const projet = await this.projetsService.create(createProjetDto);
        await this.auditLogsService.logAction(req, 'CREATE_PROJECT', 'ADMIN', `Project: ${projet.nom}`, { code: projet.code });
        return projet;
    }
    async update(id, updateProjetDto, req) {
        const projet = await this.projetsService.update(id, updateProjetDto);
        await this.auditLogsService.logAction(req, 'UPDATE_PROJECT', 'ADMIN', `Project: ${projet.nom}`, { changes: updateProjetDto });
        return projet;
    }
    async delete(id, req) {
        const projet = await this.projetsService.delete(id);
        await this.auditLogsService.logAction(req, 'DELETE_PROJECT', 'ADMIN', `Project: ${projet.nom} (${projet.code})`);
        return { message: 'Projet supprimé avec succès' };
    }
};
exports.ProjetsController = ProjetsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('includeInactifs')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProjetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('CREATE_PROJECT'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [projet_dto_1.CreateProjetDto, Object]),
    __metadata("design:returntype", Promise)
], ProjetsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('UPDATE_PROJECT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, projet_dto_1.UpdateProjetDto, Object]),
    __metadata("design:returntype", Promise)
], ProjetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('DELETE_PROJECT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjetsController.prototype, "delete", null);
exports.ProjetsController = ProjetsController = __decorate([
    (0, common_1.Controller)('api/projets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [projets_service_1.ProjetsService,
        audit_logs_service_1.AuditLogsService])
], ProjetsController);
//# sourceMappingURL=projets.controller.js.map