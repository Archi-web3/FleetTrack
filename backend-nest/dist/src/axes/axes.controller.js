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
exports.AxesController = void 0;
const common_1 = require("@nestjs/common");
const axes_service_1 = require("./axes.service");
const axes_dto_1 = require("./dto/axes.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let AxesController = class AxesController {
    axesService;
    constructor(axesService) {
        this.axesService = axesService;
    }
    async create(createAxeDto, req) {
        return this.axesService.create(createAxeDto, req);
    }
    async findAll(paysIdsStr, baseIdsStr) {
        const paysIds = paysIdsStr ? paysIdsStr.split(',') : [];
        const baseIds = baseIdsStr ? baseIdsStr.split(',') : [];
        return this.axesService.findAll({ paysIds, baseIds });
    }
    async findOne(id) {
        return this.axesService.findOne(id);
    }
    async update(id, updateAxeDto, req) {
        return this.axesService.update(id, updateAxeDto, req);
    }
    async remove(id, req) {
        return this.axesService.delete(id, req);
    }
};
exports.AxesController = AxesController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('CREATE_AXE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [axes_dto_1.CreateAxeDto, Object]),
    __metadata("design:returntype", Promise)
], AxesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('x-context-pays')),
    __param(1, (0, common_1.Headers)('x-context-base')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AxesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AxesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('UPDATE_AXE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, axes_dto_1.UpdateAxeDto, Object]),
    __metadata("design:returntype", Promise)
], AxesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('DELETE_AXE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AxesController.prototype, "remove", null);
exports.AxesController = AxesController = __decorate([
    (0, common_1.Controller)('axes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [axes_service_1.AxesService])
], AxesController);
//# sourceMappingURL=axes.controller.js.map