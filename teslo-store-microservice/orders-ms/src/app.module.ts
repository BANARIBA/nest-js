import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { CoreModule } from './core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>(
          'ORDERS_MICROSERVICE_DBHOST',
          'localhost',
        ),
        port: configService.get<number>('ORDERS_MICROSERVICE_DBPORT', 5434),
        username: configService.get<string>('ORDERS_MICROSERVICE_USERNAME'),
        password: configService.get<string>('ORDERS_MICROSERVICE_PASSWORD'),
        database: configService.get<string>('ORDERS_MICROSERVICE_DBNAME'),
        autoLoadEntities: true, // Carga automáticamente las entidades registradas en los módulos
        synchronize: true, // Sincroniza las tablas con tus entidades (solo para DESARROLLO)
        // Configuración extra para asegurar compatibilidad con versiones nuevas de Postgres
        logging: true,
      }),
    }),
    CommonModule,
    CoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
