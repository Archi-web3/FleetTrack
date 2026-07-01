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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const users_dto_1 = require("./dto/users.dto");
let UsersController = class UsersController {
    usersService;
    auditLogsService;
    constructor(usersService, auditLogsService) {
        this.usersService = usersService;
        this.auditLogsService = auditLogsService;
    }
    async findAll(req) {
        const user = req.user;
        const filter = {};
        if (user && user.profil === 'Admin' && user.pays) {
            filter.pays = user.pays;
        }
        return this.usersService.findAll(filter);
    }
    async findOne(id) {
        return this.usersService.findByIdWithPopulate(id);
    }
    async create(createUserDto, req) {
        const user = await this.usersService.create(createUserDto, req.user);
        await this.auditLogsService.logAction(req, 'CREATE_USER', 'ADMIN', `User: ${user.nom}`, { role: user.profil });
        return user;
    }
    async update(id, updateUserDto, req) {
        const user = await this.usersService.update(id, updateUserDto);
        await this.auditLogsService.logAction(req, 'UPDATE_USER', 'ADMIN', `User: ${user.nom}`, { changes: updateUserDto });
        return user;
    }
    async delete(id, req) {
        const user = await this.usersService.delete(id);
        await this.auditLogsService.logAction(req, 'DELETE_USER', 'ADMIN', `User: ${user.nom} (${user.email})`, { role: user.profil });
        return { message: 'Utilisateur supprimé' };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('CREATE_USER'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('UPDATE_USER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('DELETE_USER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('api/utilisateurs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        audit_logs_service_1.AuditLogsService])
], UsersController);
//# sourceMappingURL=users.controller.js.map