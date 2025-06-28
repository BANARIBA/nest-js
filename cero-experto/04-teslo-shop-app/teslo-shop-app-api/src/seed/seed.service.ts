import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/product.seed';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor (
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async runProductSeed () {
    await this.deleteTables();
    const firstUser = await this.createUsers();
    this.createProducts(firstUser);
    return "Products Seed Executed!";
  }

  private async deleteTables () {
    await this.productService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async createUsers () {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user));
    });
    const dbUsers = await this.userRepository.save(users);
    return dbUsers[0];
  }

  private async createProducts (user: User) {
    await this.productService.deleteAllProducts();
    const seedProducts = initialData.products;
    const insertPromises = [];
    seedProducts.forEach(product => {
      insertPromises.push(this.productService.create(product, user));
    });
    await Promise.all(insertPromises);
  }
}
