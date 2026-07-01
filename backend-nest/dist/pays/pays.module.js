"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaysModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const pays_service_1 = require("./pays.service");
const pays_controller_1 = require("./pays.controller");
const pays_schema_1 = require("./schemas/pays.schema");
let PaysModule = class PaysModule {
};
exports.PaysModule = PaysModule;
exports.PaysModule = PaysModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: pays_schema_1.Pays.name, schema: pays_schema_1.PaysSchema }]),
        ],
        controllers: [pays_controller_1.PaysController],
        providers: [pays_service_1.PaysService],
        exports: [pays_service_1.PaysService],
    })
], PaysModule);
//# sourceMappingURL=pays.module.js.map