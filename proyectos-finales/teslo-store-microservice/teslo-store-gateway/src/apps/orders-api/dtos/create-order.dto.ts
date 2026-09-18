import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator";
import { OrderStatus } from "../enums";


export class CreateOrderDto {
    @IsNumber()
    @IsPositive()
    public total_amount!: number;

    @IsNumber()
    @IsPositive()
    public total_items!: number;

    @IsEnum(OrderStatus, { message: `Posible values are: ${OrderStatus.CANCELLED}, ${OrderStatus.DELIVERED}, ${OrderStatus.PENDING}` })
    @IsOptional()
    public status: OrderStatus = OrderStatus.PENDING;
    
    @IsBoolean()
    @IsOptional()
    public paid: boolean = false;
}