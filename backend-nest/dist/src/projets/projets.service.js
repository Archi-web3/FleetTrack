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
exports.ProjetsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const projet_schema_1 = require("./schemas/projet.schema");
let ProjetsService = class ProjetsService {
    projetModel;
    constructor(projetModel) {
        this.projetModel = projetModel;
    }
    async findAll(query = {}) {
        return this.projetModel.find(query).sort({ nom: 1 }).exec();
    }
    async findById(id) {
        return this.projetModel.findById(id).exec();
    }
    async create(createProjetDto) {
        const existant = await this.projetModel
            .findOne({ nom: createProjetDto.nom })
            .exec();
        if (existant) {
            throw new common_1.BadRequestException('Un projet avec ce nom existe déjà');
        }
        const projet = new this.projetModel(createProjetDto);
        return projet.save();
    }
    async update(id, updateProjetDto) {
        const projet = await this.projetModel.findById(id).exec();
        if (!projet) {
            throw new common_1.NotFoundException('Projet non trouvé');
        }
        if (updateProjetDto.nom && updateProjetDto.nom !== projet.nom) {
            const existant = await this.projetModel
                .findOne({ nom: updateProjetDto.nom, _id: { $ne: id } })
                .exec();
            if (existant) {
                throw new common_1.BadRequestException('Un projet avec ce nom existe déjà');
            }
        }
        const updated = await this.projetModel
            .findByIdAndUpdate(id, updateProjetDto, { new: true })
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException('Projet non trouvé lors de la mise à jour');
        }
        return updated;
    }
    async delete(id) {
        const projet = await this.projetModel.findByIdAndDelete(id).exec();
        if (!projet) {
            throw new common_1.NotFoundException('Projet non trouvé');
        }
        return projet;
    }
};
exports.ProjetsService = ProjetsService;
exports.ProjetsService = ProjetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(projet_schema_1.Projet.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProjetsService);
//# sourceMappingURL=projets.service.js.map