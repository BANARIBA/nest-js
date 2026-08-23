import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export async function bootstrap() {
  const logger: Logger = new Logger('===> Orders Microservice <===');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: +(process.env.PORT || 3002),
      }
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
  logger.log(`NodeJS server started on port ${process.env.PORT ?? 3002}`);
}
void bootstrap();
