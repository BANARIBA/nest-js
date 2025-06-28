import { IsNotEmpty, IsString } from "class-validator";

export class CreateBrandDto {
    @IsString()
    @IsNotEmpty()
    public readonly name: string;
}
