"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecklistTemplatesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const checklist_templates_service_1 = require("./checklist-templates.service");
const checklist_templates_controller_1 = require("./checklist-templates.controller");
const checklist_template_schema_1 = require("./schemas/checklist-template.schema");
let ChecklistTemplatesModule = class ChecklistTemplatesModule {
};
exports.ChecklistTemplatesModule = ChecklistTemplatesModule;
exports.ChecklistTemplatesModule = ChecklistTemplatesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: checklist_template_schema_1.ChecklistTemplate.name, schema: checklist_template_schema_1.ChecklistTemplateSchema },
            ]),
        ],
        controllers: [checklist_templates_controller_1.ChecklistTemplatesController],
        providers: [checklist_templates_service_1.ChecklistTemplatesService],
        exports: [checklist_templates_service_1.ChecklistTemplatesService],
    })
], ChecklistTemplatesModule);
//# sourceMappingURL=checklist-templates.module.js.map