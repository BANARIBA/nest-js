import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('===> Teslo Shop APP <===');
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Ver update-product.dto el partial se importa de import { PartialType } from '@nestjs/swagger';
  const config = new DocumentBuilder()
    .setTitle('Teslo Shop App Backend')
    .setDescription('Teslo shop endpoints')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT);
  logger.log(`NestJS Server started on port: ${process.env.PORT}`);
}
bootstrap();
