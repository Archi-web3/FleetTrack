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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const vehicule_schema_1 = require("./schemas/vehicule.schema");
const maintenance_automation_service_1 = require("../maintenance/maintenance-automation.service");
let VehiclesService = class VehiclesService {
    vehiculeModel;
    maintenanceAutomationService;
    constructor(vehiculeModel, maintenanceAutomationService) {
        this.vehiculeModel = vehiculeModel;
        this.maintenanceAutomationService = maintenanceAutomationService;
    }
    async findAll(user, countryFilter) {
        const query = {
            ...countryFilter,
        };
        if (user && user.base) {
            query.base =
                typeof user.base === 'object' && user.base !== null
                    ? user.base._id
                    : user.base;
        }
        return this.vehiculeModel
            .find(query)
            .populate('base', 'nom code')
            .populate('pays', 'nom code')
            .populate('assignedDriverId', 'nom prenom')
            .exec();
    }
    async findById(id) {
        return this.vehiculeModel
            .findById(id)
            .populate('assignedDriverId', 'nom prenom')
            .exec();
    }
    async create(createVehiculeDto) {
        if (createVehiculeDto.kilometrageInitial &&
            !createVehiculeDto.kilometrage) {
            createVehiculeDto.kilometrage = createVehiculeDto.kilometrageInitial;
        }
        const vehicule = new this.vehiculeModel(createVehiculeDto);
        const nouveauVehicule = await vehicule.save();
        try {
            await this.maintenanceAutomationService.generateServiceSchedules(nouveauVehicule._id.toString(), nouveauVehicule.kilometrage);
        }
        catch (e) {
            const err = e;
            console.error('Erreur init maintenance:', err);
        }
        return nouveauVehicule;
    }
    async update(id, updateVehiculeDto) {
        const vehicule = await this.vehiculeModel.findById(id).exec();
        if (!vehicule) {
            throw new common_1.NotFoundException('Cannot find vehicle');
        }
        const oldKilometrage = vehicule.kilometrage;
        const oldInitialKm = vehicule.kilometrageInitial || 0;
        Object.assign(vehicule, updateVehiculeDto);
        const initialKmHasChanged = updateVehiculeDto.kilometrageInitial &&
            updateVehiculeDto.kilometrageInitial !== oldInitialKm;
        const kmNotExplicitlySet = !updateVehiculeDto.kilometrage ||
            updateVehiculeDto.kilometrage === oldKilometrage;
        if (initialKmHasChanged && kmNotExplicitlySet) {
            vehicule.kilometrage = vehicule.kilometrageInitial;
        }
        if (vehicule.kilometrageInitial &&
            vehicule.kilometrage < vehicule.kilometrageInitial) {
            vehicule.kilometrage = vehicule.kilometrageInitial;
        }
        const vehiculeMisAJour = await vehicule.save();
        const kmHasChanged = updateVehiculeDto.kilometrage &&
            updateVehiculeDto.kilometrage !== oldKilometrage;
        if (kmHasChanged || initialKmHasChanged) {
            try {
                const createdServices = await this.maintenanceAutomationService.generateServiceSchedules(vehiculeMisAJour._id.toString(), vehiculeMisAJour.kilometrage);
                await this.maintenanceAutomationService.updateServiceStatuses(vehiculeMisAJour._id.toString(), vehiculeMisAJour.kilometrage);
                return {
                    vehicule: vehiculeMisAJour,
                    servicesGeneres: createdServices.length,
                    services: createdServices,
                };
            }
            catch (e) {
                const err = e;
                console.error('Erreur génération maintenance:', err);
                return {
                    vehicule: vehiculeMisAJour,
                    maintenanceWarning: err.message,
                };
            }
        }
        return vehiculeMisAJour;
    }
    async delete(id) {
        const vehicule = await this.vehiculeModel.findByIdAndDelete(id).exec();
        if (!vehicule) {
            throw new common_1.NotFoundException('Cannot find vehicle');
        }
        return vehicule;
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(vehicule_schema_1.Vehicule.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => maintenance_automation_service_1.MaintenanceAutomationService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        maintenance_automation_service_1.MaintenanceAutomationService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map