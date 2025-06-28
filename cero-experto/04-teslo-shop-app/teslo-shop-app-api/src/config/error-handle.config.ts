import { HttpException, HttpStatus } from "@nestjs/common";

export const  handleExceptions = (error: any) => {
  if (error instanceof HttpException) throw error;
  if (error.code === '23505') throw new HttpException(error.detail, HttpStatus.BAD_REQUEST);
  throw new HttpException(`Sometime went wrong: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
}