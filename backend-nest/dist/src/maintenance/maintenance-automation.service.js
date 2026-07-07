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
var MaintenanceAutomationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceAutomationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const service_schedule_schema_1 = require("../service-schedule/schemas/service-schedule.schema");
const checklist_template_schema_1 = require("../checklist-templates/schemas/checklist-template.schema");
const vehicule_schema_1 = require("../vehicles/schemas/vehicule.schema");
let MaintenanceAutomationService = MaintenanceAutomationService_1 = class MaintenanceAutomationService {
    serviceScheduleModel;
    checklistTemplateModel;
    vehiculeModel;
    logger = new common_1.Logger(MaintenanceAutomationService_1.name);
    constructor(serviceScheduleModel, checklistTemplateModel, vehiculeModel) {
        this.serviceScheduleModel = serviceScheduleModel;
        this.checklistTemplateModel = checklistTemplateModel;
        this.vehiculeModel = vehiculeModel;
    }
    async generateServiceSchedules(vehiculeId, currentKm) {
        try {
            const vehicule = await this.vehiculeModel.findById(vehiculeId);
            if (!vehicule) {
                throw new Error('Véhicule non trouvé');
            }
            const serviceInterval = 5000;
            const initialKm = vehicule.kilometrageInitial || 0;
            this.logger.log(`[MAINTENANCE-AUTO] Génération services pour ${vehicule.immatriculation}`);
            this.logger.log(` - Km initial: ${initialKm}, Km actuel: ${currentKm}, Intervalle: ${serviceInterval} km`);
            if (initialKm > 0) {
                const deleted = await this.serviceScheduleModel.deleteMany({
                    vehicule: vehiculeId,
                    kilometragePrevu: { $lt: initialKm },
                    statut: { $ne: 'Complété' },
                });
                if (deleted.deletedCount > 0) {
                    this.logger.log(` Nettoyage: ${deleted.deletedCount} service(s) obsolètes supprimés (< ${initialKm} km)`);
                }
            }
            const existingServices = await this.serviceScheduleModel
                .find({ vehicule: vehiculeId })
                .sort({ kilometragePrevu: 1 });
            const requiredServices = this.calculateServiceIntervals(initialKm, currentKm, serviceInterval);
            const createdServices = [];
            for (const requiredService of requiredServices) {
                const exists = existingServices.find((s) => s.kilometragePrevu === requiredService.km &&
                    s.typeService === requiredService.type);
                if (!exists) {
                    this.logger.log(` Création: Service ${requiredService.type} à ${requiredService.km} km`);
                    let taches = [];
                    try {
                        const template = await this.checklistTemplateModel.findOne({
                            type: `Service ${requiredService.type}`,
                            actif: true,
                        });
                        if (template && template.taches && template.taches.length > 0) {
                            taches = template.taches.map((t) => ({
                                description: t.description,
                                numeroTacheManuel: t.numeroTacheManuel || undefined,
                                categorie: t.categorie || undefined,
                                validee: false,
                                dateValidation: null,
                                commentaire: '',
                            }));
                        }
                    }
                    catch (templateError) {
                        this.logger.error(` Erreur chargement template: ${templateError.message}`);
                    }
                    const newService = await this.serviceScheduleModel.create({
                        vehicule: vehiculeId,
                        typeService: requiredService.type,
                        kilometragePrevu: requiredService.km,
                        kilometrageActuel: currentKm,
                        statut: this.determineStatut(currentKm, requiredService.km),
                        taches: taches,
                    });
                    createdServices.push(newService);
                }
            }
            return createdServices;
        }
        catch (error) {
            this.logger.error('Erreur génération services:', error);
            throw error;
        }
    }
    calculateServiceIntervals(initialKm, currentKm, interval) {
        const services = [];
        const milestones = [50000, 100000];
        let nextServiceKm = Math.ceil(initialKm / interval) * interval;
        if (nextServiceKm <= initialKm)
            nextServiceKm += interval;
        let serviceCounter = 0;
        while (nextServiceKm <= currentKm + interval) {
            const isMilestone = milestones.includes(nextServiceKm);
            if (isMilestone) {
                const milestoneType = nextServiceKm === 50000 ? '50K' : '100K';
                services.push({ type: milestoneType, km: nextServiceKm });
            }
            else {
                const serviceType = this.getNextServiceType(serviceCounter, interval);
                services.push({ type: serviceType, km: nextServiceKm });
            }
            serviceCounter++;
            nextServiceKm += interval;
        }
        return services;
    }
    getNextServiceType(counter, interval) {
        const kmValue = (counter + 1) * interval;
        if (kmValue % 50000 === 0 || kmValue % 100000 === 0)
            return 'A';
        if ((counter + 1) % 8 === 0)
            return 'C';
        if ((counter + 1) % 4 === 0)
            return 'B';
        return 'A';
    }
    determineStatut(currentKm, serviceKm) {
        const diff = serviceKm - currentKm;
        if (diff > 500)
            return 'À venir';
        if (diff >= -200)
            return 'Dû';
        return 'En retard';
    }
    async updateServiceStatuses(vehiculeId, currentKm) {
        const services = await this.serviceScheduleModel.find({
            vehicule: vehiculeId,
            statut: { $ne: 'Complété' },
        });
        let updated = 0;
        for (const service of services) {
            const newStatut = this.determineStatut(currentKm, service.kilometragePrevu);
            if (service.statut !== newStatut) {
                service.statut = newStatut;
                service.kilometrageActuel = currentKm;
                await service.save();
                updated++;
            }
        }
        return updated;
    }
};
exports.MaintenanceAutomationService = MaintenanceAutomationService;
exports.MaintenanceAutomationService = MaintenanceAutomationService = MaintenanceAutomationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(service_schedule_schema_1.ServiceSchedule.name)),
    __param(1, (0, mongoose_1.InjectModel)(checklist_template_schema_1.ChecklistTemplate.name)),
    __param(2, (0, mongoose_1.InjectModel)(vehicule_schema_1.Vehicule.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], MaintenanceAutomationService);
//# sourceMappingURL=maintenance-automation.service.js.map