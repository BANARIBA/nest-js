import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
@Controller('seeds')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post(':quantity')
  executeSeed(
    @Param('quantity', ParseIntPipe) quantity: number
  ) {
    return this.seedService.executeSeed(quantity);
  }
}
