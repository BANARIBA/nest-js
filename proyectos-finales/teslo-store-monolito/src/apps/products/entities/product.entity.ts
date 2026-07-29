import { Brand } from 'src/apps/brands/entities/brand.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  public title!: string;

  @Column({ type: 'text', nullable: true })
  public description!: string;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0,
  })
  public price!: number;

  @Column({ type: 'text', unique: true })
  public slug!: string;

  @Column({ type: 'int', default: 0 })
  public stock!: number;

  @Column({ type: 'text', array: true })
  public sizes!: string[];

  @Column({ type: 'text' })
  public gender!: string;

  @Column({ type: 'boolean', default: true })
  public is_active!: boolean;

  @ManyToOne(() => Brand, (brand) => brand.products, { nullable: false })
  @JoinColumn({ name: 'brand_id' })
  public brand!: Brand;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  public created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  public updated_at!: Date | null;

  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  public deleted_at!: Date | null;

  @BeforeInsert()
  @BeforeUpdate()
  checkSlug() {
    const valueToSlug = this.slug?.trim() || this.title;
    this.slug = valueToSlug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
