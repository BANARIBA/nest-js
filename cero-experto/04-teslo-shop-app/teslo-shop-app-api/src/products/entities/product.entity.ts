import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/users/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'products'})
export class Product {

  @ApiProperty({
    example: '056bface-725e-49c2-8218-e04b5bc06f4c',
    description: 'Product id',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Polos t-shirt',
    description: 'Product name',
  })
  @Column('varchar', {length: 150, nullable: false, unique: true})
  title: string;

  @ApiProperty({
    example: 10.99,
    description: 'Product price'
  })
  @Column('float', {nullable: false, default: 0})
  price: number;

  @ApiProperty({
    example: 'Great for summer winter and spring weather, for kids, men and women.',
    description: 'Specs for product'
  })
  @Column('text', {default: '', nullable: true})
  description: string;

  @ApiProperty({
    example: 'polos_t_shirt',
    description: 'Field that describe the product',
    uniqueItems: true,
  })
  @Column({type: 'varchar', length: 150, unique: true})
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product quantity'
  })
  @Column('int', {default: 0})
  stock: number;

  @ApiProperty({
    example: '["XS","S","M","L","XL","XXL"]',
    description: 'Product sizes'
  })
  @Column({type: 'text', array: true})
  sizes: string[];

  @ApiProperty({
    example: '"women"',
    description: 'Gender for this product can use'
  })
  @Column('varchar')
  gender: string;

  @ApiProperty({
    example: '"shirt"',
    description: 'Clothes type'
  })
  @Column({type: 'text', array: true, default: []})
  tags: string[];

  @ApiProperty({
    example: '["https://image-1.png", "http://image-2.png"]',
    description: 'Product Images'
  })
  @OneToMany(
    () => ProductImage, 
    (productImage) => productImage.product,
    {cascade: true, eager: true},
  )
  images?: ProductImage[];

  @ApiProperty({
    example: '89950191-8efb-4475-92b5-fdb3b7f98943',
    description: 'User that was created the product'
  })
  @ManyToOne(
    () => User,
    (user) => user.products,
    {eager: true}
  )
  user: User;

  @BeforeInsert()
  checkSlug () {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .trim()
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')
      .replaceAll('-', '_');
  }
  
  @BeforeUpdate()
  checkSlugAgain () {
    this.slug = this.slug
      .trim()
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')
      .replaceAll('-', '_');
  }

}
