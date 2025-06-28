import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';

@Controller('cars')
export class CarsController {

  constructor (private readonly carsService: CarsService) {}

  @Get()
  getAllCars () {
    return this.carsService.findAll;
  }

  @Get(':carId')
  getCarById (@Param('carId', ParseUUIDPipe) carId: string) {
    return this.carsService.finOneById(carId);
  }

  @Post()
  createCar (@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }


  @Patch(':carId')
  updateCar (
    @Param('carId', ParseUUIDPipe) carId: string, 
    @Body() updateCarDto: UpdateCarDto,
  ) {
    return this.carsService.update(updateCarDto, carId);
  }

  @Delete(':carId')
  deleteCar (@Param('carId', ParseUUIDPipe) carId: string) {
    return this.carsService.delete(carId);
  }

}
