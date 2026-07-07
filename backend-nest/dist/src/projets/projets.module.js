"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjetsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const projets_service_1 = require("./projets.service");
const projets_controller_1 = require("./projets.controller");
const projet_schema_1 = require("./schemas/projet.schema");
let ProjetsModule = class ProjetsModule {
};
exports.ProjetsModule = ProjetsModule;
exports.ProjetsModule = ProjetsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: projet_schema_1.Projet.name, schema: projet_schema_1.ProjetSchema }]),
        ],
        controllers: [projets_controller_1.ProjetsController],
        providers: [projets_service_1.ProjetsService],
        exports: [projets_service_1.ProjetsService],
    })
], ProjetsModule);
//# sourceMappingURL=projets.module.js.map