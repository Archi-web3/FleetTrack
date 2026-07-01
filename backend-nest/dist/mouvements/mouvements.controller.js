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
    async findAll(query) {
        return this.mouvementsService.findAll(query);
    }
    async findOne(id) {
        return this.mouvementsService.findById(id);
    }
    async create(createMouvementDto, req, force) {
        const forceConflict = force === 'true';
        return this.mouvementsService.create(createMouvementDto, req.user, forceConflict);
    }
};
exports.MouvementsController = MouvementsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('VIEW_OWN_MOUVEMENTS'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mouvements_dto_1.MouvementQueryDto]),
    __metadata("design:returntype", Promise)
], MouvementsController.prototype, "findAll", null);
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
exports.MouvementsController = MouvementsController = __decorate([
    (0, common_1.Controller)('api/mouvements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [mouvements_service_1.MouvementsService])
], MouvementsController);
//# sourceMappingURL=mouvements.controller.js.map