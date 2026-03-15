import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Brand } from '../../brands/entities/brand.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  public name: string;

  @Column({
    type: 'numeric',
    precision: 18,
    scale: 4,
    nullable: false,
  })
  public price: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  public is_active: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public created_at: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  public deleted_at: Date | null;

  @ManyToOne(() => Brand, (b) => b.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;
}
