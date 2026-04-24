import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Products Microservice');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PRODUCTS_MICROSERVICE_PORT ?? 3001);
  logger.log(
    `Products Microservice is running on port ${process.env.PRODUCTS_MICROSERVICE_PORT ?? 3001}`,
  );
}
void bootstrap();
