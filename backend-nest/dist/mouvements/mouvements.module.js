"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouvementsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mouvements_service_1 = require("./mouvements.service");
const mouvements_conflict_service_1 = require("./mouvements-conflict.service");
const mouvements_security_service_1 = require("./mouvements-security.service");
const mouvement_schema_1 = require("./schemas/mouvement.schema");
const security_config_schema_1 = require("./schemas/security-config.schema");
const lieu_schema_1 = require("../lieux/schemas/lieu.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let MouvementsModule = class MouvementsModule {
};
exports.MouvementsModule = MouvementsModule;
exports.MouvementsModule = MouvementsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: mouvement_schema_1.Mouvement.name, schema: mouvement_schema_1.MouvementSchema },
                { name: security_config_schema_1.SecurityConfig.name, schema: security_config_schema_1.SecurityConfigSchema },
                { name: lieu_schema_1.Lieu.name, schema: lieu_schema_1.LieuSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
        ],
        providers: [
            mouvements_service_1.MouvementsService,
            mouvements_conflict_service_1.MouvementsConflictService,
            mouvements_security_service_1.MouvementsSecurityService,
        ],
        exports: [mouvements_service_1.MouvementsService],
    })
], MouvementsModule);
//# sourceMappingURL=mouvements.module.js.map