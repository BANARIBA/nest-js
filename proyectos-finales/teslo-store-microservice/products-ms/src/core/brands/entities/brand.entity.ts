import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column('varchar', { unique: true })
  public name!: string;

  @Column('varchar', { nullable: true })
  public description!: string;

  @Column('boolean', { default: true })
  public is_active!: boolean;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  public created_at!: Date;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  public deleted_at!: Date | null;

  @OneToMany(() => Product, (product) => product.brand)
  public products!: Product[];
}
