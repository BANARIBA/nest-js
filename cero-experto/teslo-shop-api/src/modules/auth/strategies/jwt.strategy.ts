import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from '../interfaces/jwt.interfaces';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    public readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET') as string, // Secret key for JWT
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts JWT from the Authorization header
    });
  }
  async validate(payload: JWTPayload): Promise<User> {
    const { id } = payload;
    const user = await this.usersService.findOne(id); // Find user by ID from the payload
    if (!user) throw new UnauthorizedException('Token is not valid or expired');
    if (!user.isActive)
      throw new UnauthorizedException(
        'User is not active, talk with the admin',
      );
    return user;
  }
}
