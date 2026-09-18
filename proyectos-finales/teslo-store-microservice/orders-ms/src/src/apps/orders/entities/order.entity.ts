import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../enums';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0,
  })
  public total_amoung!: number;

  @Column({
    type: 'int',
    default: 0,
  })
  public total_items!: number;

  @Column({ type: 'varchar', nullable: false, default: OrderStatus.PENDING })
  public status!: OrderStatus;

  @Column({
    type: 'boolean',
    default: false,
  })
  public paid!: boolean;

  @Column({ type: 'timestamptz', default: null })
  public paid_at!: Date | null;

  @Column({ type: 'timestamptz', default: new Date() })
  public created_at!: Date;

  @Column({ type: 'timestamptz', default: null })
  public update_at!: Date | null;
}
