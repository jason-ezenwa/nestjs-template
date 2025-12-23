import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { initializeMongoDB } from './lib/mongodb.client';

// Load environment variables
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  const allowedOrigins = [
    'http://localhost:5173', // Vite dev server
    process.env.FRONTEND_URL,
  ].filter(Boolean); // Remove any undefined values

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow if origin is in the allowed origins array
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Reject other origins
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true, // Allow cookies and authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'x-signup-type',
    ],
  });

  app.setGlobalPrefix('/api');

  await initializeMongoDB();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
