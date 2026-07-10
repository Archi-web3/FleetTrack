"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const axes_controller_1 = require("./axes.controller");
const axes_service_1 = require("./axes.service");
const axe_schema_1 = require("./schemas/axe.schema");
const audit_logs_module_1 = require("../audit-logs/audit-logs.module");
let AxesModule = class AxesModule {
};
exports.AxesModule = AxesModule;
exports.AxesModule = AxesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: axe_schema_1.Axe.name, schema: axe_schema_1.AxeSchema }]),
            audit_logs_module_1.AuditLogsModule,
        ],
        controllers: [axes_controller_1.AxesController],
        providers: [axes_service_1.AxesService],
        exports: [axes_service_1.AxesService],
    })
], AxesModule);
//# sourceMappingURL=axes.module.js.map