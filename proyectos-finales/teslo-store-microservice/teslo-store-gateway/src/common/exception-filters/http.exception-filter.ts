import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const rpcError = exception.getError();

    if (
      rpcError !== null &&
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = Number(rpcError.status);

      return response
        .status(Number.isNaN(status) ? HttpStatus.BAD_REQUEST : status)
        .json({
          status: Number.isNaN(status)
            ? HttpStatus.BAD_REQUEST
            : status,
          message: rpcError.message,
        });
    }

    return response.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      message:
        typeof rpcError === 'string'
          ? rpcError
          : 'Error en el microservicio',
    });
  }
}