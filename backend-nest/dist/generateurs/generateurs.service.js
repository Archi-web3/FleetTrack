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
exports.GenerateursService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const generateur_schema_1 = require("./schemas/generateur.schema");
const logbook_schema_1 = require("../logbook/schemas/logbook.schema");
let GenerateursService = class GenerateursService {
    generateurModel;
    logbookModel;
    constructor(generateurModel, logbookModel) {
        this.generateurModel = generateurModel;
        this.logbookModel = logbookModel;
    }
    async findAll() {
        return this.generateurModel
            .find()
            .populate('base', 'nom')
            .populate('pays', 'nom')
            .exec();
    }
    async findById(id) {
        return this.generateurModel
            .findById(id)
            .populate('base', 'nom')
            .populate('pays', 'nom')
            .exec();
    }
    async create(createGenerateurDto) {
        const generateur = new this.generateurModel(createGenerateurDto);
        return generateur.save();
    }
    async update(id, updateGenerateurDto) {
        const generateur = await this.generateurModel
            .findByIdAndUpdate(id, updateGenerateurDto, { new: true })
            .exec();
        if (!generateur) {
            throw new common_1.NotFoundException('Générateur introuvable');
        }
        return generateur;
    }
    async delete(id) {
        const generateur = await this.generateurModel.findByIdAndDelete(id).exec();
        if (!generateur) {
            throw new common_1.NotFoundException('Générateur introuvable');
        }
        return generateur;
    }
    async getLogbooks(generateurId) {
        return this.logbookModel
            .find({ generateur: generateurId })
            .populate('utilisateur', 'nom prenom')
            .sort({ dateReleve: -1 })
            .exec();
    }
    async addLogbookEntry(generateurId, logbookDto, user) {
        const gen = await this.generateurModel.findById(generateurId).exec();
        if (!gen) {
            throw new common_1.NotFoundException('Générateur introuvable');
        }
        logbookDto.generateur = gen._id;
        logbookDto.utilisateur = user._id || user.id;
        const log = new this.logbookModel(logbookDto);
        const savedLog = await log.save();
        if (log.heureFin > gen.heuresFonctionnement) {
            gen.heuresFonctionnement = log.heureFin;
        }
        const duree = log.heureFin - log.heureDebut;
        if (duree > 0 && log.carburantAjoute > 0) {
            const lph = log.carburantAjoute / duree;
            if (gen.consommationTheorique === 0) {
                gen.consommationTheorique = lph;
            }
            else {
                gen.consommationTheorique = (gen.consommationTheorique + lph) / 2;
            }
        }
        await gen.save();
        return savedLog;
    }
    async getMaintenanceOverview() {
        const generateurs = await this.generateurModel.find().exec();
        return generateurs.map((gen) => {
            const h = gen.heuresFonctionnement;
            let prochainService = 250;
            if (h >= 250 && h < 500)
                prochainService = 500;
            else if (h >= 500 && h < 1000)
                prochainService = 1000;
            else if (h >= 1000 && h < 3000)
                prochainService = 3000;
            else
                prochainService = Math.ceil((h + 1) / 250) * 250;
            const heuresRestantes = prochainService - h;
            return {
                _id: gen._id,
                marque: gen.marque,
                modele: gen.modele,
                numeroSerie: gen.numeroSerie,
                heuresActuelles: h,
                prochainService: prochainService,
                heuresRestantes: heuresRestantes,
                statut: heuresRestantes <= 0
                    ? 'En retard'
                    : heuresRestantes <= 50
                        ? 'Dû bientôt'
                        : 'À jour',
            };
        });
    }
};
exports.GenerateursService = GenerateursService;
exports.GenerateursService = GenerateursService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(generateur_schema_1.Generateur.name)),
    __param(1, (0, mongoose_1.InjectModel)(logbook_schema_1.GenerateurLogbook.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], GenerateursService);
//# sourceMappingURL=generateurs.service.js.map