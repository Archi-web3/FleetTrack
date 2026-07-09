"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const environment_controller_1 = require("./environment.controller");
const environment_service_1 = require("./environment.service");
const environment_action_schema_1 = require("./schemas/environment-action.schema");
const environment_data_schema_1 = require("./schemas/environment-data.schema");
const fuel_schema_1 = require("../logbook/schemas/fuel.schema");
const mouvement_schema_1 = require("../mouvements/schemas/mouvement.schema");
let EnvironmentModule = class EnvironmentModule {
};
exports.EnvironmentModule = EnvironmentModule;
exports.EnvironmentModule = EnvironmentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: environment_action_schema_1.EnvironmentAction.name, schema: environment_action_schema_1.EnvironmentActionSchema },
                { name: environment_data_schema_1.EnvironmentData.name, schema: environment_data_schema_1.EnvironmentDataSchema },
                { name: fuel_schema_1.Fuel.name, schema: fuel_schema_1.FuelSchema },
                { name: mouvement_schema_1.Mouvement.name, schema: mouvement_schema_1.MouvementSchema },
            ]),
        ],
        controllers: [environment_controller_1.EnvironmentController],
        providers: [environment_service_1.EnvironmentService],
        exports: [environment_service_1.EnvironmentService],
    })
], EnvironmentModule);
//# sourceMappingURL=environment.module.js.map