import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column('text')
  public url!: string;

  @Column('text')
  public public_id!: string; // Útil para borrar la imagen de Cloudinary/AWS después

  @Column('text')
  public file_extension!: string; // Ejemplo: 'jpg', 'png'

  @Column('text')
  public mime_type!: string; // Ejemplo: 'image/jpeg'

  @Column('bigint')
  public size_bytes!: number; // Tamaño en bytes

  @CreateDateColumn()
  public created_at!: Date;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  public product!: Product;
}
