import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common/exceptions/rcp-custom.exception.filter';

async function bootstrap() {
  const logger = new Logger('API-Main-Gateway');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new RpcCustomExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Server started on port ${process.env.API_GATEWAY_PORT ?? 3000}`);
}
void bootstrap();
// Seccion 6 Orders Microservice
