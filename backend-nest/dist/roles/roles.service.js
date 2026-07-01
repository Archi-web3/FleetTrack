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
var RolesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const role_schema_1 = require("./schemas/role.schema");
let RolesService = RolesService_1 = class RolesService {
    roleModel;
    logger = new common_1.Logger(RolesService_1.name);
    constructor(roleModel) {
        this.roleModel = roleModel;
    }
    async onApplicationBootstrap() {
        this.logger.log('Vérification et Initialisation des Rôles Système...');
        await this.seedSystemRoles();
    }
    async seedSystemRoles() {
        const systemRoles = [
            {
                name: 'SuperAdmin',
                description: 'Accès total à toutes les fonctionnalités et paramètres du système.',
                permissions: ['ALL'],
                isSystemRole: true,
            },
            {
                name: 'Admin',
                description: 'Administrateur de base/pays. Gestion de la flotte et des utilisateurs locaux.',
                permissions: [
                    'CREATE_USER',
                    'UPDATE_USER',
                    'DELETE_USER',
                    'CREATE_VEHICLE',
                    'UPDATE_VEHICLE',
                    'DELETE_VEHICLE',
                    'CREATE_MOUVEMENT',
                    'VALIDATE_MOUVEMENT',
                    'UPDATE_MOUVEMENT',
                    'CREATE_LOCATION',
                    'UPDATE_LOCATION',
                ],
                isSystemRole: true,
            },
            {
                name: 'Superviseur',
                description: 'Superviseur logistique. Validation des mouvements et entretiens.',
                permissions: [
                    'CREATE_MOUVEMENT',
                    'VALIDATE_MOUVEMENT',
                    'UPDATE_MOUVEMENT',
                    'CREATE_LOCATION',
                ],
                isSystemRole: true,
            },
            {
                name: 'Chauffeur',
                description: 'Conducteur. Accès restreint au logbook et missions assignées.',
                permissions: ['VIEW_OWN_MOUVEMENTS', 'UPDATE_OWN_MOUVEMENTS_LOGBOOK'],
                isSystemRole: true,
            },
            {
                name: 'Demandeur',
                description: 'Utilisateur standard pouvant demander des mouvements.',
                permissions: ['CREATE_MOUVEMENT', 'VIEW_OWN_MOUVEMENTS'],
                isSystemRole: true,
            },
        ];
        for (const roleData of systemRoles) {
            const existingRole = await this.roleModel
                .findOne({ name: roleData.name })
                .exec();
            if (!existingRole) {
                const newRole = new this.roleModel(roleData);
                await newRole.save();
                this.logger.log(`✅ Rôle Système créé : ${roleData.name}`);
            }
            else {
            }
        }
    }
    async findAll() {
        return this.roleModel.find().exec();
    }
    async findByName(name) {
        return this.roleModel.findOne({ name }).exec();
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = RolesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(role_schema_1.Role.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RolesService);
//# sourceMappingURL=roles.service.js.map