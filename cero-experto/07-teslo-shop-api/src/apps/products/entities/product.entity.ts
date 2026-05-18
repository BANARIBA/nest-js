import { Brand } from 'src/apps/brands/entities/brand.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ValueTransformer,
} from 'typeorm';

const jsonTransformer: ValueTransformer = {
  to: (value: string[]) => JSON.stringify(value),
  from: (value: string | null): string[] => {
    if (!value) return [];
    return JSON.parse(value) as string[];
  },
};

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 150 })
  public name!: string;

  @Column({ type: 'text', nullable: true })
  public description?: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public price!: number;

  @Column({ type: 'int', default: 0 })
  public in_stock!: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  public slug!: string;

  @Column({
    type: 'nvarchar',
    length: 'max',
    transformer: jsonTransformer,
  })
  public sizes!: string[];

  @Column({ type: 'text' })
  public gender!: string;

  @Column({ type: 'bit', default: true })
  public is_active!: boolean;

  @CreateDateColumn({ type: 'datetime2' })
  public created_at!: Date;

  @Column({ type: 'datetime2', nullable: true })
  public updated_at?: Date | null;

  @Column({ type: 'datetime2', nullable: true })
  public deleted_at?: Date | null;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  public brand!: Brand;
}
