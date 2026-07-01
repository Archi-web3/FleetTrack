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
exports.LieuxService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lieu_schema_1 = require("./schemas/lieu.schema");
const base_schema_1 = require("../bases/schemas/base.schema");
let LieuxService = class LieuxService {
    lieuModel;
    baseModel;
    constructor(lieuModel, baseModel) {
        this.lieuModel = lieuModel;
        this.baseModel = baseModel;
    }
    async findAll(user) {
        const query = {};
        const userRole = user?.profil ||
            (user?.role?.name ?? 'Unknown');
        if ((userRole === 'Admin' || userRole === 'Superviseur') && user.pays) {
            const basesInCountry = await this.baseModel
                .find({ pays: user.pays })
                .select('_id')
                .exec();
            const baseIds = basesInCountry.map((b) => b._id);
            query.base = { $in: baseIds };
        }
        return this.lieuModel.find(query).populate('pays').populate('base').exec();
    }
    async findById(id) {
        return this.lieuModel.findById(id).populate('pays').populate('base').exec();
    }
    async create(createLieuDto, user) {
        const userRole = user?.profil ||
            (user?.role?.name ?? 'Unknown');
        if (userRole !== 'SuperAdmin') {
            if (!createLieuDto.pays && user.pays) {
                createLieuDto.pays = user.pays;
            }
            if (!createLieuDto.base && user.base) {
                createLieuDto.base = user.base;
            }
        }
        const lieu = new this.lieuModel(createLieuDto);
        return lieu.save();
    }
    async update(id, updateLieuDto) {
        const lieu = await this.lieuModel
            .findByIdAndUpdate(id, updateLieuDto, { new: true })
            .exec();
        if (!lieu) {
            throw new common_1.NotFoundException('Lieu non trouvé');
        }
        return lieu;
    }
    async delete(id) {
        const lieu = await this.lieuModel.findByIdAndDelete(id).exec();
        if (!lieu) {
            throw new common_1.NotFoundException('Lieu non trouvé');
        }
        return lieu;
    }
};
exports.LieuxService = LieuxService;
exports.LieuxService = LieuxService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lieu_schema_1.Lieu.name)),
    __param(1, (0, mongoose_1.InjectModel)(base_schema_1.Base.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], LieuxService);
//# sourceMappingURL=lieux.service.js.map