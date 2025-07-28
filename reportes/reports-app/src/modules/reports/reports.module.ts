import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrinterModule } from '../printer/printer.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [PrinterModule, CommonModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
