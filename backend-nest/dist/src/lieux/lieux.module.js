"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LieuxModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const lieux_service_1 = require("./lieux.service");
const lieux_controller_1 = require("./lieux.controller");
const lieu_schema_1 = require("./schemas/lieu.schema");
const bases_module_1 = require("../bases/bases.module");
let LieuxModule = class LieuxModule {
};
exports.LieuxModule = LieuxModule;
exports.LieuxModule = LieuxModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: lieu_schema_1.Lieu.name, schema: lieu_schema_1.LieuSchema }]),
            bases_module_1.BasesModule,
        ],
        controllers: [lieux_controller_1.LieuxController],
        providers: [lieux_service_1.LieuxService],
        exports: [lieux_service_1.LieuxService],
    })
], LieuxModule);
//# sourceMappingURL=lieux.module.js.map