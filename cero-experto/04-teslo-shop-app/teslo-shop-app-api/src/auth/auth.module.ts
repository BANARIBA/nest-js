import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('SECRET'),
        signOptions: {
          expiresIn: '1h',
        },
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // SI CREAS UN STRATEGY DEBES EXPORTALO 
  exports: [
    JwtStrategy,
    PassportModule,
    JwtModule,
    UsersModule,
  ],
})
export class AuthModule {}
