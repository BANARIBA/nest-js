import { Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces';
import { UUIDConfig } from 'src/config';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';

@Injectable()
export class CarsService {

  private cars: Car[] = [];

  public finOneById (carId: string): Car {
    const car = this.cars.find(car => car.id === carId);
    if (!car) throw new NotFoundException(`Car with id ${carId} not found!`);
    return car;
  }

  public get findAll () {
    return this.cars;
  }

  public create (createCarDto: CreateCarDto) {
    const car: Car = {id: UUIDConfig.uuid, ...createCarDto};
    this.cars = [car, ...this.cars];
    return car;
  }

  public update (updateCarDto: UpdateCarDto, carId: string) {
    let existsCar: Car = this.finOneById(carId);
    this.cars = this.cars.map(car => {
      if (car.id === existsCar.id) {
        existsCar = {
          ...existsCar,
          ...updateCarDto,
          id: carId,
        }
        return existsCar;
      }
      return car;
    });
    return existsCar;
  }

  public delete (carId: string) {
    let existsCar: Car = this.finOneById(carId);
    this.cars = this.cars.filter(car => car.id !== carId);
    return existsCar;
  }

  public fillCarsWithSeedData (cars: Car[]) {
    this.cars = cars;
  }
}
