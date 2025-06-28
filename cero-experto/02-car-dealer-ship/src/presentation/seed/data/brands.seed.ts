import { UUIDConfig } from 'src/config';
import { Brand } from 'src/presentation/brands/entities/brand.entity';

export const BRANDS_SEED: Brand[] = [
  {
    id: UUIDConfig.uuid,
    name: 'TESLA',
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    id: UUIDConfig.uuid,
    name: 'FERRARI',
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    id: UUIDConfig.uuid,
    name: 'SUBARU',
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    id: UUIDConfig.uuid,
    name: 'HIUNDAY',
    createdAt: new Date(),
    updatedAt: null,
  },
];
