import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export const httpHandleError = (error: unknown): never => {
  if (error instanceof HttpException) {
    throw error;
  }

  if (error instanceof QueryFailedError) {
    const driverError = error.driverError as { number?: number };

    if (driverError.number === 2627 || driverError.number === 2601) {
      throw new BadRequestException(
        'El registro ya existe en la base de datos (Llave duplicada).',
      );
    }
  }
  throw new InternalServerErrorException(
    'Ocurrió un error inesperado. Por favor, revise los logs del servidor.',
  );
};
