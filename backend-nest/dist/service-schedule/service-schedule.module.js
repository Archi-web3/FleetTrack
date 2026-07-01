"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceScheduleModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const service_schedule_service_1 = require("./service-schedule.service");
const service_schedule_controller_1 = require("./service-schedule.controller");
const service_schedule_schema_1 = require("./schemas/service-schedule.schema");
let ServiceScheduleModule = class ServiceScheduleModule {
};
exports.ServiceScheduleModule = ServiceScheduleModule;
exports.ServiceScheduleModule = ServiceScheduleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: service_schedule_schema_1.ServiceSchedule.name, schema: service_schedule_schema_1.ServiceScheduleSchema },
            ]),
        ],
        controllers: [service_schedule_controller_1.ServiceScheduleController],
        providers: [service_schedule_service_1.ServiceScheduleService],
        exports: [service_schedule_service_1.ServiceScheduleService],
    })
], ServiceScheduleModule);
//# sourceMappingURL=service-schedule.module.js.map