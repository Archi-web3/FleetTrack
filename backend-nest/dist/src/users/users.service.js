"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const bcrypt = __importStar(require("bcryptjs"));
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findByIdWithRole(id) {
        return this.userModel.findById(id).populate('role').exec();
    }
    async findByIdWithPopulate(id) {
        return this.userModel
            .findById(id)
            .populate('pays', 'nom code')
            .populate('base', 'nom')
            .exec();
    }
    async findAll(filter = {}) {
        return this.userModel
            .find(filter)
            .populate('pays base role')
            .select('-motDePasse')
            .exec();
    }
    async create(createUserDto, creator) {
        const creatorProfil = creator ? creator.profil : 'SuperAdmin';
        const targetProfil = createUserDto.profil;
        if (creatorProfil === 'Admin') {
            if (targetProfil === 'Admin' || targetProfil === 'SuperAdmin') {
                throw new common_1.BadRequestException("Un Admin ne peut pas créer d'autres Admins.");
            }
            if (creator.pays && Array.isArray(creator.pays) && creator.pays.length > 0) {
                createUserDto.pays = creator.pays;
            }
            else if (creator.pays && typeof creator.pays === 'string') {
                createUserDto.pays = [creator.pays];
            }
        }
        const createdUser = new this.userModel(createUserDto);
        try {
            return await createdUser.save();
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.BadRequestException('Cet email est déjà utilisé.');
            }
            throw error;
        }
    }
    async update(id, updateUserDto) {
        if (updateUserDto.motDePasse) {
            const salt = await bcrypt.genSalt(10);
            updateUserDto.motDePasse = await bcrypt.hash(updateUserDto.motDePasse, salt);
        }
        try {
            const updatedUser = await this.userModel
                .findByIdAndUpdate(id, updateUserDto, { new: true })
                .select('-motDePasse')
                .exec();
            if (!updatedUser) {
                throw new common_1.NotFoundException(`Cannot find user`);
            }
            return updatedUser;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.BadRequestException('Cet email est déjà utilisé par un autre utilisateur.');
            }
            throw error;
        }
    }
    async delete(id) {
        const user = await this.userModel.findByIdAndDelete(id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`Cannot find user`);
        }
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.Utilisateur.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map