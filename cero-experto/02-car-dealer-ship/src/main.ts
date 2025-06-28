import { NestFactory } from '@nestjs/core';
import { AppModule } from './presentation/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Quita los campos que estan en el body pero no en el dto
      forbidNonWhitelisted: true, // Lanza error si envias una propiedad desconocida al dto
    }),
  );
  await app.listen(3000);
}
bootstrap();
