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
exports.GenerateursController = void 0;
const common_1 = require("@nestjs/common");
const generateurs_service_1 = require("./generateurs.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let GenerateursController = class GenerateursController {
    generateursService;
    constructor(generateursService) {
        this.generateursService = generateursService;
    }
    async findAll() {
        return this.generateursService.findAll();
    }
    async getMaintenanceOverview() {
        return this.generateursService.getMaintenanceOverview();
    }
    async findOne(id) {
        return this.generateursService.findById(id);
    }
    async create(createGenerateurDto) {
        return this.generateursService.create(createGenerateurDto);
    }
    async update(id, updateGenerateurDto) {
        return this.generateursService.update(id, updateGenerateurDto);
    }
    async delete(id) {
        await this.generateursService.delete(id);
        return { message: 'Générateur supprimé' };
    }
    async getLogbooks(id) {
        return this.generateursService.getLogbooks(id);
    }
    async addLogbookEntry(id, logbookDto, req) {
        return this.generateursService.addLogbookEntry(id, logbookDto, req.user);
    }
};
exports.GenerateursController = GenerateursController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GenerateursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('maintenance/overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GenerateursController.prototype, "getMaintenanceOverview", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GenerateursController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenerateursController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GenerateursController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GenerateursController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(':id/logbooks'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GenerateursController.prototype, "getLogbooks", null);
__decorate([
    (0, common_1.Post)(':id/logbooks'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GenerateursController.prototype, "addLogbookEntry", null);
exports.GenerateursController = GenerateursController = __decorate([
    (0, common_1.Controller)('api/generateurs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [generateurs_service_1.GenerateursService])
], GenerateursController);
//# sourceMappingURL=generateurs.controller.js.map