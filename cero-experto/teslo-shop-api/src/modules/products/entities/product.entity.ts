import { Brand } from 'src/modules/brands/entities/brand.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImages } from './product-image.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  public title: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @Column({ type: 'text', unique: true })
  public slug: string;

  @Column({ type: 'numeric', default: 0 })
  public price: number;

  @Column({ type: 'int', default: 0 })
  public stock: number;

  @Column({ type: 'text', array: true })
  public sizes: string[];

  @Column({ type: 'text' })
  public gender: string;

  @Column({ type: 'boolean', default: true })
  public isActive: boolean;

  @ManyToOne(() => Brand, (brand) => brand.products)
  public brand: string;

  @Column({ type: 'text', array: true, default: [] })
  public tags: string[];

  @OneToMany(() => ProductImages, (productImages) => productImages.product, {
    cascade: true,
  })
  public images?: ProductImages[];

  @ManyToOne(() => User, (user) => user.products, { nullable: false })
  user: string;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
