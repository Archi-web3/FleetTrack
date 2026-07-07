"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogbookModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const logbook_service_1 = require("./logbook.service");
const logbook_sync_service_1 = require("./logbook-sync.service");
const logbook_controller_1 = require("./logbook.controller");
const fuel_schema_1 = require("./schemas/fuel.schema");
const incident_schema_1 = require("./schemas/incident.schema");
const mouvement_schema_1 = require("../mouvements/schemas/mouvement.schema");
const vehicule_schema_1 = require("../vehicles/schemas/vehicule.schema");
const lieu_schema_1 = require("../lieux/schemas/lieu.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const logbook_schema_1 = require("./schemas/logbook.schema");
const maintenance_schema_1 = require("../maintenance/schemas/maintenance.schema");
const vehicles_module_1 = require("../vehicles/vehicles.module");
let LogbookModule = class LogbookModule {
};
exports.LogbookModule = LogbookModule;
exports.LogbookModule = LogbookModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: fuel_schema_1.Fuel.name, schema: fuel_schema_1.FuelSchema },
                { name: incident_schema_1.Incident.name, schema: incident_schema_1.IncidentSchema },
                { name: mouvement_schema_1.Mouvement.name, schema: mouvement_schema_1.MouvementSchema },
                { name: vehicule_schema_1.Vehicule.name, schema: vehicule_schema_1.VehiculeSchema },
                { name: lieu_schema_1.Lieu.name, schema: lieu_schema_1.LieuSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: logbook_schema_1.GenerateurLogbook.name, schema: logbook_schema_1.GenerateurLogbookSchema },
                { name: maintenance_schema_1.Maintenance.name, schema: maintenance_schema_1.MaintenanceSchema },
            ]),
            (0, common_1.forwardRef)(() => vehicles_module_1.VehiclesModule),
        ],
        controllers: [logbook_controller_1.LogbookController],
        providers: [logbook_service_1.LogbookService, logbook_sync_service_1.LogbookSyncService],
        exports: [logbook_service_1.LogbookService, logbook_sync_service_1.LogbookSyncService],
    })
], LogbookModule);
//# sourceMappingURL=logbook.module.js.map