import { Controller, Get, Param } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  runSeed(@Param() id: string) {
    return this.seedService.populateDB();
  }
}
