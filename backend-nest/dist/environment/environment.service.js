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
var EnvironmentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const environment_action_schema_1 = require("./schemas/environment-action.schema");
const environment_data_schema_1 = require("./schemas/environment-data.schema");
const fuel_schema_1 = require("../logbook/schemas/fuel.schema");
const mouvement_schema_1 = require("../mouvements/schemas/mouvement.schema");
let EnvironmentService = EnvironmentService_1 = class EnvironmentService {
    actionModel;
    dataModel;
    fuelModel;
    mouvementModel;
    logger = new common_1.Logger(EnvironmentService_1.name);
    constructor(actionModel, dataModel, fuelModel, mouvementModel) {
        this.actionModel = actionModel;
        this.dataModel = dataModel;
        this.fuelModel = fuelModel;
        this.mouvementModel = mouvementModel;
    }
    async getActions(year, base) {
        return this.actionModel.find({ year, base }).exec();
    }
    async createAction(data) {
        const action = new this.actionModel(data);
        return action.save();
    }
    async updateAction(id, data) {
        const updated = await this.actionModel.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!updated)
            throw new common_1.NotFoundException('Action non trouvée');
        return updated;
    }
    async deleteAction(id) {
        await this.actionModel.findByIdAndDelete(id);
    }
    async getData(year, base) {
        return this.dataModel.find({ year, base }).sort({ month: 1 }).exec();
    }
    async upsertData(data) {
        const { year, month, base } = data;
        return this.dataModel.findOneAndUpdate({ year, month, base }, data, {
            new: true,
            upsert: true,
        });
    }
    async aggregateStats(year, month, _base) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        const fuelStats = await this.fuelModel.aggregate([
            { $match: { date: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: null, totalLiters: { $sum: '$quantity' } } },
        ]);
        const kmStats = await this.mouvementModel.aggregate([
            {
                $match: {
                    dateDepart: { $gte: startDate, $lte: endDate },
                    statut: { $in: ['terminé', 'validé'] },
                },
            },
            {
                $group: {
                    _id: null,
                    totalKm: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $ne: ['$startMileage', null] },
                                        { $ne: ['$endMileage', null] },
                                    ],
                                },
                                { $subtract: ['$endMileage', '$startMileage'] },
                                0,
                            ],
                        },
                    },
                    nbMissions: { $sum: 1 },
                },
            },
        ]);
        return {
            fleet_liters_total: fuelStats[0]?.totalLiters || 0,
            fleet_km_total: kmStats[0]?.totalKm || 0,
            driver_nb_projects: 0,
        };
    }
};
exports.EnvironmentService = EnvironmentService;
exports.EnvironmentService = EnvironmentService = EnvironmentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(environment_action_schema_1.EnvironmentAction.name)),
    __param(1, (0, mongoose_1.InjectModel)(environment_data_schema_1.EnvironmentData.name)),
    __param(2, (0, mongoose_1.InjectModel)(fuel_schema_1.Fuel.name)),
    __param(3, (0, mongoose_1.InjectModel)(mouvement_schema_1.Mouvement.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], EnvironmentService);
//# sourceMappingURL=environment.service.js.map