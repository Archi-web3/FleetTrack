"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateursModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const generateurs_service_1 = require("./generateurs.service");
const generateurs_controller_1 = require("./generateurs.controller");
const generateur_schema_1 = require("./schemas/generateur.schema");
const logbook_module_1 = require("../logbook/logbook.module");
const logbook_schema_1 = require("../logbook/schemas/logbook.schema");
let GenerateursModule = class GenerateursModule {
};
exports.GenerateursModule = GenerateursModule;
exports.GenerateursModule = GenerateursModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: generateur_schema_1.Generateur.name, schema: generateur_schema_1.GenerateurSchema },
                { name: logbook_schema_1.GenerateurLogbook.name, schema: logbook_schema_1.GenerateurLogbookSchema },
            ]),
            logbook_module_1.LogbookModule,
        ],
        controllers: [generateurs_controller_1.GenerateursController],
        providers: [generateurs_service_1.GenerateursService],
        exports: [generateurs_service_1.GenerateursService],
    })
], GenerateursModule);
//# sourceMappingURL=generateurs.module.js.map