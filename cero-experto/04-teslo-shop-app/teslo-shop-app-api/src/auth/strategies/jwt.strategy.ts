import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { User } from "src/users/entities/user.entity";
import { JwtPayload } from "../interfaces";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    public readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate (payload: JwtPayload): Promise<User> {
    const {id} = payload;

    const existsUser = await this.userRepository.findOne({
      where: {
        id: id
      }, 
      select: {
        id: true,
        full_name: true,
        email: true,
        is_active: true,
        roles: true,
    }});

    // console.log('id: ', id , 'user: ', existsUser);
    if (!existsUser) throw new HttpException(`User not logged`, HttpStatus.UNAUTHORIZED);
    if (!existsUser.is_active) throw new HttpException(`User does not active`, HttpStatus.UNAUTHORIZED);

    return existsUser;
  }
}