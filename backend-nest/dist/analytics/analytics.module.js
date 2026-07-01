"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const analytics_controller_1 = require("./analytics.controller");
const analytics_service_1 = require("./analytics.service");
const vehicule_schema_1 = require("../vehicles/schemas/vehicule.schema");
const fuel_schema_1 = require("../logbook/schemas/fuel.schema");
const maintenance_schema_1 = require("../maintenance/schemas/maintenance.schema");
const incident_schema_1 = require("../logbook/schemas/incident.schema");
const mouvement_schema_1 = require("../mouvements/schemas/mouvement.schema");
const settings_module_1 = require("../settings/settings.module");
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: vehicule_schema_1.Vehicule.name, schema: vehicule_schema_1.VehiculeSchema },
                { name: fuel_schema_1.Fuel.name, schema: fuel_schema_1.FuelSchema },
                { name: maintenance_schema_1.Maintenance.name, schema: maintenance_schema_1.MaintenanceSchema },
                { name: incident_schema_1.Incident.name, schema: incident_schema_1.IncidentSchema },
                { name: mouvement_schema_1.Mouvement.name, schema: mouvement_schema_1.MouvementSchema },
            ]),
            settings_module_1.SettingsModule,
        ],
        controllers: [analytics_controller_1.AnalyticsController],
        providers: [analytics_service_1.AnalyticsService],
        exports: [analytics_service_1.AnalyticsService],
    })
], AnalyticsModule);
//# sourceMappingURL=analytics.module.js.map