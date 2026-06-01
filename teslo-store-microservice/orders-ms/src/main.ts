import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export async function bootstrap() {
  const logger = new Logger('Orders Microservice');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: +(process.env.ORDERS_MICROSERVICE_PORT || 3002),
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen();
  logger.log(
    `Orders Microservice is running on port ${process.env.ORDERS_MICROSERVICE_PORT ?? 3002}`,
  );
}
void bootstrap();
