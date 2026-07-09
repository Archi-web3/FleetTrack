"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const mail_service_1 = require("./src/notifications/mail.service");
const mongoose_1 = require("@nestjs/mongoose");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const mailService = app.get(mail_service_1.MailService);
    const mouvementModel = app.get((0, mongoose_1.getModelToken)('Mouvement'));
    const mv = await mouvementModel.findOne({ type: { $ne: 'maintenance' } }).sort({ createdAt: -1 });
    await mv.populate([
        { path: 'vehicule' },
        { path: 'stops.lieu' },
        { path: 'demandeur' },
    ]);
    console.log('Sending req_created to test matrix bypass...');
    await mailService.sendTemplateEmail('req_created', mv, ['dummy@example.com']);
    console.log('Done!');
    await app.close();
}
bootstrap();
//# sourceMappingURL=test_req_created.js.map