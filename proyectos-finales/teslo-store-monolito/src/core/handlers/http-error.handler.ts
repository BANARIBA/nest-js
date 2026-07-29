import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { QueryFailedError } from 'node_modules/typeorm';

interface PostgreSqlDriverError {
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
  column?: string;
}

export const httpErrorHandler = (error: unknown): HttpException => {
  const logger: Logger = new Logger('HttpErrorHandler');

  // TODO: Primero mapeamos el error para nosotros los developers
  logger.error(
    error instanceof Error ? error.message : String(error),
    error instanceof Error ? error.stack : undefined,
  );

  // TODO: Ahora mapeamos el error pero para el usuario normal
  /* 1. Si es error mapeado ya por el developer solo se lanza*/
  if (error instanceof HttpException) return error;

  /* 2. Si el error es de la base de datos hay que manejar cual es para lanzarlo */
  if (error instanceof QueryFailedError) {
    const databaseError = error.driverError as
      PostgreSqlDriverError | undefined;
    switch (databaseError?.code) {
      case '23505': // unique_violation
        return new HttpException(
          'El registro ya se encuentra en la base de datos',
          HttpStatus.CONFLICT,
        );
      case '23503': // foreign_key_violation
        return new HttpException(
          'No se puede completar la operacion por que el registro esta relacionado con otros datos.',
          HttpStatus.CONFLICT,
        );
      case '23502': // not_null_violation
        return new HttpException(
          'Uno o mas campos obligatorios/requeridos no fueron proporcionados',
          HttpStatus.BAD_REQUEST,
        );
      case '23514': // check_violation
        return new HttpException(
          'Uno o mas valores no cumplen con las reglas establecidas',
          HttpStatus.BAD_REQUEST,
        );
      case '22P02': // invalid_text_representation ej: enviar "abc" a una columna integer o un UUID inválido.
        return new HttpException(
          'Uno o mas valores tienen un formato no valido.',
          HttpStatus.BAD_REQUEST,
        );
      default:
        logger.error(
          `Error PostgreSQL no controlado: ${JSON.stringify({
            code: databaseError?.code,
            detail: databaseError?.detail,
            constraint: databaseError?.constraint,
            table: databaseError?.table,
            column: databaseError?.column,
          })}`,
        );
        return new HttpException(
          'Ha ocurrido un error insertar en la base de datos, por favor contactar al administrador del sistema.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  // Error no contrado aqui si depende del equipo de desarrollo
  return new HttpException(
    'Ha ocurrido un error. Por favor, comuníquese con el administrador si el problema persiste.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
