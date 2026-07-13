import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Brand } from '../../brands/entities/brand.entity';
import { ProductImage } from './product-image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column('varchar')
  public name!: string;

  @Column('varchar', { nullable: false, default: '' })
  public description!: string;

  @Column({
    type: 'decimal',
    precision: 15, // Total de dígitos (ej: 99999999.99)
    scale: 2, // Cuántos de esos dígitos son decimales
    default: 0,
  })
  public price!: number;

  @Column('int', { default: 0 })
  public in_stock!: number;

  @Column('boolean', { default: true })
  public is_active!: boolean;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  public created_at!: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public deleted_at!: Date | null;

  // Relation: Many products belong to one brand
  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  public brand!: Brand;

  // Relation: One product can have many images
  @OneToMany(() => ProductImage, (image) => image.product)
  public images!: ProductImage[];
}
