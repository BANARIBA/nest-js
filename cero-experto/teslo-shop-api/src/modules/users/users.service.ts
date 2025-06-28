import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { errorHandleException } from 'src/exceptions/error-handle.exception';
import { NewAccountDto } from '../auth/dtos/new-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { encryptParam } from 'src/shared/utils/bcrypt.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createFromNewAccount(newAccountDto: NewAccountDto): Promise<User> {
    try {
      const user: User = this.userRepository.create({
        ...newAccountDto,
        password: encryptParam(newAccountDto.password),
      });
      return await this.userRepository.save(user);
    } catch (error) {
      return errorHandleException(error);
    }
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: id } });
      return user;
    } catch (error) {
      return errorHandleException(error);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
        select: {
          email: true,
          fullName: true,
          id: true,
          password: true,
          roles: true,
          isActive: true,
        },
      });
      if (!user) throw new NotFoundException(`User ${email} was not found.`);
      return user;
    } catch (error) {
      return errorHandleException(error);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
