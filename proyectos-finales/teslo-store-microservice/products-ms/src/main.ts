import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export async function bootstrap() {
  const logger: Logger = new Logger('===> Products Microservice <===');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: +(process.env.PORT || 3001),
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Los objetos deben venir tal cual los declaro en los dtos
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen();
  logger.log(`Producta Microservice Running on port ${process.env.PORT ?? 3001}`);
}
void bootstrap();
