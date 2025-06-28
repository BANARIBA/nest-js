import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { NewAccountDto } from './dtos/new-account.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { Auth, GetRequestsHeaders, GetUser } from './decorators';
import { User } from 'src/users/entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RolesProtected } from './decorators/get-roles-protected.decorator';
import { Roles } from './enums';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('new-account')
  @ApiResponse({status: 201, description: 'User created and token generated successfully', type: User})
  @ApiResponse({status: 400, description: 'User duplicated'})
  @ApiResponse({status: 500, description: 'Sometime went wrong creating user'})
  onNewAccount (@Body() newAccountDto: NewAccountDto) {
    return this.authService.createAccount(newAccountDto);
  }

  @Post('sign-in')
  @ApiResponse({status: 200, description: 'User created and token generated successfully'})
  @ApiResponse({status: 401, description: 'Unauthorized - not valid credentials or inactive user'})
  @ApiResponse({status: 500, description: 'Sometime went wrong logging user'})
  onSignIn (@Body() signInDto: SignInDto) {
    return this.authService.logIn(signInDto);
  }

  @Get('renew-token')
  @ApiResponse({status: 200, description: 'User created and token generated successfully'})
  @ApiResponse({status: 401, description: 'Unauthorized - not valid credentials or inactive user'})
  @ApiResponse({status: 500, description: 'Sometime went wrong refreshing user token'})
  @Auth()
  onRenewToken (
    @GetUser() user: User
  ) {
    return this.authService.renewToken(user);
  }

  // Testeando rutas protegidas por autenticacion
  @Get("private-one")
  @ApiResponse({status: 200, description: 'Accesing the private route'})
  @ApiResponse({status: 401, description: 'Unauthorized - not valid credentials or inactive user'})
  @ApiResponse({status: 500, description: 'Sometime went accessing the private route'})
  @UseGuards(
    AuthGuard()
  )
  onPrivateOne(
    // @Req() req: Express.Request,
    @GetUser() user: User, // Si necesitas el email nada mas => @GetUser('email') userLoggedEmail: string,
    @GetRequestsHeaders() requests: string[]
  ) {
    return {
      data: 'Success!',
      user: user,
      requests: requests,
      ok: true,
    };
  }

  @Get("private-two")
  @ApiResponse({status: 200, description: 'Accesing the private route'})
  @ApiResponse({status: 401, description: 'Unauthorized - not valid credentials or inactive user'})
  @ApiResponse({status: 500, description: 'Sometime went accessing the private route'})
  // @SetMetadata('roles', ['ADMIN', 'SUPER_USER'])
  @RolesProtected(Roles.SUPER_USER)
  @UseGuards(
    AuthGuard(),
    UserRoleGuard,
  )
  onPrivateTwo(
    @GetUser() user: User, // Si necesitas el email nada mas => @GetUser('email') userLoggedEmail: string,
  ) {
    return {
      data: 'Success!',
      user: user,
      ok: true,
    };
  }

  // Esta ruta tiene composision de decoradores unen los dos de la ruta 2 en uno con el Decorador @Auth(), se le puede mandar roles tambien @Auth(Roles.SUPER_USER) o @Auth(Roles.SUPER_USER, Roles.ADMIN)
  @Get('private-three')
  @ApiResponse({status: 200, description: 'Accesing the private route'})
  @ApiResponse({status: 401, description: 'Unauthorized - not valid credentials or inactive user'})
  @ApiResponse({status: 500, description: 'Sometime went accessing the private route'})
  @Auth(Roles.SUPER_USER)
  onPrivateRouteThree (
    @GetUser() user: User,
  ) {
    return {
      data: 'Success!',
      user: user,
      ok: true,
    };
  }
}
