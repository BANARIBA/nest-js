import { Product } from 'src/apps/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  public name!: string;

  @Column({ type: 'bit', default: true })
  public is_active!: boolean;

  @CreateDateColumn({ type: 'datetime2' })
  public created_at!: Date;

  @Column({ type: 'datetime2', nullable: true })
  public updated_at?: Date | null;

  @Column({ type: 'datetime2', nullable: true })
  public deleted_at?: Date | null;

  @OneToMany(() => Product, (product) => product.brand)
  products!: Product[];
}
