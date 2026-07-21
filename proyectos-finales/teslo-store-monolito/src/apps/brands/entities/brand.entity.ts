import { Product } from 'src/apps/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  public name!: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  public is_active!: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  public created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  public updated_at!: Date | null;

  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  public deleted_at!: Date | null;

  @OneToMany(() => Product, (product) => product.brand)
  public products!: Product[];
}
