import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NewAccountDto } from './dtos/new-account.dto';
import { errorHandleException } from 'src/exceptions/error-handle.exception';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { SignInDto } from './dtos/sign-in.dto';
import { isMatchParams } from 'src/shared/utils/bcrypt.utils';
import { AuthResponse } from './interfaces/auth.interfaces';
import { JWTPayload } from './interfaces/jwt.interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async newAccount(newAccountDto: NewAccountDto): Promise<AuthResponse> {
    try {
      const user: User =
        await this.usersService.createFromNewAccount(newAccountDto);

      return {
        loggedUser: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          roles: user.roles,
        },
        accessToken: this.setJwtToken({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          roles: user.roles,
        }),
      };
    } catch (error) {
      return errorHandleException(error);
    }
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    try {
      const user = await this.usersService.findOneByEmail(signInDto.email);

      if (!user.isActive)
        throw new UnauthorizedException(
          'User does not active, please consult with the admin.',
        );

      if (!isMatchParams(signInDto.password, user.password))
        throw new UnauthorizedException('Not valid credentials - pwd.');

      return {
        loggedUser: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          roles: user.roles,
        },
        accessToken: this.setJwtToken({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          roles: user.roles,
        }),
      };
    } catch (error) {
      return errorHandleException(error);
    }
  }

  private setJwtToken (payload: JWTPayload): string {
    return this.jwtService.sign(payload);
  }

  public checkAuthStatus (user: User) {
    return {
      loggedUser: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        roles: user.roles,
      },
      accessToken: this.setJwtToken({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        roles: user.roles,
      }),
    };
  }
}
