import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { environmentVariables } from 'src/core/config';
import { handleErrorException } from 'src/core/exceptions';
import { InjectModel } from "@nestjs/mongoose";
import { JwtPayload, LoggedUser } from '../interfaces';
import { Model } from "mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "../schemas/user.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: environmentVariables.secretKey,
    });
  }

  async validate (payload: JwtPayload) {
    try {
      const {id} = payload;
      const user = await this.userModel.findOne({_id: id});
      if (!user) throw new HttpException(`Unauthorized: login first to access this endpoint`, HttpStatus.UNAUTHORIZED);
      if (!user.is_active) throw new HttpException(`Unauthorized: inactive user, request denied`, HttpStatus.UNAUTHORIZED);
      const {password: _, ...restOfUser} = user.toJSON();
      return restOfUser;
    } catch (error) {
      handleErrorException(error);
    }
  }
}