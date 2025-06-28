import { NestFactory } from '@nestjs/core';
import { AppModule } from './presentation/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger("Main Pokedex App");
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    }),
  );
  await app.listen(process.env.PORT);
  logger.log(`NestJS server started on port ${process.env.PORT}`);
}
bootstrap();
