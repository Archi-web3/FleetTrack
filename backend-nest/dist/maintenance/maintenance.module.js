"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const maintenance_service_1 = require("./maintenance.service");
const maintenance_controller_1 = require("./maintenance.controller");
const maintenance_automation_service_1 = require("./maintenance-automation.service");
const maintenance_config_schema_1 = require("./schemas/maintenance-config.schema");
const checklist_template_schema_1 = require("./schemas/checklist-template.schema");
const service_schedule_schema_1 = require("./schemas/service-schedule.schema");
const weekly_checklist_schema_1 = require("./schemas/weekly-checklist.schema");
const maintenance_schema_1 = require("./schemas/maintenance.schema");
const vehicule_schema_1 = require("../vehicles/schemas/vehicule.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let MaintenanceModule = class MaintenanceModule {
};
exports.MaintenanceModule = MaintenanceModule;
exports.MaintenanceModule = MaintenanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: maintenance_config_schema_1.MaintenanceConfig.name, schema: maintenance_config_schema_1.MaintenanceConfigSchema },
                { name: checklist_template_schema_1.ChecklistTemplate.name, schema: checklist_template_schema_1.ChecklistTemplateSchema },
                { name: service_schedule_schema_1.ServiceSchedule.name, schema: service_schedule_schema_1.ServiceScheduleSchema },
                { name: weekly_checklist_schema_1.WeeklyChecklist.name, schema: weekly_checklist_schema_1.WeeklyChecklistSchema },
                { name: maintenance_schema_1.Maintenance.name, schema: maintenance_schema_1.MaintenanceSchema },
                { name: vehicule_schema_1.Vehicule.name, schema: vehicule_schema_1.VehiculeSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
        ],
        controllers: [maintenance_controller_1.MaintenanceController],
        providers: [maintenance_service_1.MaintenanceService, maintenance_automation_service_1.MaintenanceAutomationService],
        exports: [maintenance_service_1.MaintenanceService, maintenance_automation_service_1.MaintenanceAutomationService],
    })
], MaintenanceModule);
//# sourceMappingURL=maintenance.module.js.map