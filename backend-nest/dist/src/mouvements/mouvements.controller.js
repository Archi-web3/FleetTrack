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
exports.MouvementsController = void 0;
const common_1 = require("@nestjs/common");
const mouvements_service_1 = require("./mouvements.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const mouvements_dto_1 = require("./dto/mouvements.dto");
let MouvementsController = class MouvementsController {
    mouvementsService;
    constructor(mouvementsService) {
        this.mouvementsService = mouvementsService;
    }
    async findAll(query, req, headerPays, headerBase) {
        const user = req.user;
        const userRole = user?.profil || user?.role?.['name'];
        const isSuperAdmin = userRole === 'SuperAdmin' || userRole === 'Super Admin';
        if (headerPays && headerPays !== 'all' && headerPays !== 'null' && headerPays !== 'undefined') {
            if (!isSuperAdmin) {
                const userPaysIds = Array.isArray(user.pays) ? user.pays.map((p) => p.id || p.toString()) : [];
                if (!userPaysIds.includes(headerPays)) {
                    query['pays'] = { $in: userPaysIds };
                }
                else {
                    query['pays'] = headerPays;
                }
            }
            else {
                query['pays'] = headerPays;
            }
        }
        else if (!isSuperAdmin && user && Array.isArray(user.pays) && user.pays.length > 0) {
            const userPaysIds = user.pays.map((p) => p.id || p.toString());
            query['pays'] = { $in: userPaysIds };
        }
        if (headerBase && headerBase !== 'all' && headerBase !== 'null' && headerBase !== 'undefined') {
            if (!isSuperAdmin) {
                const userBaseIds = Array.isArray(user.base) ? user.base.map((b) => b.id || b.toString()) : [];
                if (!userBaseIds.includes(headerBase)) {
                    query['base'] = { $in: userBaseIds };
                }
                else {
                    query['base'] = headerBase;
                }
            }
            else {
                query['base'] = headerBase;
            }
        }
        else if (!isSuperAdmin && user && Array.isArray(user.base) && user.base.length > 0) {
            const userBaseIds = user.base.map((b) => b.id || b.toString());
            query['base'] = { $in: userBaseIds };
        }
        return this.mouvementsService.findAll(query);
    }
    async getStatsByStatus() {
        return this.mouvementsService.getStatsByStatus();
    }
    async getStatsByVehicle() {
        return this.mouvementsService.getStatsByVehicle();
    }
    async getPlanning(includePending) {
        return this.mouvementsService.getPlanning(includePending === 'true');
    }
    async findOne(id) {
        return this.mouvementsService.findById(id);
    }
    async create(createMouvementDto, req, force) {
        const forceConflict = force === 'true';
        return this.mouvementsService.create(createMouvementDto, req.user, forceConflict);
    }
    async update(id, updateMouvementDto) {
        return this.mouvementsService.update(id, updateMouvementDto);
    }
    async validateSecurity(id, req) {
        return this.mouvementsService.validateSecurity(id, req.user);
    }
    async revertSecurityToDraft(id) {
        return this.mouvementsService.revertSecurityToDraft(id);
    }
    async revertLogisticsToDraft(id) {
        return this.mouvementsService.revertLogisticsToDraft(id);
    }
    async cleanGhosts() {
        return this.mouvementsService.cleanGhosts();
    }
    async fixCountries() {
        return this.mouvementsService.fixCountries();
    }
    async getSuggestions(id) {
        return this.mouvementsService.getSuggestions(id);
    }
    async remove(id) {
        return this.mouvementsService.remove(id);
    }
};
exports.MouvementsController = MouvementsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('VIEW_OWN_MOUVEMENTS'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Headers)('x-selected-country')),
    __param(3, (0, common_1.Headers)('x-selected-base')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mouvements_dto_1.MouvementQueryDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats-by-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "getStatsByStatus", null);
__decorate([
    (0, common_1.Get)('stats-by-vehicle'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "getStatsByVehicle", null);
__decorate([
    (0, common_1.Get)('planning'),
    (0, permissions_decorator_1.RequirePermissions)('VIEW_OWN_MOUVEMENTS'),
    __param(0, (0, common_1.Query)('includePending')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "getPlanning", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('CREATE_MOUVEMENT'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Query)('force')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mouvements_dto_1.CreateMouvementDto, Object, String]),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/validate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "validateSecurity", null);
__decorate([
    (0, common_1.Put)(':id/revert-secu'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "revertSecurityToDraft", null);
__decorate([
    (0, common_1.Put)(':id/revert-log'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "revertLogisticsToDraft", null);
__decorate([
    (0, common_1.Delete)('cleanup/ghosts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "cleanGhosts", null);
__decorate([
    (0, common_1.Post)('fix-countries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "fixCountries", null);
__decorate([
    (0, common_1.Get)('suggestions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "getSuggestions", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "remove", null);
exports.MouvementsController = MouvementsController = __decorate([
    (0, common_1.Controller)('mouvements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [mouvements_service_1.MouvementsService])
], MouvementsController);
//# sourceMappingURL=mouvements.controller.js.map