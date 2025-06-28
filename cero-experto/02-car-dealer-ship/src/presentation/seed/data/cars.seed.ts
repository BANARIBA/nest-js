import { UUIDConfig } from 'src/config';
import { Car } from 'src/presentation/cars/interfaces';

export const CARS_SEED: Car[] = [
  {
    id: UUIDConfig.uuid,
    brand: 'Toyota',
    model: 'Corolla',
  },
  {
    id: UUIDConfig.uuid,
    brand: 'Honda',
    model: 'Civic',
  },
  {
    id: UUIDConfig.uuid,
    brand: 'Toyota',
    model: 'Hilux',
  },
  {
    id: UUIDConfig.uuid,
    brand: 'Toyota',
    model: 'Tacoma',
  },
];
