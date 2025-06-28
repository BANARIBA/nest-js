import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CarsService } from '../cars/cars.service';
import { BRANDS_SEED, CARS_SEED } from './data';
import { BrandsService } from '../brands/brands.service';

@Injectable()
export class SeedService {

  constructor (
    private readonly carsService: CarsService,
    private readonly brandsService: BrandsService,
  ) {}

  public populateDB () {
    this.carsService.fillCarsWithSeedData(CARS_SEED);
    this.brandsService.fillBrandsWithSeedData(BRANDS_SEED);
    return new HttpException('Seed Executed Successfully!', HttpStatus.OK);
  }
}
