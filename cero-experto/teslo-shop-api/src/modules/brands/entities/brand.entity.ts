import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  public name: string;

  @Column({ type: 'boolean', default: true })
  public isActive: boolean;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
