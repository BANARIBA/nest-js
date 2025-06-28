import { IsOptional, IsString } from 'class-validator';

export class GetCountriesByDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  continent?: string;
}
