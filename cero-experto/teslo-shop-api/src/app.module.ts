import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsModule } from './modules/brands/brands.module';
import { FilesModule } from './modules/files/files.module';
import { MessagesWsModule } from './modules/messages-ws/messages-ws.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: Number(process.env.POSTGRES_DB_PORT),
      username: process.env.POSTGRES_DB_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      // entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    UsersModule,
    AuthModule,
    BrandsModule,
    FilesModule,
    MessagesWsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
