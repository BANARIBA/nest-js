import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CarsModule } from '../cars/cars.module';
import { BrandsModule } from '../brands/brands.module';

@Module({
  imports: [
    CarsModule,
    BrandsModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [],
})
export class SeedModule {}
