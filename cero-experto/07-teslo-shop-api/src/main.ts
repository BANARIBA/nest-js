import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('==> Teslo Shop Store App <==');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve todo lo que no está incluído en los DTOs
      forbidNonWhitelisted: true, //  Retorna bad request si hay propiedades en el objeto no requeridas
    }),
  );
  await app.listen(process.env.PORT ?? 3000);

  logger.log(`NestJS Server Running on port: ${process.env.PORT ?? 3000}`);
}
void bootstrap();
