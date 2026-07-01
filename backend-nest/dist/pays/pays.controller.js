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
exports.PaysController = void 0;
const common_1 = require("@nestjs/common");
const pays_service_1 = require("./pays.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let PaysController = class PaysController {
    paysService;
    auditLogsService;
    constructor(paysService, auditLogsService) {
        this.paysService = paysService;
        this.auditLogsService = auditLogsService;
    }
    async findAll() {
        return this.paysService.findAll();
    }
    async create(createPaysDto, req) {
        const pays = await this.paysService.create(createPaysDto);
        await this.auditLogsService.logAction(req, 'CREATE_PAYS', 'ADMIN', `Pays: ${pays.nom}`);
        return pays;
    }
    async update(id, updatePaysDto, req) {
        const pays = await this.paysService.update(id, updatePaysDto);
        await this.auditLogsService.logAction(req, 'UPDATE_PAYS', 'ADMIN', `Pays: ${pays.nom}`);
        return pays;
    }
    async delete(id, req) {
        const pays = await this.paysService.delete(id);
        await this.auditLogsService.logAction(req, 'DELETE_PAYS', 'ADMIN', `Pays: ${pays.nom}`);
        return { message: 'Pays supprimé avec succès' };
    }
};
exports.PaysController = PaysController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaysController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('CREATE_PAYS'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaysController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('UPDATE_PAYS'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaysController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('DELETE_PAYS'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaysController.prototype, "delete", null);
exports.PaysController = PaysController = __decorate([
    (0, common_1.Controller)('api/pays'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [pays_service_1.PaysService,
        audit_logs_service_1.AuditLogsService])
], PaysController);
//# sourceMappingURL=pays.controller.js.map