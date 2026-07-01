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
exports.ChauffeursController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const users_dto_1 = require("../users/dto/users.dto");
let ChauffeursController = class ChauffeursController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll() {
        return this.usersService.findAll({
            profil: { $in: ['Chauffeur', 'driver'] },
        });
    }
    async findOne(id) {
        const user = await this.usersService.findByIdWithPopulate(id);
        if (user && (user.profil === 'Chauffeur' || user.profil === 'driver')) {
            return user;
        }
        return null;
    }
    async create(createChauffeurDto, req) {
        createChauffeurDto.profil = 'Chauffeur';
        const nouveauChauffeur = await this.usersService.create(createChauffeurDto, req.user);
        const responseData = nouveauChauffeur.toObject();
        delete responseData.motDePasse;
        return responseData;
    }
    async update(id, updateChauffeurDto) {
        return this.usersService.update(id, updateChauffeurDto);
    }
    async delete(id) {
        await this.usersService.delete(id);
        return { message: 'Chauffeur supprimé' };
    }
};
exports.ChauffeursController = ChauffeursController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChauffeursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChauffeursController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('CREATE_USER'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], ChauffeursController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('UPDATE_USER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], ChauffeursController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('DELETE_USER'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChauffeursController.prototype, "delete", null);
exports.ChauffeursController = ChauffeursController = __decorate([
    (0, common_1.Controller)('api/chauffeurs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], ChauffeursController);
//# sourceMappingURL=chauffeurs.controller.js.map