import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function bootstrap() {
  const logger: Logger = new Logger('Teslo Store');
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Teslo Store API')
    .setDescription('Documentación de la API de Teslo Store')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/teslo-store/api-docs', app, documentFactory);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application running on port ${process.env.PORT ?? 3000}`);
}
void bootstrap();
