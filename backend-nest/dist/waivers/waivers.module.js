"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaiversModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const waivers_controller_1 = require("./waivers.controller");
const waivers_service_1 = require("./waivers.service");
const waiver_schema_1 = require("./schemas/waiver.schema");
const uploads_module_1 = require("../uploads/uploads.module");
let WaiversModule = class WaiversModule {
};
exports.WaiversModule = WaiversModule;
exports.WaiversModule = WaiversModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: waiver_schema_1.Waiver.name, schema: waiver_schema_1.WaiverSchema }]),
            uploads_module_1.UploadsModule,
        ],
        controllers: [waivers_controller_1.WaiversController],
        providers: [waivers_service_1.WaiversService],
        exports: [waivers_service_1.WaiversService],
    })
], WaiversModule);
//# sourceMappingURL=waivers.module.js.map