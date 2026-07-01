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
var MaintenanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const maintenance_config_schema_1 = require("./schemas/maintenance-config.schema");
const checklist_template_schema_1 = require("./schemas/checklist-template.schema");
const service_schedule_schema_1 = require("./schemas/service-schedule.schema");
const weekly_checklist_schema_1 = require("./schemas/weekly-checklist.schema");
const maintenance_schema_1 = require("./schemas/maintenance.schema");
const vehicule_schema_1 = require("../vehicles/schemas/vehicule.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let MaintenanceService = MaintenanceService_1 = class MaintenanceService {
    configModel;
    templateModel;
    scheduleModel;
    weeklyModel;
    maintenanceModel;
    vehiculeModel;
    userModel;
    logger = new common_1.Logger(MaintenanceService_1.name);
    constructor(configModel, templateModel, scheduleModel, weeklyModel, maintenanceModel, vehiculeModel, userModel) {
        this.configModel = configModel;
        this.templateModel = templateModel;
        this.scheduleModel = scheduleModel;
        this.weeklyModel = weeklyModel;
        this.maintenanceModel = maintenanceModel;
        this.vehiculeModel = vehiculeModel;
        this.userModel = userModel;
    }
    async getStats() {
        const totalVehicules = await this.vehiculeModel.countDocuments({
            enService: true,
        });
        const servicesDus = await this.scheduleModel.countDocuments({
            statut: { $in: ['Dû', 'En retard'] },
        });
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const semaine = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        const annee = now.getFullYear();
        const checklistsCompletees = await this.weeklyModel.countDocuments({
            semaine,
            annee,
            completee: true,
        });
        const checklistsRetard = Math.max(0, totalVehicules - checklistsCompletees);
        const allMaintenances = await this.maintenanceModel
            .find({ cost: { $exists: true, $gt: 0 } })
            .exec();
        let totalCost = 0;
        allMaintenances.forEach((m) => (totalCost += m.cost));
        const coutMoyen = totalVehicules > 0
            ? parseFloat((totalCost / totalVehicules).toFixed(2))
            : 0;
        return { totalVehicules, servicesDus, checklistsRetard, coutMoyen };
    }
    async getCurrentWeeklyChecklist(vehiculeId, userId) {
        if (!vehiculeId)
            throw new common_1.NotFoundException('Véhicule requis');
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const semaine = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        const annee = now.getFullYear();
        let checklist = await this.weeklyModel
            .findOne({ vehicule: vehiculeId, semaine, annee })
            .populate('vehicule chauffeur')
            .exec();
        if (!checklist) {
            const template = await this.templateModel
                .findOne({ type: 'Hebdomadaire', actif: true })
                .exec();
            if (!template)
                throw new common_1.NotFoundException('Template checklist non trouvé');
            checklist = new this.weeklyModel({
                vehicule: vehiculeId,
                semaine,
                annee,
                chauffeur: userId,
                taches: template.taches.map((t) => ({
                    numero: t.numero,
                    categorie: t.categorie,
                    description: t.description,
                    numeroTacheManuel: t.numeroTacheManuel,
                    validee: false,
                })),
                completee: false,
                tauxCompletion: 0,
            });
            await checklist.save();
            checklist = await this.weeklyModel
                .findById(checklist._id)
                .populate('vehicule chauffeur')
                .exec();
        }
        return checklist;
    }
    async validateWeeklyTask(checklistId, tacheId, validee, commentaire) {
        const checklist = await this.weeklyModel.findById(checklistId);
        if (!checklist)
            throw new common_1.NotFoundException('Checklist non trouvée');
        const tache = checklist.taches.id(tacheId);
        if (!tache)
            throw new common_1.NotFoundException('Tâche non trouvée');
        tache.validee = validee;
        tache.dateValidation = validee ? new Date() : null;
        if (commentaire)
            tache.commentaire = commentaire;
        const totalTaches = checklist.taches.length;
        const tachesValidees = checklist.taches.filter((t) => t.validee).length;
        checklist.tauxCompletion = Math.round((tachesValidees / totalTaches) * 100);
        checklist.completee = checklist.tauxCompletion === 100;
        if (checklist.completee && !checklist.dateCompletion) {
            checklist.dateCompletion = new Date();
        }
        else if (!checklist.completee) {
            checklist.dateCompletion = null;
        }
        await checklist.save();
        return checklist;
    }
    async getNextService(vehiculeId) {
        if (!vehiculeId)
            throw new common_1.NotFoundException('Véhicule requis');
        const vehicule = await this.vehiculeModel.findById(vehiculeId);
        if (!vehicule)
            throw new common_1.NotFoundException('Véhicule non trouvé');
        let service = await this.scheduleModel
            .findOne({ vehicule: vehiculeId, statut: { $ne: 'Complété' } })
            .sort({ kilometragePrevu: 1 })
            .exec();
        if (!service) {
            const config = await this.configModel
                .findOne({ typeVehicule: vehicule.type || 'Land Cruiser', actif: true })
                .exec();
            const intervalleService = config ? config.intervalleService : 5000;
            service = new this.scheduleModel({
                vehicule: vehiculeId,
                typeService: 'A',
                kilometragePrevu: intervalleService,
                kilometrageActuel: vehicule.kilometrage || 0,
                statut: 'À venir',
                prochainService: { type: 'B', kilometrage: intervalleService * 2 },
            });
        }
        const kmActuel = vehicule.kilometrage || 0;
        service.kilometrageActuel = kmActuel;
        if (kmActuel >= service.kilometragePrevu + 200)
            service.statut = 'En retard';
        else if (kmActuel >= service.kilometragePrevu)
            service.statut = 'Dû';
        else if (kmActuel >= service.kilometragePrevu - 500) {
            service.statut = 'À venir';
            if (!service.dateAlerte)
                service.dateAlerte = new Date();
        }
        await service.save();
        return service;
    }
    async completeService(serviceId, signature, userId) {
        const user = await this.userModel.findById(userId);
        if (!user ||
            !['Superviseur', 'Admin', 'SuperAdmin'].includes(user.profil)) {
            throw new common_1.ForbiddenException('Seuls les superviseurs peuvent valider les services');
        }
        const service = await this.scheduleModel
            .findById(serviceId)
            .populate('vehicule')
            .exec();
        if (!service)
            throw new common_1.NotFoundException('Service non trouvé');
        service.statut = 'Complété';
        service.dateCompletion = new Date();
        service.signature = {
            superviseur: user._id,
            date: new Date(),
            signatureData: signature,
        };
        const vehicule = service.vehicule;
        const config = await this.configModel
            .findOne({ typeVehicule: vehicule.type || 'Land Cruiser', actif: true })
            .exec();
        const intervalleService = config ? config.intervalleService : 5000;
        let prochainType = 'A';
        if (config &&
            config.sequenceMode === 'Custom' &&
            config.customSequence &&
            config.customSequence.length > 0) {
            const totalCompleted = await this.scheduleModel.countDocuments({
                vehicule: vehicule._id,
                statut: 'Complété',
            });
            prochainType =
                config.customSequence[totalCompleted % config.customSequence.length];
        }
        else {
            switch (service.typeService) {
                case 'A': {
                    const lastC = await this.scheduleModel
                        .findOne({
                        vehicule: vehicule._id,
                        typeService: 'C',
                        statut: 'Complété',
                    })
                        .sort({ dateCompletion: -1 });
                    const servicesDepuisC = await this.scheduleModel.countDocuments({
                        vehicule: vehicule._id,
                        statut: 'Complété',
                        dateCompletion: { $gt: lastC ? lastC.dateCompletion : new Date(0) },
                    });
                    prochainType = servicesDepuisC >= 3 ? 'C' : 'B';
                    break;
                }
                case 'B':
                case 'C':
                    prochainType = 'A';
                    break;
            }
        }
        await service.save();
        const prochainKm = service.kilometragePrevu + intervalleService;
        await this.scheduleModel.create({
            vehicule: vehicule._id,
            typeService: prochainType,
            kilometragePrevu: prochainKm,
            kilometrageActuel: service.kilometrageActuel,
            statut: 'À venir',
        });
        return service;
    }
};
exports.MaintenanceService = MaintenanceService;
exports.MaintenanceService = MaintenanceService = MaintenanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(maintenance_config_schema_1.MaintenanceConfig.name)),
    __param(1, (0, mongoose_1.InjectModel)(checklist_template_schema_1.ChecklistTemplate.name)),
    __param(2, (0, mongoose_1.InjectModel)(service_schedule_schema_1.ServiceSchedule.name)),
    __param(3, (0, mongoose_1.InjectModel)(weekly_checklist_schema_1.WeeklyChecklist.name)),
    __param(4, (0, mongoose_1.InjectModel)(maintenance_schema_1.Maintenance.name)),
    __param(5, (0, mongoose_1.InjectModel)(vehicule_schema_1.Vehicule.name)),
    __param(6, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], MaintenanceService);
//# sourceMappingURL=maintenance.service.js.map