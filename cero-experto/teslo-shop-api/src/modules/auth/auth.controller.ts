import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewAccountDto } from './dtos/new-account.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { GetRawHeaders } from './decorators/get-raw-headers.decorator';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { UserRoles } from '../users/enums/roles.enum';
import { RoleProtected } from './decorators/role-protected.decorator';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('new-account')
  public newAccount(@Body() newAccountDto: NewAccountDto) {
    return this.authService.newAccount(newAccountDto);
  }

  @Post('sign-in')
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('testing-private-route')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User, 
    @GetUser('email') email: string,
    @GetRawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders
  ) {
    return { message: 'This is a private route', user: user, email: email, rawHeaders, headers };
  }

  @Get('testing-private-route-two')
  // @SetMetadata('roles', [UserRoles.ADMIN, UserRoles.DEVELOPER])
  @RoleProtected(UserRoles.ADMIN)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRouteTwo (
    @GetUser() user: User,
  ) {
    return user;
  }

  // Estos son similares al anterior solo que @RoleProtected(UserRoles.ADMIN), @UseGuards(AuthGuard(), UserRoleGuard) los metemos en un solo decorador llamado Auth
  @Get('testing-private-route-three')
  @Auth()
  testingPrivateRouteThree (
    @GetUser() user: User,
  ) {
    return user;
  }
  @Get('testing-private-route-four')
  @Auth(UserRoles.ADMIN)
  testingPrivateRouteFour (
    @GetUser() user: User,
  ) {
    return user;
  }

  @Get('refresh-token')
  @Auth()
  checkAuthStatus (
    @GetUser() user: User,
  ) {
    return this.authService.checkAuthStatus(user);
  }
}
