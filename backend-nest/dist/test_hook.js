"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const mouvement_schema_1 = require("./src/mouvements/schemas/mouvement.schema");
const mongoose_1 = require("@nestjs/mongoose");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const model = app.get((0, mongoose_1.getModelToken)(mouvement_schema_1.Mouvement.name));
    const m = new model({
        type: 'mission',
        dateDepart: new Date(),
        dateArrivee: new Date(),
        demandeur: '6937ff3490074e68ade3c074',
        statut: 'en attente',
        statutLogistique: 'en attente',
        statutSecurite: 'en attente',
        base: '6937ff3490074e68ade3c074',
        pays: '6937ff3490074e68ade3c074',
        stops: []
    });
    try {
        await m.save();
        console.log('Success!');
    }
    catch (err) {
        console.error('Error:', err);
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=test_hook.js.map