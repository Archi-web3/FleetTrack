"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const mouvements_service_1 = require("./src/mouvements/mouvements.service");
const users_service_1 = require("./src/users/users.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const mouvementsService = app.get(mouvements_service_1.MouvementsService);
    const usersService = app.get(users_service_1.UsersService);
    const rp = await usersService.findByEmail('rp_goma@acf-rdc.org');
    if (!rp) {
        console.log('RP not found');
        process.exit(1);
    }
    const dto = {
        type: 'mission',
        dateDepart: new Date(),
        dateArrivee: new Date(Date.now() + 3600000),
        stops: [
            {
                lieu: '6937ff6590074e68ade3c09b',
                dateDepart: new Date(),
            },
            {
                lieu: '6937ff6590074e68ade3c09b',
                dateArrivee: new Date(Date.now() + 3600000),
            }
        ]
    };
    try {
        const mouvement = await mouvementsService.create(dto, rp, false);
        console.log('Success!', mouvement._id);
    }
    catch (err) {
        console.error('Error in create:', err);
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=test_create.js.map