import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exception-filters';

export async function bootstrap() {
  const logger = new Logger('===> Teslo Store Gateway <===');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Los objetos deben venir tal cual los declaro en los dtos
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(+(process.env.PORT || 3000));
  logger.log(`Client Gateway Started on port ${+(process.env.PORT || 3000)}`);
}
void bootstrap();
