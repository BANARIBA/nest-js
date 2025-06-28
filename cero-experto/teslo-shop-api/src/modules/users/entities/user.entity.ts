import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoles } from '../enums/roles.enum';
import { Product } from 'src/modules/products/entities/product.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 150, nullable: false, unique: true })
  public email: string;

  @Column({ type: 'text', nullable: false, select: false })
  public password: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  public fullName: string;

  @Column({ type: 'boolean', default: true })
  public isActive: string;

  @Column({ type: 'text', array: true, default: [UserRoles.USER] })
  public roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
