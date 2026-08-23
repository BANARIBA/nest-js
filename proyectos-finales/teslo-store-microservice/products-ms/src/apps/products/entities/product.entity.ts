import { Brand } from 'src/apps/brands/entities/brand.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-images.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
  @Column({ type: 'varchar', length: 150, unique: true })
  public name!: string;
  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0,
  })
  public price!: number;
  @ManyToOne(() => Brand, (b) => b.products)
  @JoinColumn({ name: 'brand_id' })
  public brand!: Brand;
  @Column({ type: 'boolean', default: false })
  public is_active!: boolean;
  @Column({ type: 'timestamptz', default: new Date() })
  public created_at?: Date | null;
  @Column({ type: 'timestamptz', default: null })
  public updated_at?: Date | null;
  @Column({ type: 'timestamptz', default: null })
  public deleted_at?: Date | null;
  @OneToMany(() => ProductImage, (pi) => pi.product)
  public productImages!: ProductImage[];
}
