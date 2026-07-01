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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const vehicule_schema_1 = require("../vehicles/schemas/vehicule.schema");
const fuel_schema_1 = require("../logbook/schemas/fuel.schema");
const maintenance_schema_1 = require("../maintenance/schemas/maintenance.schema");
const incident_schema_1 = require("../logbook/schemas/incident.schema");
const mouvement_schema_1 = require("../mouvements/schemas/mouvement.schema");
const settings_service_1 = require("../settings/settings.service");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    vehiculeModel;
    fuelModel;
    maintenanceModel;
    incidentModel;
    mouvementModel;
    settingsService;
    logger = new common_1.Logger(AnalyticsService_1.name);
    constructor(vehiculeModel, fuelModel, maintenanceModel, incidentModel, mouvementModel, settingsService) {
        this.vehiculeModel = vehiculeModel;
        this.fuelModel = fuelModel;
        this.maintenanceModel = maintenanceModel;
        this.incidentModel = incidentModel;
        this.mouvementModel = mouvementModel;
        this.settingsService = settingsService;
    }
    async getGlobalStats(filters) {
        const { dateDebut, dateFin, projet, vehicule, countryId } = filters;
        const matchFilter = {
            statut: 'terminé',
            type: { $ne: 'maintenance' },
        };
        if (dateDebut && dateFin) {
            const startDate = new Date(dateDebut);
            const endDate = new Date(dateFin);
            endDate.setHours(23, 59, 59, 999);
            matchFilter.$or = [
                { realDepartureTime: { $gte: startDate, $lte: endDate } },
                {
                    dateDepart: { $gte: startDate, $lte: endDate },
                    realDepartureTime: null,
                },
            ];
        }
        if (vehicule)
            matchFilter.vehicule = vehicule;
        if (countryId && countryId !== 'all') {
            if (countryId === 'none')
                matchFilter.$or = [{ pays: null }, { pays: { $exists: false } }];
            else
                matchFilter.pays = new mongoose_2.Types.ObjectId(countryId);
        }
        const co2FactorsStr = (await this.settingsService.getSetting('co2Factors'));
        const co2Factors = co2FactorsStr
            ? JSON.parse(co2FactorsStr)
            : { short: 230, medium: 178, long: 152 };
        const mouvements = await this.mouvementModel
            .find(matchFilter)
            .populate('stops.lieu');
        const totalVehicules = await this.vehiculeModel.countDocuments({});
        let kmTotauxRoutier = 0;
        let co2TotalRoutier = 0;
        let consommationTotale = 0;
        let nbRoutier = 0, nbAerien = 0, nbMaritime = 0;
        const co2Aerien = 0;
        let nbTrajetsCourts = 0;
        let kmMutualises = 0;
        let joursUtilisationTotaux = 0;
        mouvements.forEach((m) => {
            const mode = m.modeTransport || 'Routier';
            let partPonderation = 1;
            if (projet) {
                const ventil = (m.projetsVentilation && m.projetsVentilation.length > 0
                    ? m.projetsVentilation
                    : [{ projet: m.projet, percentage: 100 }]);
                const targetVentil = ventil.find((v) => v.projet === projet);
                if (!targetVentil)
                    return;
                partPonderation = targetVentil.percentage / 100;
            }
            if (m.dateDepart && m.dateArrivee) {
                const start = new Date(m.dateDepart).getTime();
                const end = new Date(m.dateArrivee).getTime();
                const durationDays = (end - start) / (1000 * 60 * 60 * 24);
                if (durationDays > 0)
                    joursUtilisationTotaux += durationDays * partPonderation;
            }
            if (mode === 'Routier') {
                nbRoutier++;
                let dist = 0;
                if (m.startMileage != null && m.endMileage != null)
                    dist = m.endMileage - m.startMileage;
                const distPonderee = dist * partPonderation;
                kmTotauxRoutier += distPonderee;
                if (dist > 0 && dist < 2)
                    nbTrajetsCourts++;
                const isShared = (m.passagers && m.passagers.length > 0) ||
                    (m.projetsVentilation && m.projetsVentilation.length > 1);
                if (isShared)
                    kmMutualises += distPonderee;
                const conso = (distPonderee / 100) * 8;
                consommationTotale += conso;
                co2TotalRoutier += conso * 2.3;
            }
            else if (mode === 'Aérien') {
                nbAerien++;
                if (m.stops && m.stops.length >= 2) {
                    for (let i = 0; i < m.stops.length - 1; i++) {
                        const s1 = m.stops[i]
                            .lieu;
                        const s2 = m.stops[i + 1]
                            .lieu;
                        if (s1 && s2 && s1.coordonnees && s2.coordonnees) {
                        }
                    }
                }
            }
            else if (mode === 'Maritime') {
                nbMaritime++;
            }
        });
        const pctTrajetsCourts = nbRoutier > 0 ? (nbTrajetsCourts / nbRoutier) * 100 : 0;
        const pctKmMutualises = kmTotauxRoutier > 0 ? (kmMutualises / kmTotauxRoutier) * 100 : 0;
        let tauxUtilisation = 0;
        if (totalVehicules > 0 && dateDebut && dateFin) {
            const periodDays = Math.max(1, (new Date(dateFin).getTime() - new Date(dateDebut).getTime()) /
                (1000 * 60 * 60 * 24));
            const capaciteTheoriqueJours = totalVehicules * periodDays;
            if (capaciteTheoriqueJours > 0)
                tauxUtilisation =
                    (joursUtilisationTotaux / capaciteTheoriqueJours) * 100;
        }
        return {
            kmTotaux: Math.round(kmTotauxRoutier),
            co2Total: Math.round(co2TotalRoutier),
            co2Flotte: Math.round(co2TotalRoutier),
            co2Aerien: Math.round(co2Aerien),
            consommationTotale: Math.round(consommationTotale),
            nombreMouvements: nbRoutier + nbAerien + nbMaritime,
            repartitionModes: {
                routier: nbRoutier,
                aerien: nbAerien,
                maritime: nbMaritime,
            },
            indicateursAvances: {
                trajetsCourts: {
                    count: nbTrajetsCourts,
                    pourcentage: Math.round(pctTrajetsCourts),
                },
                kmMutualises: {
                    km: Math.round(kmMutualises),
                    pourcentage: Math.round(pctKmMutualises),
                },
                tauxUtilisation: Math.round(tauxUtilisation),
            },
        };
    }
    async getStatsByProject(filters) {
        const { dateDebut, dateFin, vehicule, projet, countryId } = filters;
        const matchFilter = {
            statut: 'terminé',
            type: { $ne: 'maintenance' },
        };
        if (dateDebut && dateFin) {
            const startDate = new Date(dateDebut);
            const endDate = new Date(dateFin);
            endDate.setHours(23, 59, 59, 999);
            matchFilter.$or = [
                { realDepartureTime: { $gte: startDate, $lte: endDate } },
                {
                    dateDepart: { $gte: startDate, $lte: endDate },
                    realDepartureTime: null,
                },
            ];
        }
        if (countryId && countryId !== 'all') {
            if (countryId === 'none')
                matchFilter.$or = [{ pays: null }, { pays: { $exists: false } }];
            else
                matchFilter.pays = new mongoose_2.Types.ObjectId(countryId);
        }
        if (vehicule)
            matchFilter.vehicule = new mongoose_2.Types.ObjectId(vehicule);
        const pipeline = [
            { $match: matchFilter },
            {
                $lookup: {
                    from: 'vehicules',
                    localField: 'vehicule',
                    foreignField: '_id',
                    as: 'vehiculeInfo',
                },
            },
            { $unwind: { path: '$vehiculeInfo', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    effectiveVentilation: {
                        $cond: {
                            if: {
                                $and: [
                                    { $isArray: '$projetsVentilation' },
                                    { $gt: [{ $size: '$projetsVentilation' }, 0] },
                                ],
                            },
                            then: '$projetsVentilation',
                            else: [
                                {
                                    projet: { $ifNull: ['$projet', 'Non assigné'] },
                                    percentage: 100,
                                },
                            ],
                        },
                    },
                    rawKm: {
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
            },
            { $unwind: '$effectiveVentilation' },
            {
                $group: {
                    _id: '$effectiveVentilation.projet',
                    kmTotaux: {
                        $sum: {
                            $multiply: [
                                '$rawKm',
                                { $divide: ['$effectiveVentilation.percentage', 100] },
                            ],
                        },
                    },
                    kmInvolved: { $sum: '$rawKm' },
                    nombreMouvements: { $sum: 1 },
                    tauxRemplissageTotal: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gt: ['$vehiculeInfo.capacitePassagers', 0] },
                                        { $isArray: '$passagers' },
                                    ],
                                },
                                {
                                    $multiply: [
                                        {
                                            $divide: [
                                                { $size: '$passagers' },
                                                '$vehiculeInfo.capacitePassagers',
                                            ],
                                        },
                                        100,
                                    ],
                                },
                                0,
                            ],
                        },
                    },
                    mouvementsAvecVehicule: {
                        $sum: {
                            $cond: [{ $gt: ['$vehiculeInfo.capacitePassagers', 0] }, 1, 0],
                        },
                    },
                },
            },
            { $sort: { kmTotaux: -1 } },
        ];
        if (projet)
            pipeline.push({ $match: { _id: projet } });
        const resultats = await this.mouvementModel.aggregate(pipeline);
        const totalKm = resultats.reduce((sum, r) => sum + r.kmTotaux, 0);
        const totalConsommation = (totalKm / 100) * 8;
        const totalCO2 = totalConsommation * 2.3;
        const statsParProjet = resultats.map((r) => {
            const consommation = (r.kmTotaux / 100) * 8;
            const co2 = consommation * 2.3;
            const tauxRemplissageMoyen = r.mouvementsAvecVehicule > 0
                ? r.tauxRemplissageTotal / r.mouvementsAvecVehicule
                : 0;
            return {
                projet: r._id,
                kmTotaux: Math.round(r.kmTotaux),
                kmInvolved: Math.round(r.kmInvolved || 0),
                co2Total: Math.round(co2),
                consommationTotale: Math.round(consommation),
                nombreMouvements: r.nombreMouvements,
                ratioKm: totalKm > 0 ? (r.kmTotaux / totalKm) * 100 : 0,
                ratioCO2: totalCO2 > 0 ? (co2 / totalCO2) * 100 : 0,
                ratioConsommation: totalConsommation > 0 ? (consommation / totalConsommation) * 100 : 0,
                tauxRemplissageMoyen: Math.round(tauxRemplissageMoyen * 10) / 10,
            };
        });
        return {
            global: {
                kmTotaux: Math.round(totalKm),
                co2Total: Math.round(totalCO2),
                consommationTotale: Math.round(totalConsommation),
            },
            parProjet: statsParProjet,
        };
    }
    async calculateTCO(filters) {
        const { startDate, endDate, vehicleId, country } = filters;
        const dateQuery = {};
        if (startDate || endDate) {
            dateQuery.date = {
                ...(startDate ? { $gte: new Date(startDate) } : {}),
                ...(endDate ? { $lte: new Date(endDate) } : {}),
            };
        }
        const matchStage = {};
        if (vehicleId)
            matchStage.vehicule = new mongoose_2.Types.ObjectId(vehicleId);
        const fuelCosts = await this.fuelModel.aggregate([
            { $match: { ...dateQuery, ...matchStage } },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$price' },
                    totalLitres: { $sum: '$quantity' },
                },
            },
        ]);
        const maintCosts = await this.maintenanceModel.aggregate([
            { $match: { ...dateQuery, ...matchStage } },
            { $group: { _id: null, total: { $sum: '$cost' } } },
        ]);
        const incidentCosts = await this.incidentModel.aggregate([
            { $match: { ...dateQuery, ...matchStage, cost: { $exists: true } } },
            { $group: { _id: null, total: { $sum: '$cost' } } },
        ]);
        const vehicleQuery = {};
        if (vehicleId)
            vehicleQuery._id = vehicleId;
        if (country)
            vehicleQuery.pays = country;
        const vehicles = await this.vehiculeModel.find(vehicleQuery);
        let fixedCostsTotal = 0;
        let durationMonths = 1;
        if (startDate && endDate) {
            const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
            durationMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
        }
        for (const v of vehicles) {
            if (v.typePropriete === 'ACF' &&
                v.purchaseValue &&
                v.depreciationMonths) {
                fixedCostsTotal +=
                    (v.purchaseValue / v.depreciationMonths) * durationMonths;
            }
            if (v.insuranceCost)
                fixedCostsTotal += (v.insuranceCost / 12) * durationMonths;
            if (v.typePropriete === 'Location' && v.rentalCost)
                fixedCostsTotal += v.rentalCost * durationMonths;
        }
        const totalFuel = fuelCosts[0]?.total || 0;
        const totalMaint = maintCosts[0]?.total || 0;
        const totalIncidents = incidentCosts[0]?.total || 0;
        return {
            totalCost: totalFuel + totalMaint + totalIncidents + fixedCostsTotal,
            breakdown: {
                fuel: totalFuel,
                maintenance: totalMaint,
                incidents: totalIncidents,
                fixed: fixedCostsTotal,
            },
            vehicleCount: vehicles.length,
        };
    }
    async predictCosts(countryId, months = 1) {
        const userQuery = countryId && countryId !== 'All'
            ? { pays: new mongoose_2.Types.ObjectId(countryId) }
            : {};
        const vehicles = await this.vehiculeModel.find(userQuery);
        const estimatedMonthlyKm = 1500;
        let activeVehicles = 0;
        let totalPredictedServiceCost = 0;
        const serviceInterval = 5000;
        const realServiceCosts = {
            'Service A': 150,
            'Service B': 350,
            'Service C': 800,
        };
        for (const v of vehicles) {
            activeVehicles++;
            const currentKm = v.kilometrage || 0;
            const projectedKm = currentKm + estimatedMonthlyKm * months;
            let nextMilestone = Math.ceil((currentKm + 1) / serviceInterval) * serviceInterval;
            while (nextMilestone <= projectedKm) {
                let type = 'Service A';
                if (nextMilestone % 30000 === 0)
                    type = 'Service C';
                else if (nextMilestone % 15000 === 0)
                    type = 'Service B';
                totalPredictedServiceCost += realServiceCosts[type] || 150;
                nextMilestone += serviceInterval;
            }
        }
        const unscheduledMargin = totalPredictedServiceCost * 0.1;
        const totalPrediction = Math.round(totalPredictedServiceCost + unscheduledMargin);
        return {
            predictedTotal: totalPrediction,
            confidence: activeVehicles > 0 ? 'Medium' : 'Low',
            trend: months > 1 ? `Projection sur ${months} mois` : 'Projection mensuelle',
            details: {
                scheduledServices: Math.round(totalPredictedServiceCost),
                unscheduledBuffer: Math.round(unscheduledMargin),
                durationMonths: months,
                vehicleCount: activeVehicles,
            },
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(vehicule_schema_1.Vehicule.name)),
    __param(1, (0, mongoose_1.InjectModel)(fuel_schema_1.Fuel.name)),
    __param(2, (0, mongoose_1.InjectModel)(maintenance_schema_1.Maintenance.name)),
    __param(3, (0, mongoose_1.InjectModel)(incident_schema_1.Incident.name)),
    __param(4, (0, mongoose_1.InjectModel)(mouvement_schema_1.Mouvement.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        settings_service_1.SettingsService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map