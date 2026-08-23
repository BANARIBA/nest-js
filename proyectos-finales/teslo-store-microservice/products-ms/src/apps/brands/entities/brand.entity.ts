import { Product } from "src/apps/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;
  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  public name!: string;
  @Column({ type: 'boolean', default: false })
  public is_active!: boolean;
  @Column({ type: 'timestamptz', default: new Date() })
  public created_at?: Date | null;
  @Column({ type: 'timestamptz', default: null })
  public updated_at?: Date | null;
  @Column({ type: 'timestamptz', default: null })
  public deleted_at?: Date | null;
  @OneToMany(() => Product, (p) => p.brand)
  public products!: Product[];
}
