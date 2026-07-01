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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    auditLogsService;
    constructor(usersService, jwtService, auditLogsService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.auditLogsService = auditLogsService;
    }
    async validateUser(email, pass, req) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            await this.auditLogsService.logAction(req, 'LOGIN_FAILED', 'AUTH', `Email: ${email}`, { reason: 'User not found' });
            throw new common_1.UnauthorizedException('Identifiants invalides');
        }
        const isMatch = await user.comparePassword(pass);
        if (!isMatch) {
            await this.auditLogsService.logAction(req, 'LOGIN_FAILED', 'AUTH', `Email: ${email}`, { reason: 'Invalid password' });
            throw new common_1.UnauthorizedException('Identifiants invalides');
        }
        const result = user.toObject();
        delete result.motDePasse;
        return result;
    }
    async login(user, req) {
        if (!user._id)
            throw new common_1.UnauthorizedException('Utilisateur introuvable');
        const fullUser = await this.usersService.findByIdWithPopulate(user._id.toString());
        if (!fullUser)
            throw new common_1.UnauthorizedException('Utilisateur introuvable');
        const payload = {
            utilisateur: {
                id: fullUser._id.toString(),
                nom: fullUser.nom,
                profil: fullUser.profil,
                pays: fullUser.pays
                    ? {
                        id: fullUser.pays._id,
                        nom: fullUser.pays.nom,
                        code: fullUser.pays.code,
                    }
                    : null,
                base: fullUser.base
                    ? {
                        id: fullUser.base._id,
                        nom: fullUser.base.nom,
                    }
                    : null,
            },
        };
        await this.auditLogsService.logAction(req, 'LOGIN_SUCCESS', 'AUTH', `User: ${fullUser.nom}`, { email: fullUser.email, role: fullUser.profil });
        return {
            token: this.jwtService.sign(payload),
            user: {
                _id: fullUser._id,
                id: fullUser._id.toString(),
                nom: fullUser.nom,
                email: fullUser.email,
                profil: fullUser.profil,
                pays: payload.utilisateur.pays,
                base: payload.utilisateur.base,
            },
            message: 'Connexion réussie',
        };
    }
    async register(createUserDto) {
        const existingUser = await this.usersService.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.BadRequestException("L'utilisateur existe déjà");
        }
        const newUser = await this.usersService.create(createUserDto);
        const payload = {
            utilisateur: {
                id: newUser._id.toString(),
                nom: newUser.nom,
                profil: newUser.profil,
            },
        };
        return {
            token: this.jwtService.sign(payload),
            message: 'Utilisateur enregistré avec succès',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        audit_logs_service_1.AuditLogsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map