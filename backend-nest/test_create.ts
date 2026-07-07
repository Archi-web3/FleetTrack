import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { MouvementsService } from './src/mouvements/mouvements.service';
import { UsersService } from './src/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const mouvementsService = app.get(MouvementsService);
  const usersService = app.get(UsersService);

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
        lieu: '6937ff6590074e68ade3c09b', // Replace with an actual lieu ID
        dateDepart: new Date(),
      },
      {
        lieu: '6937ff6590074e68ade3c09b', // Same lieu for testing
        dateArrivee: new Date(Date.now() + 3600000),
      }
    ]
  };

  try {
    const mouvement = await mouvementsService.create(dto as any, rp as any, false);
    console.log('Success!', (mouvement as any)._id);
  } catch (err) {
    console.error('Error in create:', err);
  }

  await app.close();
}
bootstrap();
