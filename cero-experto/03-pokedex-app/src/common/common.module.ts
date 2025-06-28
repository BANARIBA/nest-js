import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
  providers: [AxiosAdapter], // OJO COMO ES UN SERVICIO POR ASI DECIRLO QUE NOSOTROS CREAMOS TENEMOS QUE AGREGARLO A PROVIDERS
  exports: [AxiosAdapter], // SI QUEREMOS QUE LO USEN FUERA DEL MODULO EXPORTARLO
})
export class CommonModule {}
