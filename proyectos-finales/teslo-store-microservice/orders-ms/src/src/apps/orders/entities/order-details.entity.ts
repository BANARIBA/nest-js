import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({
  name: 'order_details',
})
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public product_id!: string;

  @Column({
    type: 'int',
    default: 0,
  })
  public quantity!: number;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    default: 0,
  })
  public price!: number;

  @ManyToOne(() => Order, (o) => o.order_details)
  @JoinColumn({ name: 'order_id' })
  public order!: Order;
}
