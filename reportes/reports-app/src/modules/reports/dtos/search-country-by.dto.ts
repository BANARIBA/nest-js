import { continents } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";

export class SearchCountryByDto {
    @IsOptional()
    @IsEnum(continents)
    continent?: continents;
}