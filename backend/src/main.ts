import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

let cachedApp: INestApplication;

async function createApp(): Promise<INestApplication> {
  if (cachedApp) {
    return cachedApp;
  }

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });

  const config = new DocumentBuilder()
    .setTitle('Paring API')
    .setDescription('Paring API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  cachedApp = app;
  return app;
}

// Vercel serverless handler — exported as default
export default async (req: any, res: any) => {
  const app = await createApp();
  await app.init();
  const server = app.getHttpAdapter().getInstance();
  server(req, res);
};

// Local development — when run directly via `nest start` or `node dist/src/main`
if (!process.env.VERCEL) {
  createApp().then(async (app) => {
    await app.listen(3000);
    console.log('Application is running on: http://localhost:3000');
  });
}
