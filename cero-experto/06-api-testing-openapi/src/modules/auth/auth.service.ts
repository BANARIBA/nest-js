import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { handleErrorException } from 'src/core/exceptions';
import { SignInDto, SignUpDto } from './dto';
import { encrypt, isMatched } from 'src/core/config';
import { JwtService } from '@nestjs/jwt';
import { IUser, JwtPayload } from './interfaces';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) { }

  public async signIn(signInDto: SignInDto): Promise<{user: IUser, token: string}> {
    try {
      const user = await this.userModel.findOne({email: signInDto.email});
      if (!user) throw new HttpException(`Invalid credentials - email`, HttpStatus.UNAUTHORIZED);
      if (!isMatched(signInDto.password, user.password)) throw new HttpException(`Invalid credentials - password`, HttpStatus.UNAUTHORIZED);
      if (!user.is_active) throw new HttpException(`Inactive user`, HttpStatus.UNAUTHORIZED);
      const {password: _, ...restOfUser} = user.toJSON();
      return {
        user: restOfUser,
        token: this.setJsonWebToken({id: `${user._id}`, email: user.email, name: user.name}),
      }
    } catch (error) {
      handleErrorException(error);
    }
  }

  public async signUp(signUpDto: SignUpDto): Promise<{user: IUser, token: string}> {
    try {
      const user = await this.userModel.create({...signUpDto, password: encrypt(signUpDto.password)});
      const saved = await user.save();
      const {password: _, ...restOfUser} = saved.toJSON();
      return {
        user: restOfUser,
        token: this.setJsonWebToken({id: `${saved._id}`, email: saved.email, name: saved.name}),
      }
    } catch (error) {
      handleErrorException(error);
    }
  }

  public refreshToken (user: User) {
    return {
      user: user,
      token: this.setJsonWebToken({id: `${user._id}`, email: user.email, name: user.name})
    }
  }

  private setJsonWebToken (payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
