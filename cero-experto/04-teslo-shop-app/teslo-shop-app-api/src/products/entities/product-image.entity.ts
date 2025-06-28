import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({name: "product_images"})
export class ProductImage {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false, type: 'text'})
  url: string;

  @ManyToOne(
    () => Product, 
    (product) => product.images,
    {onDelete: 'CASCADE'} // Si se borra el producto se borran las imagenes con esta linea
  )
  product: Product;

}