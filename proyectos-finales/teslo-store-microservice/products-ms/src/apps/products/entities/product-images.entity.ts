import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  public fileName!: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  public mimeType!: string;

  @Column({
    type: 'integer',
  })
  public fileSize!: number;

  @Column({
    type: 'bytea',
    select: false,
  })
  public data!: Buffer;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public altText?: string;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  @ManyToOne(() => Product, (p) => p.productImages)
  @JoinColumn({ name: 'product_id' })
  public product!: Product;
}
