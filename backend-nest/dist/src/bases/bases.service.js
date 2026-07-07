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
exports.BasesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const base_schema_1 = require("./schemas/base.schema");
let BasesService = class BasesService {
    baseModel;
    constructor(baseModel) {
        this.baseModel = baseModel;
    }
    async findAll(query = {}) {
        return this.baseModel
            .find(query)
            .populate('pays', 'nom code')
            .sort('nom')
            .exec();
    }
    async findById(id) {
        return this.baseModel.findById(id).populate('pays', 'nom code').exec();
    }
    async create(createBaseDto, user) {
        const userRole = user?.profil ||
            (user?.role?.name ?? 'Unknown');
        if (userRole === 'Admin' && user.pays) {
            createBaseDto.pays = user.pays;
        }
        const base = new this.baseModel(createBaseDto);
        const savedBase = await base.save();
        return savedBase.populate('pays', 'nom code');
    }
    async update(id, updateBaseDto) {
        const base = await this.baseModel
            .findByIdAndUpdate(id, updateBaseDto, { new: true })
            .populate('pays', 'nom code')
            .exec();
        if (!base) {
            throw new common_1.NotFoundException('Base non trouvée');
        }
        return base;
    }
    async delete(id) {
        const base = await this.baseModel.findByIdAndDelete(id).exec();
        if (!base) {
            throw new common_1.NotFoundException('Base non trouvée');
        }
        return base;
    }
};
exports.BasesService = BasesService;
exports.BasesService = BasesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(base_schema_1.Base.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BasesService);
//# sourceMappingURL=bases.service.js.map