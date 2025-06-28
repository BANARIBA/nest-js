import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImages {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'text', nullable: false })
  public url: string;

  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  product: Product;
}
