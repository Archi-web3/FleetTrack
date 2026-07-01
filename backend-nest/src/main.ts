import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Préfixe global pour correspondre à l'ancien backend
  app.setGlobalPrefix('api');

  // Configuration CORS
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:4201',
      'http://localhost:8100',
      /\.vercel\.app$/, // Autoriser tous les sous-domaines Vercel
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Limite de payload pour les images en base64
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Erreur lors du démarrage:', err);
  process.exit(1);
});
