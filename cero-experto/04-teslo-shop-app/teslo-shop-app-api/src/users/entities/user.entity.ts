import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {

  @ApiProperty({
    example: '89950191-8efb-4475-92b5-fdb3b7f98943',
    description: 'User id'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Tony Stark',
    description: 'User Complete Name'
  })
  @Column({type: 'varchar', length: 150, nullable: false})
  full_name: string;

  @ApiProperty({
    example: 'tstark@gmail.com',
    description: 'User Email'
  })
  @Column({type: 'varchar', length: 150, unique: true, nullable: false})
  email: string;

  @ApiProperty({
    example: 'asd.456',
    description: 'User Password'
  })
  @Column({type: 'text', nullable: false, select: false})
  password: string;

  @ApiProperty({
    example: true,
    description: 'Field that veriy is the user is active or not'
  })
  @Column({type: 'boolean', default: true})
  is_active: boolean;

  @ApiProperty({
    example: '["USER", "ADMIN"]',
    description: 'User role for to do accesing in the app'
  })
  @Column({type: 'text', array: true, default: ['USER']})
  roles: string[];

  @OneToMany(
    () => Product, 
    (product) => product.user
  )
  products: Product[]

}
