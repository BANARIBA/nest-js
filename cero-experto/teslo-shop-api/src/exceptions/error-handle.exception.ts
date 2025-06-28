import { BadRequestException, HttpException, InternalServerErrorException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export const errorHandleException = (error) => {
  if (error instanceof HttpException) throw error;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if(error instanceof QueryFailedError && error.driverError['code'] === '23505') throw new BadRequestException('Duplicated record.');
  throw new InternalServerErrorException(error);
};
