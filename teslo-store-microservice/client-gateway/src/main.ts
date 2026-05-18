import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

export async function bootstrap() {
  const logger = new Logger('===> Client Gateway <===');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.CLIENT_GATEGWAY_PORT || 3000);
  logger.log(
    `Client Gateway is running on port ${process.env.CLIENT_GATEGWAY_PORT || 3000}`,
  );
}
void bootstrap();
