import { Module } from '@nestjs/common';
import { BasicReportsService } from './basic-reports.service';
import { BasicReportsController } from './basic-reports.controller';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  imports: [PrinterModule],
  controllers: [BasicReportsController],
  providers: [BasicReportsService],
})
export class BasicReportsModule {}
