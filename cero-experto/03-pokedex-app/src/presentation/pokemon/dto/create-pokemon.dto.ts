import { IsInt, IsNotEmpty, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    public readonly name: string;

    @IsInt()
    @IsPositive()
    @Min(1)
    public readonly no: number;
}
