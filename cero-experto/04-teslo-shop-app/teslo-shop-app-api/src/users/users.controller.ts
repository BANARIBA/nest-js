import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/dtos';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({status: 201, description: 'User created susccessfully', type: User})
  @ApiResponse({status: 401, description: 'User was not authorization for this request'})
  @ApiResponse({status: 500, description: 'Sometime went wrong creating user'})
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({status: 200, description: 'Users getting susccessfully'})
  @ApiResponse({status: 500, description: 'Sometime went wrong getting the users'})
  findAll(
    @Query() paginationDto: PaginationDto
  ) {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({status: 200, description: 'User getting susccessfully'})
  @ApiResponse({status: 500, description: 'Sometime went wrong getting user'})
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({status: 200, description: 'User updated susccessfully', type: User})
  @ApiResponse({status: 401, description: 'User was not authorization for this request'})
  @ApiResponse({status: 404, description: 'User not found'})
  @ApiResponse({status: 500, description: 'Sometime went wrong updating user'})
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({status: 201, description: 'User delete susccessfully'})
  @ApiResponse({status: 404, description: 'User not found'})
  @ApiResponse({status: 401, description: 'User was not authorization for this request'})
  @ApiResponse({status: 500, description: 'Sometime went wrong deleting user'})
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
