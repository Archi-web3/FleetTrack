import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { MailService } from './src/notifications/mail.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const mailService = app.get(MailService);
  const mouvementModel = app.get(getModelToken('Mouvement'));
  
  // Find the last movement
  const mv = await mouvementModel.findOne({ type: { $ne: 'maintenance' } }).sort({createdAt: -1});
  
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
