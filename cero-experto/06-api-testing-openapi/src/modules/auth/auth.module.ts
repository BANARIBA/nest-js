import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { environmentVariables } from 'src/core/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: environmentVariables.secretKey,
      signOptions: {
        expiresIn: environmentVariables.jwtExpire,
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // BS => Strategies here
  ],
  exports: [
    PassportModule,
    JwtModule,
    JwtStrategy,
  ],
})
export class AuthModule { }
