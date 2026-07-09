"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const vehicles_module_1 = require("./vehicles/vehicles.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const roles_module_1 = require("./roles/roles.module");
const security_config_module_1 = require("./security-config/security-config.module");
const pays_module_1 = require("./pays/pays.module");
const bases_module_1 = require("./bases/bases.module");
const lieux_module_1 = require("./lieux/lieux.module");
const projets_module_1 = require("./projets/projets.module");
const chauffeurs_module_1 = require("./chauffeurs/chauffeurs.module");
const generateurs_module_1 = require("./generateurs/generateurs.module");
const mouvements_module_1 = require("./mouvements/mouvements.module");
const logbook_module_1 = require("./logbook/logbook.module");
const fuel_module_1 = require("./fuel/fuel.module");
const maintenance_module_1 = require("./maintenance/maintenance.module");
const service_schedule_module_1 = require("./service-schedule/service-schedule.module");
const waivers_module_1 = require("./waivers/waivers.module");
const checklist_templates_module_1 = require("./checklist-templates/checklist-templates.module");
const environment_module_1 = require("./environment/environment.module");
const settings_module_1 = require("./settings/settings.module");
const notifications_module_1 = require("./notifications/notifications.module");
const analytics_module_1 = require("./analytics/analytics.module");
const utils_module_1 = require("./utils/utils.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            vehicles_module_1.VehiclesModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            security_config_module_1.SecurityConfigModule,
            pays_module_1.PaysModule,
            bases_module_1.BasesModule,
            lieux_module_1.LieuxModule,
            projets_module_1.ProjetsModule,
            chauffeurs_module_1.ChauffeursModule,
            generateurs_module_1.GenerateursModule,
            settings_module_1.SettingsModule,
            notifications_module_1.NotificationsModule,
            mouvements_module_1.MouvementsModule,
            logbook_module_1.LogbookModule,
            fuel_module_1.FuelModule,
            maintenance_module_1.MaintenanceModule,
            service_schedule_module_1.ServiceScheduleModule,
            waivers_module_1.WaiversModule,
            checklist_templates_module_1.ChecklistTemplatesModule,
            environment_module_1.EnvironmentModule,
            settings_module_1.SettingsModule,
            analytics_module_1.AnalyticsModule,
            utils_module_1.UtilsModule,
            audit_logs_module_1.AuditLogsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map