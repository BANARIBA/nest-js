import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, UserLoggedDto } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from './schemas/user.schema';
import { GetUser } from './decorators/get-uset.decorator';

@ApiTags('Auth Endpoints')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'User created and logged when the user write the correct credentials',
    type: UserLoggedDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Sometime went wrong creating user'
  })
  @Post('new-account')
  onSignUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }

  @ApiResponse({
    status: 201,
    description: 'User logged when the user write the correct credentials',
    type: UserLoggedDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Sometime went wrong when the user try to log in'
  })
  @Post('sign-in')
  onSignIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto)
  }

  @Get('refresh-token')
  @UseGuards(AuthGuard())
  onRefreshToken (
    @GetUser() user: User,    
  ) {
    return this.authService.refreshToken(user);
  }
}
