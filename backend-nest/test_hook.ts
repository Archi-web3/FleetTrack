import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { MouvementDocument, Mouvement } from './src/mouvements/schemas/mouvement.schema';
import { getModelToken } from '@nestjs/mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const model = app.get(getModelToken(Mouvement.name));
  
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
  } catch (err) {
    console.error('Error:', err);
  }
  await app.close();
}
bootstrap();
