import { Module } from '@nestjs/common';
import { ReportsModule } from './modules/reports/reports.module';
import { PrinterModule } from './modules/printer/printer.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ReportsModule, PrinterModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

