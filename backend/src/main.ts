import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

let cachedApp: INestApplication;

async function createApp(): Promise<INestApplication> {
  if (cachedApp) {
    return cachedApp;
  }

  try {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3001',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
      exposedHeaders: ['Content-Type', 'Authorization', 'X-Total-Count', 'X-Page-Number'],
      maxAge: 86400,
    });

    const config = new DocumentBuilder()
      .setTitle('Paring API')
      .setDescription('Paring API Documentation')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();
    console.log('✓ Application initialized successfully');
    cachedApp = app;
    return app;
  } catch (error) {
    console.error('✗ Error creating app:', error);
    throw error;
  }
}

// Vercel serverless handler — exported as default
export default async (req: any, res: any) => {
  try {
    const app = await createApp();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
  } catch (error) {
    console.error('✗ Error in Vercel handler:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error?.message || 'Unknown error'
    });
  }
};

// Local development — when run directly via `nest start` or `node dist/src/main`
if (!process.env.VERCEL) {
  createApp()
    .then(async (app) => {
      await app.listen(3000);
      console.log('✓ Application is running on: http://localhost:3000');
    })
    .catch((error) => {
      console.error('✗ Failed to start application:', error);
      process.exit(1);
    });
}
