import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { encrypt, handleExceptions, isMatch } from 'src/config';
import { NewAccountDto } from './dtos/new-account.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount(newAccountDto: NewAccountDto) {
    try {
      this.userRepository.create(newAccountDto);
      const {password, ...restOfUser} = newAccountDto;
      const saved = await this.userRepository.save({
        ...restOfUser,
        password: encrypt(password),
      });
      delete saved.password;
      return {
        user: saved,
        token: this.setJwt({id: saved.id, email: saved.email, roles: saved.roles})
      };
    } catch (error) {
      handleExceptions(error);
    }
  }

  async logIn(signInDto: SignInDto) {
    try {
      const existsUser = await this.usersService.findOneByEmail(signInDto.email);
      if (!existsUser) throw new HttpException(`User ${signInDto.email} not found`, HttpStatus.NOT_FOUND);
      if (!existsUser.is_active) throw new HttpException(`User ${signInDto.email} is inactive`, HttpStatus.BAD_REQUEST);
      if (!isMatch(signInDto.password, existsUser.password)) throw new HttpException(`Invalid Credentials`, HttpStatus.BAD_REQUEST);
      delete existsUser.password;
      return {
        user: existsUser,
        token: this.setJwt({id: existsUser.id, email: existsUser.email, roles: existsUser.roles})
      }
    } catch (error) {
      handleExceptions(error);
    }
  }

  public renewToken (user: User) {
    return {
      user: user,
      token: this.setJwt({id: user.id, email: user.email, roles: user.roles})
    }
  }

  private setJwt (jwtPayload: JwtPayload): string {
    const token: string = this.jwtService.sign(jwtPayload);
    return token;
  }
}
